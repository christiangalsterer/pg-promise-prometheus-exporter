import { beforeEach, describe, expect, test, jest } from '@jest/globals'
import { Registry } from 'prom-client'
import pgPromise, { type IMain, type IInitOptions, type IDatabase } from 'pg-promise'

import { monitorPgPromise } from '../src/monitorPgPromise'
import { PgPromisePrometheusExporter } from '../src/pgPromisePrometheusExporter'

jest.mock('../src/pgPromisePrometheusExporter')
const mockPromisePrometheusExporter = jest.mocked(PgPromisePrometheusExporter)

describe('tests monitorPgPool', () => {
  let register: Registry
  const initOptions: IInitOptions = {}
  const pgp: IMain = pgPromise(initOptions)
  const db: IDatabase<unknown> = pgp({})

  beforeEach(() => {
    register = new Registry()
    mockPromisePrometheusExporter.mockClear()
  })

  test('tests if monitorPgPromise called PgPromisePrometheusExporter with mandatory parameter', () => {
    // eslint-disable-next-line
    monitorPgPromise(db, initOptions, register)
    expect(mockPromisePrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPromisePrometheusExporter).toBeCalledWith(db, initOptions, register, undefined)
  })

  test('tests if monitorPgPromise called PgPromisePrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line
    monitorPgPromise(db, initOptions, register, options)
    expect(mockPromisePrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockPromisePrometheusExporter).toBeCalledWith(db, initOptions, register, options)
  })

  test('tests if monitorPgPromise called methods of PgPromisePrometheusExporter instance', () => {
    // eslint-disable-next-line
    monitorPgPromise(db, initOptions, register)
    const mockPgPoolPrometheusExporterInstance = mockPromisePrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockPgPoolPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
