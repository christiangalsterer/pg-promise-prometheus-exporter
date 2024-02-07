/**
 * Optional parameter to configure the exporter.
 */
export interface PgPromiseExporterOptions {

  /**
   * Default labels for all metrics, e.g. {'foo':'bar', alice: 3}
   */
  defaultLabels?: Record<string, string | number>

  /**
   * Buckets for the pg_commands_seconds_bucket metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  commandsSecondsHistogramBuckets?: number[]

  /**
   * Buckets for the pg_tasks_seconds_bucket metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  tasksSecondsHistogramBuckets?: number[]

  /**
   * Buckets for the pg_transactions_seconds_bucket metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  transactionsSecondsHistogramBuckets?: number[]
}
