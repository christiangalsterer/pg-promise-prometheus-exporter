import { monitorPgPool } from '@christiangalsterer/node-postgres-prometheus-exporter'
import type { PgPoolExporterOptions } from '@christiangalsterer/node-postgres-prometheus-exporter/dist/pgPoolExporterOptions'
import type { IDatabase, IEventContext, IInitOptions, IResultExt, ITaskContext } from 'pg-promise'
import { Histogram, type Registry } from 'prom-client'

import type { PgPromiseExporterOptions } from './pgPromiseExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

const MILLISECONDS_IN_A_SECOND = 1000

/**
 * Exports metrics for pg-promise
 */
export class PgPromisePrometheusExporter {
  private readonly db: IDatabase<unknown>
  private readonly pgPromiseInitOptions: IInitOptions
  private readonly register: Registry
  private readonly options: PgPromiseExporterOptions
  private readonly defaultOptions: PgPromiseExporterOptions = {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    commandsSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    tasksSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    transactionsSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]
  }

  private readonly PG_COMMAND_DURATION_SECONDS = 'pg_command_duration_seconds'
  private readonly PG_TASK_DURATION_SECONDS = 'pg_task_duration_seconds'
  private readonly PG_TRANSACTION_DURATION_SECONDS = 'pg_transaction_duration_seconds'
  private readonly commands: Histogram
  private readonly tasks: Histogram
  private readonly transactions: Histogram

  private readonly originalHandlers: {
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type, @typescript-eslint/no-explicit-any
    receive: { func: (event: { data: any[]; result: void | IResultExt; ctx: IEventContext }) => void } | undefined
    task: { func: (eventCtx: IEventContext) => void } | undefined
    transact: { func: (eventCtx: IEventContext) => void } | undefined
  }

  static getStatus(ctx: ITaskContext | undefined): string {
    let status = 'SUCCESS'
    if (ctx !== undefined) {
      status = ctx.success === false ? 'ERROR' : 'SUCCESS'
    }
    return status
  }

  constructor(db: IDatabase<unknown>, pgPromiseInitOptions: IInitOptions, register: Registry, options?: PgPromiseExporterOptions) {
    this.db = db
    this.pgPromiseInitOptions = pgPromiseInitOptions
    this.register = register
    this.options = { ...this.defaultOptions, ...options }
    this.originalHandlers = {
      receive: undefined,
      task: undefined,
      transact: undefined
    }

    const commandsMetric = this.register.getSingleMetric(this.PG_COMMAND_DURATION_SECONDS)
    this.commands =
      commandsMetric instanceof Histogram
        ? commandsMetric
        : new Histogram({
            name: this.PG_COMMAND_DURATION_SECONDS,
            help: 'Timer of pg commands',
            buckets: this.options.commandsSecondsHistogramBuckets,
            labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'command', 'status'], this.options.defaultLabels),
            registers: [this.register]
          })

    const tasksMetric = this.register.getSingleMetric(this.PG_TASK_DURATION_SECONDS)
    this.tasks =
      tasksMetric instanceof Histogram
        ? tasksMetric
        : new Histogram({
            name: this.PG_TASK_DURATION_SECONDS,
            help: 'Timer of pg tasks',
            buckets: this.options.commandsSecondsHistogramBuckets,
            labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'task', 'status'], this.options.defaultLabels),
            registers: [this.register]
          })

    const transactionsMetric = this.register.getSingleMetric(this.PG_TRANSACTION_DURATION_SECONDS)
    this.transactions =
      transactionsMetric instanceof Histogram
        ? transactionsMetric
        : new Histogram({
            name: this.PG_TRANSACTION_DURATION_SECONDS,
            help: 'Timer of pg transactions',
            buckets: this.options.commandsSecondsHistogramBuckets,
            labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'transaction', 'status'], this.options.defaultLabels),
            registers: [this.register]
          })
  }

  public enableMetrics(): void {
    const pgPoolExporterOptions: PgPoolExporterOptions = { defaultLabels: this.options.defaultLabels }
    monitorPgPool(this.db.$pool, this.register, pgPoolExporterOptions)

    this.originalHandlers.receive = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      func: this.pgPromiseInitOptions.receive?.bind(this)
    }
    if (typeof this.pgPromiseInitOptions.receive === 'function') {
      this.pgPromiseInitOptions.receive = (e) => {
        this.onReceive(e)
        this.originalHandlers.receive?.func(e)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.pgPromiseInitOptions.receive = this.onReceive.bind(this)
    }

    this.originalHandlers.task = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      func: this.pgPromiseInitOptions.task?.bind(this)
    }
    if (typeof this.pgPromiseInitOptions.task === 'function') {
      this.pgPromiseInitOptions.task = (e) => {
        this.onTask(e)
        this.originalHandlers.task?.func(e)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.pgPromiseInitOptions.task = this.onTask.bind(this)
    }

    this.originalHandlers.transact = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      func: this.pgPromiseInitOptions.transact?.bind(this)
    }
    if (typeof this.pgPromiseInitOptions.transact === 'function') {
      this.pgPromiseInitOptions.transact = (e) => {
        this.onTransaction(e)
        this.originalHandlers.transact?.func(e)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.pgPromiseInitOptions.transact = this.onTransaction.bind(this)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-invalid-void-type
  onReceive(event: { data: any[]; result: void | IResultExt; ctx: IEventContext }): void {
    try {
      if (event.result?.duration !== undefined) {
        this.commands.observe(
          mergeLabelsWithStandardLabels(
            {
              host: event.ctx.client.host + ':' + event.ctx.client.port.toString(),
              database: event.ctx.client.database,
              command: event.result.command,
              status: PgPromisePrometheusExporter.getStatus(event.ctx.ctx)
            },
            this.options.defaultLabels
          ),
          event.result.duration / MILLISECONDS_IN_A_SECOND
        )
      }
    } catch (error) {
      console.error('An error occurred in the receive event handling', error)
    }
  }

  onTask(eventCtx: IEventContext): void {
    try {
      if (eventCtx.ctx.finish != null && eventCtx.ctx.duration !== undefined) {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        this.tasks.observe(
          mergeLabelsWithStandardLabels(
            { host: eventCtx.client.host + ':' + eventCtx.client.port.toString(), database: eventCtx.client.database, task: eventCtx.ctx.tag },
            this.options.defaultLabels
          ),
          eventCtx.ctx.duration / MILLISECONDS_IN_A_SECOND
        )
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      }
    } catch (error) {
      console.error('An error occurred in the task event handling', error)
    }
  }

  onTransaction(eventCtx: IEventContext): void {
    try {
      if (eventCtx.ctx.finish != null && eventCtx.ctx.duration !== undefined) {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        this.transactions.observe(
          mergeLabelsWithStandardLabels(
            { host: eventCtx.client.host + ':' + eventCtx.client.port.toString(), database: eventCtx.client.database, transaction: eventCtx.ctx.tag },
            this.options.defaultLabels
          ),
          eventCtx.ctx.duration / MILLISECONDS_IN_A_SECOND
        )
        /* eslint-enable @typescript-eslint/no-unsafe-assignment */
      }
    } catch (error) {
      console.error('An error occurred in the transaction event handling', error)
    }
  }
}
