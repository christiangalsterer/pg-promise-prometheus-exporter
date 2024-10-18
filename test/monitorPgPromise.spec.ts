import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import pgPromise, { type IDatabase, type IInitOptions, type IMain } from 'pg-promise'
import { Registry } from 'prom-client'

import { monitorPgPromise } from '../src/monitorPgPromise'
import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'

jest.mock('../src/pgPromisePrometheusExporter')
const mockPromisePrometheusExporter = jest.mocked(PgPromisePrometheusExporter)

describe('tests monitorPgPromise', () => {
  let register: Registry
  const initOptions: IInitOptions = {}
  const pgp: IMain = pgPromise(initOptions)
  const db: IDatabase<unknown> = pgp({})

  beforeEach(() => {
    register = new Registry()
    mockPromisePrometheusExporter.mockClear()
  })

  test('monitorPgPromise calls PgPromisePrometheusExporter with mandatory parameter', () => {
    monitorPgPromise(db, initOptions, register)
    expect(mockPromisePrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPromisePrometheusExporter).toHaveBeenCalledWith(db, initOptions, register, undefined)
  })

  test('monitorPgPromise calls PgPromisePrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }

    monitorPgPromise(db, initOptions, register, options)
    expect(mockPromisePrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPromisePrometheusExporter).toHaveBeenCalledWith(db, initOptions, register, options)
  })

  test('monitorPgPromise calls enableMetrics of PgPromisePrometheusExporter instance', () => {
    monitorPgPromise(db, initOptions, register)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    const mockPgPoolPrometheusExporterInstance = mockPromisePrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockPgPoolPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
