import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'
import pgPromise, { type IMain, type IInitOptions, type IDatabase } from 'pg-promise'
import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'
import { monitorPgPool } from '@christiangalsterer/node-postgres-prometheus-exporter'

jest.mock('@christiangalsterer/node-postgres-prometheus-exporter', () => ({
  monitorPgPool: jest.fn()
}))

describe('tests PgPoolPrometheusExporter', () => {
  let register: Registry
  const initOptionsWithoutHandlers: IInitOptions = {}
  const initOptionsWithHandlers: IInitOptions = {
    receive: console.log,
    task: console.log,
    transact: console.log
  }

  const pgp: IMain = pgPromise(initOptionsWithoutHandlers)
  const db: IDatabase<unknown> = pgp({})

  beforeEach(() => {
    register = new Registry()
  })

  test('test if all metrics are registered in registry', () => {
    const metrics: string[] = [
      'pg_commands_seconds', 'pg_tasks_seconds', 'pg_transactions_seconds'
    ]
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptionsWithoutHandlers, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const metrics: string[] = [
      'pg_commands_seconds', 'pg_tasks_seconds', 'pg_transactions_seconds'
    ]
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptionsWithoutHandlers, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('tests if event handlers are registered without previous handlers', () => {
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithoutHandlers, register)
    exporter.enableMetrics()
    expect(initOptionsWithoutHandlers.receive).toBeDefined()
    expect(initOptionsWithoutHandlers.receive).toBeInstanceOf(Function)
    expect(initOptionsWithoutHandlers.receive?.name).toStrictEqual('bound onReceive')
    expect(initOptionsWithoutHandlers.task).toBeDefined()
    expect(initOptionsWithoutHandlers.task).toBeInstanceOf(Function)
    expect(initOptionsWithoutHandlers.task?.name).toStrictEqual('bound onTask')
    expect(initOptionsWithoutHandlers.transact).toBeDefined()
    expect(initOptionsWithoutHandlers.transact).toBeInstanceOf(Function)
    expect(initOptionsWithoutHandlers.transact?.name).toStrictEqual('bound onTransaction')
  })

  test('tests if event handlers are registered with previous handlers', () => {
    const exporter = new PgPromisePrometheusExporter(db, initOptionsWithHandlers, register)
    exporter.enableMetrics()
    expect(initOptionsWithHandlers.receive).toBeDefined()
    expect(initOptionsWithHandlers.receive).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.receive?.name).toBeDefined()
    expect(initOptionsWithHandlers.receive?.name).not.toStrictEqual('bound onReceive')
    expect(initOptionsWithHandlers.task).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.task?.name).toBeDefined()
    expect(initOptionsWithHandlers.task?.name).not.toStrictEqual('bound onTask')
    expect(initOptionsWithHandlers.transact).toBeDefined()
    expect(initOptionsWithHandlers.transact).toBeInstanceOf(Function)
    expect(initOptionsWithHandlers.transact?.name).toBeDefined()
    expect(initOptionsWithHandlers.transact?.name).not.toStrictEqual('bound onTransaction')
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
