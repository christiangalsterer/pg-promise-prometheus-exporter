import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import pgPromise, { type IDatabase, type IInitOptions, type IMain } from 'pg-promise'
import { collectDefaultMetrics, type MetricValueWithName, Registry } from 'prom-client'

import { monitorPgPromise } from '../src'

const initOptions: IInitOptions = {}
const commandMetrics = ['pg_command_duration_seconds_bucket', 'pg_command_duration_seconds_sum', 'pg_command_duration_seconds_count']
const taskMetrics = ['pg_task_duration_seconds_bucket', 'pg_task_duration_seconds_sum', 'pg_task_duration_seconds_count']
const transactionMetrics = ['pg_transaction_duration_seconds_bucket', 'pg_transaction_duration_seconds_sum', 'pg_transaction_duration_seconds_count']

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

    monitorPgPromise(db, initOptions, register, { defaultLabels: { foo: 'bar', alice: 2 } })
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

  test.each(commandMetrics)('it command metric "%s" is emitted with default labels', async (metricName) => {
    const expectedLabels = { foo: 'bar', alice: 2 }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await db.any('SELECT NOW()')

    const metric = await register.getSingleMetric('pg_command_duration_seconds')?.get()
    expect(metric).toBeDefined()
    if (metric != null) {
      for (const value of metric.values) {
        expect(value.labels).toMatchObject(expectedLabels)
      }
    }
  })

  test('it task metrics', async () => {
    let result = await db.task('my-task', (t: { any: (arg0: string) => unknown }) => t.any('SELECT NOW()'))
    let pgTaskDurationSecondsMetric = await register.getSingleMetric('pg_task_duration_seconds')?.get()
    expect(pgTaskDurationSecondsMetric?.type).toEqual('histogram')
    expect(getValueByName('pg_task_duration_seconds_count', pgTaskDurationSecondsMetric?.values)?.value).toEqual(1)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    result = await db.task('my-task', (t: { any: (arg0: string) => unknown }) => t.any('SELECT NOW()'))
    pgTaskDurationSecondsMetric = await register.getSingleMetric('pg_task_duration_seconds')?.get()
    expect(getValueByName('pg_task_duration_seconds_count', pgTaskDurationSecondsMetric?.values)?.value).toEqual(2)
    expect(getValueByName('pg_task_duration_seconds_sum', pgTaskDurationSecondsMetric?.values)?.value).toBeGreaterThanOrEqual(0)
  })

  test.each(taskMetrics)('it task metric "%s" is emitted with default labels', async (metricName) => {
    const expectedLabels = { foo: 'bar', alice: 2 }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await db.task('my-task', (t: { any: (arg0: string) => unknown }) => t.any('SELECT NOW()'))

    const metric = await register.getSingleMetric('pg_task_duration_seconds')?.get()
    expect(metric).toBeDefined()
    if (metric != null) {
      for (const value of metric.values) {
        expect(value.labels).toMatchObject(expectedLabels)
      }
    }
  })

  test('it transaction metrics', async () => {
    let result = await db.tx('my-tx', (t: { any: (arg0: string) => unknown }) => t.any('SELECT NOW()'))
    let pgTransactionDurationSecondsMetric = await register.getSingleMetric('pg_transaction_duration_seconds')?.get()
    expect(pgTransactionDurationSecondsMetric?.type).toEqual('histogram')
    expect(getValueByName('pg_transaction_duration_seconds_count', pgTransactionDurationSecondsMetric?.values)?.value).toEqual(1)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    result = await db.tx('my-tx', (t: { any: (arg0: string) => unknown }) => t.any('SELECT NOW()'))
    pgTransactionDurationSecondsMetric = await register.getSingleMetric('pg_transaction_duration_seconds')?.get()
    expect(getValueByName('pg_transaction_duration_seconds_count', pgTransactionDurationSecondsMetric?.values)?.value).toEqual(2)
    expect(getValueByName('pg_transaction_duration_seconds_sum', pgTransactionDurationSecondsMetric?.values)?.value).toBeGreaterThanOrEqual(0)
  })

  test.each(transactionMetrics)('it transaction metric "%s" is emitted with default labels', async (metricName) => {
    const expectedLabels = { foo: 'bar', alice: 2 }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await db.tx('my-tx', (t: { any: (arg0: string) => unknown }) => t.any('SELECT NOW()'))

    const metric = await register.getSingleMetric('pg_transaction_duration_seconds')?.get()
    expect(metric).toBeDefined()
    if (metric != null) {
      for (const value of metric.values) {
        expect(value.labels).toMatchObject(expectedLabels)
      }
    }
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
