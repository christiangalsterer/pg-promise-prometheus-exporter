import { monitorPgPool } from '@christiangalsterer/node-postgres-prometheus-exporter'
import { beforeEach, describe, expect, test } from '@jest/globals'
import pgPromise, { type IDatabase, type IInitOptions, type IMain } from 'pg-promise'
import { Registry } from 'prom-client'

import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'

jest.mock('@christiangalsterer/node-postgres-prometheus-exporter', () => ({
  monitorPgPool: jest.fn()
}))

describe('tests PgPromisePrometheusExporter', () => {
  let register: Registry
  const initOptionsWithoutHandlers: IInitOptions = {}
  const initOptionsWithHandlers: IInitOptions = {
    receive: console.log,
    task: console.log,
    transact: console.log
  }

  const pgp: IMain = pgPromise(initOptionsWithoutHandlers)
  const db: IDatabase<unknown> = pgp({})
  const metrics: string[] = [
    'pg_command_duration_seconds', 'pg_task_duration_seconds', 'pg_transaction_duration_seconds'
  ]

  beforeEach(() => {
    register = new Registry()
  })

  test('all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptionsWithoutHandlers, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptionsWithoutHandlers, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('event handlers are registered without previous handlers', () => {
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithoutHandlers, register)
    exporter.enableMetrics()
    expect(initOptionsWithoutHandlers.receive).toBeDefined()
    expect(initOptionsWithoutHandlers.receive).toBeInstanceOf(Function)
    expect(initOptionsWithoutHandlers.receive?.name).toBe('bound onReceive')
    expect(initOptionsWithoutHandlers.task).toBeDefined()
    expect(initOptionsWithoutHandlers.task).toBeInstanceOf(Function)
    expect(initOptionsWithoutHandlers.task?.name).toBe('bound onTask')
    expect(initOptionsWithoutHandlers.transact).toBeDefined()
    expect(initOptionsWithoutHandlers.transact).toBeInstanceOf(Function)
    expect(initOptionsWithoutHandlers.transact?.name).toBe('bound onTransaction')
  })

  test('event handlers are registered with previous handlers', () => {
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register)
    exporter.enableMetrics()
    expect(initOptionsWithHandlers.receive).toBeDefined()
    expect(initOptionsWithHandlers.receive).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.receive?.name).toBeDefined()
    expect(initOptionsWithHandlers.receive?.name).not.toBe('bound onReceive')
    expect(initOptionsWithHandlers.task).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.task?.name).toBeDefined()
    expect(initOptionsWithHandlers.task?.name).not.toBe('bound onTask')
    expect(initOptionsWithHandlers.transact).toBeDefined()
    expect(initOptionsWithHandlers.transact).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.transact?.name).toBeDefined()
    expect(initOptionsWithHandlers.transact?.name).not.toBe('bound onTransaction')
  })

  test('monitorPgPool is called', () => {
    const monitorPgPoolMock = monitorPgPool as jest.Mock
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register)
    exporter.enableMetrics()
    expect(monitorPgPoolMock).toHaveBeenCalledWith(db.$pool, register, { defaultLabels: undefined })
  })

  test('monitorPgPool is called with default labels', () => {
    const monitorPgPoolMock = monitorPgPool as jest.Mock
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register, options)
    exporter.enableMetrics()
    expect(monitorPgPoolMock).toHaveBeenCalledWith(db.$pool, register, { defaultLabels: { foo: 'bar', alice: 2 } })
  })
})
