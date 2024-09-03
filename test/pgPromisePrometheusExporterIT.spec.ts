import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import pgPromise, { type IDatabase, type IInitOptions, type IMain } from 'pg-promise'
import { collectDefaultMetrics, type MetricValueWithName, Registry } from 'prom-client'

import { monitorPgPromise } from '../src'

const initOptions: IInitOptions = {}

let register: Registry
let db: IDatabase<unknown>
let pgp: IMain = pgPromise(initOptions)
let container: StartedPostgreSqlContainer

describe('it for pgPromisePrometheusExporter', () => {
  beforeAll(async () => {
    container = await new PostgreSqlContainer().start()
  }, 60000)

  afterAll(async () => {
    await container.stop()
  })

  beforeEach(() => {
    register = new Registry()
    collectDefaultMetrics({ register })
    register.clear()

    pgp = pgPromise(initOptions)

    db = pgp({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
      ssl: false,
      max: 20
    })

    monitorPgPromise(db, initOptions, register)
  })

  test('it connection metrics', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await db.any('SELECT NOW()')
    const pgPoolConnectionsCreatedTotalMetric = await register.getSingleMetric('pg_pool_connections_created_total')?.get()
    expect(pgPoolConnectionsCreatedTotalMetric?.type).toEqual('counter')
    expect(pgPoolConnectionsCreatedTotalMetric?.values.length).toEqual(1)
    expect(pgPoolConnectionsCreatedTotalMetric?.values.at(0)?.value).toEqual(1)

    const pgPoolMaxMetric = await register.getSingleMetric('pg_pool_max')?.get()
    expect(pgPoolMaxMetric?.type).toEqual('gauge')
    expect(pgPoolMaxMetric?.values.length).toEqual(1)
    expect(pgPoolMaxMetric?.values.at(0)?.value).toEqual(20)
  })

  test('it command metrics', async () => {
    let result = await db.any('SELECT NOW()')
    let pgCommandDurationSecondsMetric = await register.getSingleMetric('pg_command_duration_seconds')?.get()
    expect(pgCommandDurationSecondsMetric?.type).toEqual('histogram')

    expect(pgCommandDurationSecondsMetric?.values.length).toBe(17)
    expect(getValueByName('pg_command_duration_seconds_count', pgCommandDurationSecondsMetric?.values)?.value).toEqual(1)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    result = await db.any('SELECT NOW()')
    pgCommandDurationSecondsMetric = await register.getSingleMetric('pg_command_duration_seconds')?.get()
    expect(getValueByName('pg_command_duration_seconds_count', pgCommandDurationSecondsMetric?.values)?.value).toEqual(2)
    expect(getValueByName('pg_command_duration_seconds_sum', pgCommandDurationSecondsMetric?.values)?.value).toBeGreaterThanOrEqual(0)
  })

  test('it task metrics', async () => {
    let result = await db.task('my-task', (t: { any: (arg0: string) => unknown }) => {
      return t.any('SELECT NOW()')
    })
    let pgTaskDurationSecondsMetric = await register.getSingleMetric('pg_task_duration_seconds')?.get()
    expect(pgTaskDurationSecondsMetric?.type).toEqual('histogram')
    expect(getValueByName('pg_task_duration_seconds_count', pgTaskDurationSecondsMetric?.values)?.value).toEqual(1)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    result = await db.task('my-task', (t: { any: (arg0: string) => unknown }) => {
      return t.any('SELECT NOW()')
    })
    pgTaskDurationSecondsMetric = await register.getSingleMetric('pg_task_duration_seconds')?.get()
    expect(getValueByName('pg_task_duration_seconds_count', pgTaskDurationSecondsMetric?.values)?.value).toEqual(2)
    expect(getValueByName('pg_task_duration_seconds_sum', pgTaskDurationSecondsMetric?.values)?.value).toBeGreaterThanOrEqual(0)
  })

  test('it transaction metrics', async () => {
    let result = await db.tx('my-task', (t: { any: (arg0: string) => unknown }) => {
      return t.any('SELECT NOW()')
    })
    let pgTransactionDurationSecondsMetric = await register.getSingleMetric('pg_transaction_duration_seconds')?.get()
    expect(pgTransactionDurationSecondsMetric?.type).toEqual('histogram')
    expect(getValueByName('pg_transaction_duration_seconds_count', pgTransactionDurationSecondsMetric?.values)?.value).toEqual(1)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    result = await db.tx('my-task', (t: { any: (arg0: string) => unknown }) => {
      return t.any('SELECT NOW()')
    })
    pgTransactionDurationSecondsMetric = await register.getSingleMetric('pg_transaction_duration_seconds')?.get()
    expect(getValueByName('pg_transaction_duration_seconds_count', pgTransactionDurationSecondsMetric?.values)?.value).toEqual(2)
    expect(getValueByName('pg_transaction_duration_seconds_sum', pgTransactionDurationSecondsMetric?.values)?.value).toBeGreaterThanOrEqual(0)
  })
})

function getValueByName(name: string, values: Array<MetricValueWithName<string>> | undefined): MetricValueWithName<string> | undefined {
  let result: MetricValueWithName<string> | undefined
  if (values !== undefined) {
    const filtered: Array<MetricValueWithName<string>> = values.filter((v) => v.metricName === name)
    if (filtered.length > 0) {
      result = filtered.at(0)
    } else {
      result = undefined
    }
  }
  return result
}
