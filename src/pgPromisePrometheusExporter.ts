import { type Registry, Histogram } from 'prom-client'
import { type PgPromiseExporterOptions } from './pgPromiseExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'
import { type IEventContext, type IResultExt, type IInitOptions, type IDatabase } from 'pg-promise'
import { monitorPgPool } from '@christiangalsterer/node-postgres-prometheus-exporter'
import { type PgPoolExporterOptions } from '@christiangalsterer/node-postgres-prometheus-exporter/dist/pgPoolExporterOptions'

/**
 * Exports metrics for the pg-promise
 */
export class PgPromisePrometheusExporter {
  private readonly db: IDatabase<unknown>
  private readonly pgPromiseInitOptions: IInitOptions
  private readonly register: Registry
  private readonly options: PgPromiseExporterOptions
  private readonly defaultOptions: PgPromiseExporterOptions = {
    commandsSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
    tasksSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10],
    transactionsSecondsHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10]
  }

  private readonly commands: Histogram
  private readonly tasks: Histogram
  private readonly transactions: Histogram

  constructor (db: IDatabase<unknown>, pgPromiseInitOptions: IInitOptions, register: Registry, options?: PgPromiseExporterOptions) {
    this.db = db
    this.pgPromiseInitOptions = pgPromiseInitOptions
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.commands = new Histogram({
      name: 'pg_commands_seconds',
      help: 'Timer of pg commands',
      buckets: this.options.commandsSecondsHistogramBuckets,
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'command', 'status'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.tasks = new Histogram({
      name: 'pg_tasks_seconds',
      help: 'Timer of pg tasks',
      buckets: this.options.commandsSecondsHistogramBuckets,
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'task', 'status'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.transactions = new Histogram({
      name: 'pg_transactions_seconds',
      help: 'Timer of pg transactions',
      buckets: this.options.commandsSecondsHistogramBuckets,
      labelNames: mergeLabelNamesWithStandardLabels(['host', 'database', 'transaction', 'status'], this.options.defaultLabels),
      registers: [this.register]
    })
  }

  public enableMetrics (): void {
    const pgPoolExporterOptions: PgPoolExporterOptions = { defaultLabels: this.options.defaultLabels }
    monitorPgPool(this.db.$pool, this.register, pgPoolExporterOptions)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // this.pgPromiseInitOptions.connect = this.onConnect.bind(this)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // this.pgPromiseInitOptions.disconnect = this.onDisconnect.bind(this)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    this.pgPromiseInitOptions.receive = this.onReceive.bind(this)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    this.pgPromiseInitOptions.task = this.onTask.bind(this)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    this.pgPromiseInitOptions.transact = this.onTransaction.bind(this)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // onConnect (event: { client: IClient, dc: any, useCount: number }): void {
  //   if (isDirectClient(event.client)) {
  //     this.poolConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({ host: event.client.host + ':' + event.client.port, database: event.client.database }, this.options.defaultLabels))
  //   }
  // }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // onDisconnect (event: { client: IClient, dc: any }): void {
  //   this.poolActiveConnections.dec(mergeLabelsWithStandardLabels({ host: event.client.host + ':' + event.client.port, database: event.client.database }, this.options.defaultLabels))
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReceive (event: { data: any[], result: IResultExt | undefined, ctx: IEventContext }): void {
    try {
      if (event.result !== undefined) {
        this.commands.observe(mergeLabelsWithStandardLabels({ host: event.ctx.client.host + ':' + event.ctx.client.port, database: event.ctx.client.database, command: event.result.command, status: this.getStatus(event.ctx.ctx.success) }, this.options.defaultLabels), event.result.duration! / 1000)
      }
    } catch (error) {
      console.error('An error occured in the reveive event handling', error)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTask (eventCtx: IEventContext): void {
    if (eventCtx.ctx.finish != null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.tasks.observe(mergeLabelsWithStandardLabels({ host: eventCtx.client.host + ':' + eventCtx.client.port, database: eventCtx.client.database, task: eventCtx.ctx.tag }, this.options.defaultLabels), eventCtx.ctx.duration! / 1000)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTransaction (eventCtx: IEventContext): void {
    if (eventCtx.ctx.finish != null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transactions.observe(mergeLabelsWithStandardLabels({ host: eventCtx.client.host + ':' + eventCtx.client.port, database: eventCtx.client.database, transaction: eventCtx.ctx.tag }, this.options.defaultLabels), eventCtx.ctx.duration! / 1000)
    }
  }

  private getStatus (success: boolean | undefined): string {
    let status = 'ERROR'
    if (success ?? false) {
      status = 'ERROR'
    } else {
      status = 'SUCCESS'
    }
    return status
  }
}
