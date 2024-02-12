import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'
import pgPromise, { type IMain, type IInitOptions, type IDatabase, as } from 'pg-promise'
import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'
import { monitorPgPool } from '@christiangalsterer/node-postgres-prometheus-exporter'

jest.mock('@christiangalsterer/node-postgres-prometheus-exporter', () => ({
  monitorPgPool: jest.fn()
}))

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
    expect(initOptionsEmpty.receive).toBeDefined()
    expect(initOptionsEmpty.receive).toBeInstanceOf(Function)
    expect(initOptionsEmpty.receive?.name).toStrictEqual('bound onReceive')
    expect(initOptionsEmpty.task).toBeDefined()
    expect(initOptionsEmpty.task).toBeInstanceOf(Function)
    expect(initOptionsEmpty.task?.name).toStrictEqual('bound onTask')
    expect(initOptionsEmpty.transact).toBeDefined()
    expect(initOptionsEmpty.transact).toBeInstanceOf(Function)
    expect(initOptionsEmpty.transact?.name).toStrictEqual('bound onTransaction')
  })

  test('tests if event handlers are registered with previous handlers', () => {
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register)
    exporter.enableMetrics()
    expect(initOptionsWithHandlers.receive).toBeDefined()
    expect(initOptionsWithHandlers.receive).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.task).toBeDefined()
    expect(initOptionsWithHandlers.task).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.transact).toBeDefined()
    expect(initOptionsWithHandlers.transact).toBeInstanceOf(Function)
  })

  test('tests if monitorPgPool is called with default parameter', () => {
    const monitorPgPoolMock = monitorPgPool as jest.Mock
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register)
    exporter.enableMetrics()
    expect(monitorPgPoolMock).toHaveBeenCalledWith(db.$pool, register, { defaultLabels: undefined })
  })

  test('tests if monitorPgPool is called with optional parameter', () => {
    const monitorPgPoolMock = monitorPgPool as jest.Mock
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register, options)
    exporter.enableMetrics()
    expect(monitorPgPoolMock).toHaveBeenCalledWith(db.$pool, register, { defaultLabels: { foo: 'bar', alice: 2 } })
  })
})
