[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/christiangalsterer/pg-promise-prometheus-exporter/build.yaml)](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/christiangalsterer/pg-promise-prometheus-exporter/badge.svg?branch=main)](https://coveralls.io/github/christiangalsterer/pg-promise-prometheus-exporter?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/christiangalsterer/pg-promise-prometheus-exporter/badge.svg)](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/security/advisories)
[![npm downloads](https://img.shields.io/npm/dt/@christiangalsterer/pg-promise-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/pg-promise-prometheus-exporter)
[![npm version](https://img.shields.io/npm/v/@christiangalsterer/pg-promise-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/pg-promise-prometheus-exporter?activeTab=versions)
[![npm license](https://img.shields.io/npm/l/@christiangalsterer/pg-promise-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/pg-promise-prometheus-exporter)
[![semver](https://img.shields.io/badge/semver-2.0.0-green)](https://semver.org)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://developer.mend.io/github/christiangalsterer/pg-promise-prometheus-exporter)
![github stars](https://img.shields.io/github/stars/christiangalsterer/pg-promise-prometheus-exporter.svg)

# Prometheus Exporter for pg-promise

A prometheus exporter exposing metrics for [pg-promise](https://www.npmjs.com/package/pg-promise).

## Available Metrics

As the exporter is utilizing the [node-postgres-prometheus-exporter](https://github.com/christiangalsterer/node-postgres-prometheus-exporter) for the majority of the connection and pool usage metrics, please check the [documentation](https://github.com/christiangalsterer/node-postgres-prometheus-exporter?tab=readme-ov-file#available-metrics) for the list of metrics.

In **addition** the exporter provides the following metrics.

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|pg_command_duration_seconds_bucket|Duration of the executed command in seconds|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_command_: Name of the command</li><li>_status_: SUCCESS or ERROR</li><ul>|2.0.0|
|pg_command_duration_seconds_sum|The cumulated duration of the executed command in seconds|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_command_: Name of the command</li><li>_status_: SUCCESS or ERROR</li><ul>|2.0.0|
|pg_command_duration_seconds_count|Number of executed commands|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_command_: Name of the command</li><li>_status_: SUCCESS or ERROR</li><ul>|2.0.0|
|pg_task_duration_seconds_bucket|Duration of the executed task in seconds|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_task_: The tag as provided when executing the task. **Note:** The tag will be only added if it is a valid label value.</li><ul>|2.0.0|
|pg_task_duration_seconds_sum|Cumulated duration of the executed task in seconds|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_task_: The tag as provided when executing the task. **Note:** The tag will be only added if it is a valid label value.</li><ul>|2.0.0|
|pg_task_duration_seconds_count|Number of executed tasks|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_task_: The tag as provided when executing the task. **Note:** The tag will be only added if it is a valid label value.</li><ul>|2.0.0|
|pg_transaction_duration_seconds_bucket|Duration of the executed transactions in seconds|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_transaction_: The tag as provided when executing the transaction. **Note:** The tag will be only added if it is a valid label value.</li><ul>|2.0.0|
|pg_transaction_duration_seconds_sum|Cumulated duration of the executed transactions in seconds|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_transaction_: The tag as provided when executing the transaction. **Note:** The tag will be only added if it is a valid label value.</li><ul>|2.0.0|
|pg_transaction_duration_seconds_count|Number of executed transactions|<ul><li>_host_: The host of the database</li><li>_database_: The database name</li><li>_transaction_: The tag as provided when executing the transaction. **Note:** The tag will be only added if it is a valid label value.</li><ul>|2.0.0|

## Example Output

Here an example output in the prometheus format of the provided metrics.

```sh
# HELP pg_client_errors_total The total number of connection errors with a database.
# TYPE pg_client_errors_total counter
pg_client_errors_total{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_client_disconnects_total The total number of disconnected connections.
# TYPE pg_client_disconnects_total counter
pg_client_disconnects_total{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_pool_connections_created_total The total number of created connections.
# TYPE pg_pool_connections_created_total counter
pg_pool_connections_created_total{host="localhost:5432",database="node_postgres_test1"} 19

# HELP pg_pool_size The current size of the connection pool, including active and idle members.
# TYPE pg_pool_size gauge
pg_pool_size{host="localhost:5432",database="node_postgres_test1"} 10

# HELP pg_pool_max The maximum size of the connection pool.
# TYPE pg_pool_max gauge
pg_pool_max{host="localhost:5432",database="node_postgres_test1"} 10

# HELP pg_pool_active_connections The total number of active connections.
# TYPE pg_pool_active_connections gauge
pg_pool_active_connections{host="localhost:5432",database="node_postgres_test1"} 10

# HELP pg_pool_waiting_connections The total number of waiting connections.
# TYPE pg_pool_waiting_connections gauge
pg_pool_waiting_connections{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_pool_idle_connections The total number of idle connections.
# TYPE pg_pool_idle_connections gauge
pg_pool_idle_connections{host="localhost:5432",database="node_postgres_test1"} 0

# HELP pg_pool_errors_total The total number of connection errors with a database.
# TYPE pg_pool_errors_total counter
pg_pool_errors_total{host="localhost:5432",database="node_postgres_test1"} 1

# HELP pg_pool_connections_removed_total The total number of removed connections.
# TYPE pg_pool_connections_removed_total counter
pg_pool_connections_removed_total{host="localhost:5432",database="node_postgres_test1"} 9

# HELP pg_command_duration_seconds Timer of pg commands
# TYPE pg_command_duration_seconds histogram
pg_command_duration_seconds_bucket{le="0.001",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.005",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.01",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.02",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.03",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.04",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.05",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 21
pg_command_duration_seconds_bucket{le="0.1",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 31
pg_command_duration_seconds_bucket{le="0.2",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 38
pg_command_duration_seconds_bucket{le="0.5",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 40
pg_command_duration_seconds_bucket{le="1",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 40
pg_command_duration_seconds_bucket{le="2",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 40
pg_command_duration_seconds_bucket{le="5",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 40
pg_command_duration_seconds_bucket{le="10",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 40
pg_command_duration_seconds_bucket{le="+Inf",host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 40
pg_command_duration_seconds_sum{host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 3.475
pg_command_duration_seconds_count{host="localhost:5432",database="node_postgres_test1",command="SELECT",status="SUCCESS"} 40
pg_command_duration_seconds_bucket{le="0.001",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.005",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.01",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.02",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.03",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.04",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.05",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 8
pg_command_duration_seconds_bucket{le="0.1",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 14
pg_command_duration_seconds_bucket{le="0.2",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 18
pg_command_duration_seconds_bucket{le="0.5",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="1",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="2",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="5",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="10",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="+Inf",host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 20
pg_command_duration_seconds_sum{host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 2.116
pg_command_duration_seconds_count{host="localhost:5432",database="node_postgres_test1",command="BEGIN",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="0.001",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.005",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.01",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.02",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.03",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.04",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 0
pg_command_duration_seconds_bucket{le="0.05",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 12
pg_command_duration_seconds_bucket{le="0.1",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 17
pg_command_duration_seconds_bucket{le="0.2",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 18
pg_command_duration_seconds_bucket{le="0.5",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="1",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="2",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="5",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="10",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 20
pg_command_duration_seconds_bucket{le="+Inf",host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 20
pg_command_duration_seconds_sum{host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 1.6620000000000001
pg_command_duration_seconds_count{host="localhost:5432",database="node_postgres_test1",command="COMMIT",status="SUCCESS"} 20

# HELP pg_task_duration_seconds Timer of pg tasks
# TYPE pg_task_duration_seconds histogram
pg_task_duration_seconds_bucket{le="0.001",host="localhost:5432",database="node_postgres_test1",task="my-task"} 0
pg_task_duration_seconds_bucket{le="0.005",host="localhost:5432",database="node_postgres_test1",task="my-task"} 0
pg_task_duration_seconds_bucket{le="0.01",host="localhost:5432",database="node_postgres_test1",task="my-task"} 0
pg_task_duration_seconds_bucket{le="0.02",host="localhost:5432",database="node_postgres_test1",task="my-task"} 0
pg_task_duration_seconds_bucket{le="0.03",host="localhost:5432",database="node_postgres_test1",task="my-task"} 0
pg_task_duration_seconds_bucket{le="0.04",host="localhost:5432",database="node_postgres_test1",task="my-task"} 0
pg_task_duration_seconds_bucket{le="0.05",host="localhost:5432",database="node_postgres_test1",task="my-task"} 8
pg_task_duration_seconds_bucket{le="0.1",host="localhost:5432",database="node_postgres_test1",task="my-task"} 14
pg_task_duration_seconds_bucket{le="0.2",host="localhost:5432",database="node_postgres_test1",task="my-task"} 18
pg_task_duration_seconds_bucket{le="0.5",host="localhost:5432",database="node_postgres_test1",task="my-task"} 20
pg_task_duration_seconds_bucket{le="1",host="localhost:5432",database="node_postgres_test1",task="my-task"} 20
pg_task_duration_seconds_bucket{le="2",host="localhost:5432",database="node_postgres_test1",task="my-task"} 20
pg_task_duration_seconds_bucket{le="5",host="localhost:5432",database="node_postgres_test1",task="my-task"} 20
pg_task_duration_seconds_bucket{le="10",host="localhost:5432",database="node_postgres_test1",task="my-task"} 20
pg_task_duration_seconds_bucket{le="+Inf",host="localhost:5432",database="node_postgres_test1",task="my-task"} 20
pg_task_duration_seconds_sum{host="localhost:5432",database="node_postgres_test1",task="my-task"} 2.139
pg_task_duration_seconds_count{host="localhost:5432",database="node_postgres_test1",task="my-task"} 20

# HELP pg_transaction_duration_seconds Timer of pg transactions
# TYPE pg_transaction_duration_seconds histogram
pg_transaction_duration_seconds_bucket{le="0.001",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.005",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.01",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.02",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.03",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.04",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.05",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.1",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 0
pg_transaction_duration_seconds_bucket{le="0.2",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 11
pg_transaction_duration_seconds_bucket{le="0.5",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 18
pg_transaction_duration_seconds_bucket{le="1",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 20
pg_transaction_duration_seconds_bucket{le="2",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 20
pg_transaction_duration_seconds_bucket{le="5",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 20
pg_transaction_duration_seconds_bucket{le="10",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 20
pg_transaction_duration_seconds_bucket{le="+Inf",host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 20
pg_transaction_duration_seconds_sum{host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 5.142
pg_transaction_duration_seconds_count{host="localhost:5432",database="node_postgres_test1",transaction="my-transaction"} 20
```

# Usage

## Add Dependency

Add the following dependency to your project to download the package from [npm](https://www.npmjs.com/package/@christiangalsterer/pg-promise-prometheus-exporter).

```sh
npm i @christiangalsterer/pg-promise-prometheus-exporter
```

## TypeScript

The following example illustrates how to use the exporter to enable monitoring for the pg-promise.

```ts
import pgPromise, { type IInitOptions, type IMain } from 'pg-promise'
import { Registry, collectDefaultMetrics } from 'prom-client'
import { monitorPgPromise } from '@christiangalsterer/pg-promise-prometheus-exporter'

...

// set up pg-promise
const initOptions: IInitOptions = {/* initialization options */}
const pgp: IMain = pgPromise(initOptions)
const database: any = pgp(/* the connection parameter is either a configuration object or a connection string */)


// set up the prometheus client
const register = new Registry();
collectDefaultMetrics({ register })

// monitor pg-promise
monitorPgPromise(database, initOptions, register)

...

// connect to PostgreSQL *after* calling monitorPgPromise
```

## JavaScript

The following example illustrates how to use the exporter to enable monitoring for pg-promise.

```js
const promClient = require( 'prom-client');
const pgPromiseExporter = require('@christiangalsterer/pg-promise-prometheus-exporter')

// set up pg-promise
const initOptions = {/* initialization options */};
const pgp = require('pg-promise')(initOptions);
const database = pgp(/* the connection parameter is either a configuration object or a connection string */)

// set up the prometheus client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// monitor pg-promise
pgPromiseExporter.monitorPgPromise(database, initOptions, register)

// connect to Postgres *after* calling monitorPgPromise
```

# Configuration

The exporter can be configured via properties specified on the optional parameter of type
_PgPromiseExporterOptions_.

## PgPromiseExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 1.0.0 |

# Event Handling

If there are already event handler registered for the events provided by pg-promise, the library will preserve the defined event handlers when the initOptions are initialized.

# Grafana Dashboard

An example dashboard for Grafana is available [here](/docs/grafana/dashboard.json) displaying the provided metrics by the exporter.

Here an example for pg-promise client metrics:
![Grafana:pg-promise client metrics](/docs/images/grafana_pgpromise_client_1.png "Grafana: pg-promise client metrics")

Here an example for pg-promise pool metrics:
![Grafana:pg-promise pool metrics](/docs/images/grafana_pgpromise_pool_1.png "Grafana: pg-promise pool metrics")

Here an example for pg-promise command metrics:
![Grafana:pg-promise command metrics](/docs/images/grafana_pgpromise_commands_1.png "Grafana: pg-promise command metrics")

Here an example for pg-promise task metrics:
![Grafana:pg-promise task metrics](/docs/images/grafana_pgpromise_tasks_1.png "Grafana: pg-promise task metrics")

Here an example for pg-promise transaction metrics:
![Grafana:pg-promise transaction metrics](/docs/images/grafana_pgpromise_transactions_1.png "Grafana: pg-promise transaction metrics")

# Changelog

The changes to project can be found in the [changelog](/CHANGELOG.md).

# Compatibility

The following table list the compatibility of exporter versions with different pg-promise and prom-client versions.

|Exporter Version|pg-promise Version|prom-client version|
|---|---|---|
|^1.0.0|^11.5.0|^15.0.0|

# Contributions

Contributions are highly welcome. If you want to contribute to this project please follow the steps described in the [contribution guidelines](/CONTRIBUTING.md).

# Projects Using The Exporter

If you want to support this project, please add a link to your project and/or company when you use this exporter.

# Related Projects

If you are looking for a way to monitor your MongoDB Driver for Node.js you may have a look at <https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter>.

If you are looking for a way to monitor KafkaJs for Node.js you may have a look at <https://github.com/christiangalsterer/kafkajs-prometheus-exporter>.
