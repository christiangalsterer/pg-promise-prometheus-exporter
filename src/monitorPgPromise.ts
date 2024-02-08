import { type Registry } from 'prom-client'
import type pgPromise from 'pg-promise'
import { PgPromisePrometheusExporter } from './pgPromisePrometheusExporter'
import { type PgPromiseExporterOptions } from './pgPromiseExporterOptions'
import { type IDatabase } from 'pg-promise'

/**
 * Exposes metrics for pg-promise in prometheus format.
 *
 * @param database The database object created from pg-promise
 * @param initOptions The initialization options used for pg-promise
 * @param options Optional parameter to configure the exporter
 */
export function monitorPgPromise (database: IDatabase<unknown>, initOptions: pgPromise.IInitOptions, register: Registry, options?: PgPromiseExporterOptions): void {
  const exporter = new PgPromisePrometheusExporter(database, initOptions, register, options)
  exporter.enableMetrics()
}
