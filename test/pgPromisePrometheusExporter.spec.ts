import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'
import pgPromise, { type IMain, type IInitOptions, type IDatabase } from 'pg-promise'

import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'

describe('tests PgPoolPrometheusExporter', () => {
  let register: Registry
  const initOptions: IInitOptions = {}
  const pgp: IMain = pgPromise(initOptions)
  const db: IDatabase<unknown> = pgp({})

  beforeEach(() => {
    register = new Registry()
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptions, register)
    expect(register.getSingleMetric('pg_commands_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_tasks_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_transactions_seconds')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(3)
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new PgPromisePrometheusExporter(db, initOptions, register, options)
    expect(register.getSingleMetric('pg_commands_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_tasks_seconds')).toBeDefined()
    expect(register.getSingleMetric('pg_transactions_seconds')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(3)
  })
})
