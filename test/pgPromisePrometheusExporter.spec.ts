import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'
import pgPromise, { type IMain, type IInitOptions, type IDatabase } from 'pg-promise'

import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'

describe('tests PgPoolPrometheusExporter', () => {
  let register: Registry
  const initOptionsEmpty: IInitOptions = {}
  const initOptionsWithHandlers: IInitOptions = {
    receive: console.log
  }

  const pgp: IMain = pgPromise(initOptionsEmpty)
  const db: IDatabase<unknown> = pgp({})

  beforeEach(() => {
    register = new Registry()
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptionsEmpty, register)
    expect(register.getSingleMetric('pg_commands_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_tasks_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_transactions_seconds')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(3)
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptionsEmpty, register, options)
    expect(register.getSingleMetric('pg_commands_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_tasks_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_transactions_seconds')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(3)
  })

  test('tests if event handlers are registered with no previous handlers', () => {
    const exporter = new PgPromisePrometheusExporter(db, initOptionsEmpty, register)
    exporter.enableMetrics()
    console.log(initOptionsEmpty.receive?.name)
    expect(initOptionsEmpty.receive !== undefined).toBeTruthy()
    expect(typeof initOptionsEmpty.receive === 'function').toBeTruthy()
    expect(initOptionsEmpty.receive?.name).toStrictEqual('bound onReceive')
    expect(initOptionsEmpty.task !== undefined).toBeTruthy()
    expect(typeof initOptionsEmpty.task === 'function').toBeTruthy()
    expect(initOptionsEmpty.task?.name).toStrictEqual('bound onTask')
    expect(initOptionsEmpty.transact !== undefined).toBeTruthy()
    expect(typeof initOptionsEmpty.transact === 'function').toBeTruthy()
    expect(initOptionsEmpty.transact?.name).toStrictEqual('bound onTransaction')
  })

  test('tests if event handlers are registered with previous handlers', () => {
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register)
    exporter.enableMetrics()
    expect(initOptionsWithHandlers.receive !== undefined).toBeTruthy()
    expect(typeof initOptionsWithHandlers.receive === 'function').toBeTruthy()
    expect(initOptionsWithHandlers.task !== undefined).toBeTruthy()
    expect(typeof initOptionsWithHandlers.task === 'function').toBeTruthy()
    expect(initOptionsWithHandlers.transact !== undefined).toBeTruthy()
    expect(typeof initOptionsWithHandlers.transact === 'function').toBeTruthy()
  })
})
