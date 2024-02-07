/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'
import { Histogram, type Registry } from 'prom-client'
import pgPromise, { type IMain, type IInitOptions, type IDatabase } from 'pg-promise'

jest.mock('prom-client', () => ({
  Histogram: jest.fn(() => {
    return {
      set: jest.fn(),
      get: jest.fn()
    }
  })
}))

describe('test if all metrics are created with the correct parameters', () => {
  const options = { defaultLabels: { foo: 'bar', alice: 2 } }
  const register: Registry = {} as Registry
  const initOptions: IInitOptions = {}
  const pgp: IMain = pgPromise(initOptions)
  const db: IDatabase<unknown> = pgp({})

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('tests if all pool metrics are created', () => {
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptions, register)

    expect(Histogram).toHaveBeenCalledTimes(3)

    expect(Histogram).toHaveBeenCalledWith({
      name: 'pg_commands_seconds',
      help: 'Timer of pg commands',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['host', 'database', 'command', 'status'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'pg_tasks_seconds',
      help: 'Timer of pg tasks',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['host', 'database', 'task', 'status'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'pg_transactions_seconds',
      help: 'Timer of pg transactions',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['host', 'database', 'transaction', 'status'],
      registers: [register]
    })
  })

  test('tests if all pool metrics are created with default labels', () => {
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptions, register, options)

    expect(Histogram).toHaveBeenCalledTimes(3)

    expect(Histogram).toHaveBeenCalledWith({
      name: 'pg_commands_seconds',
      help: 'Timer of pg commands',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['host', 'database', 'command', 'status', 'foo', 'alice'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'pg_tasks_seconds',
      help: 'Timer of pg tasks',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['host', 'database', 'task', 'status', 'foo', 'alice'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'pg_transactions_seconds',
      help: 'Timer of pg transactions',
      buckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
      labelNames: ['host', 'database', 'transaction', 'status', 'foo', 'alice'],
      registers: [register]
    })
  })
})
