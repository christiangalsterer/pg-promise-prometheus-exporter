# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] 2024-03-01

### Changed

- BREAKING CHANGES: The following metrics are renamed to comply with Prometheus naming conventions.

|OLD|NEW|
|---|---|
|pg_command_duration_count|pg_command_duration_seconds_count|
|pg_command_duration_sum|pg_command_duration_seconds_sum|
|pg_command_duration_bucket|pg_command_duration_seconds_bucket|
|pg_task_duration_count|pg_task_duration_seconds_count|
|pg_task_duration_sum|pg_task_duration_seconds_sum|
|pg_task_duration_bucket|pg_task_duration_seconds_bucket|
|pg_transaction_duration_count|pg_transaction_duration_seconds_count|
|pg_transaction_duration_sum|pg_transaction_duration_seconds_sum|
|pg_transaction_duration_bucket|pg_transaction_duration_seconds_bucket|

## [1.1.0] 2024-02-14

The detailed changelog can be found [here](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/compare/v1.0.0...v1.1.0).

- Added support to preserve existing event handlers. If an event handler is already registered it will be called as well.

## [1.0.0] 2024-02-08

### Added

- Initial release with support for connection pool, command, task and transaction metrics