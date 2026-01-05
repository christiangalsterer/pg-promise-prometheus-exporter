# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 (2026-01-05)


### Features

* add support to monitor multiple instances of pg-promise and underlying pg-client and pg-pool instances ([13b4008](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/13b4008bec9e29f3e61f0ceab54049710ba88a6b))


### Bug Fixes

* check if duration is available in receive event ([717c1cb](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/717c1cb35c22ee71f6a1b4c1e274ee9bcd54d382))
* check if duration is available in receive event ([deee1bf](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/deee1bf136b55b5b87f375ee43afa6fc887636ff))
* check if duration is available in receive event ([d92b5d3](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/d92b5d3b2f674da38b8ac8851481a0242049d3a8))
* **deps:** update dependency @christiangalsterer/node-postgres-prometheus-exporter to v1.2.0 ([3b0005a](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/3b0005a15a238fa232cd7dced55956cad5b27524))
* **deps:** update dependency @christiangalsterer/node-postgres-prometheus-exporter to v1.2.0 ([e2edb7d](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/e2edb7dcc3284807d315c6fe78ae3398a320c0d3))
* **deps:** update dependency pg-promise to v12 ([#75](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/issues/75)) ([99c7cfe](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/99c7cfe2c0cc2067c280998e47bf1dbff4dc8941))
* handle receive event correctly when query is not executed inside task or transaction ([1f4fe9d](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/1f4fe9d5dbc448aaab4ee6177bba887361066ce5))
* handle receive event correctly when query is not executed inside task or transaction ([db8fe5d](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/db8fe5d9bae15e3cf2452daea51092a88238cda2))
* handle receive event correctly when query is not executed inside task or transaction ([d4c62a5](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/d4c62a5a848d6615bd35601985ce97191a19878d))
* wrong entrypoint after migration to single tsconfig file ([d03d643](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/d03d64396b4cfffee3abc9a0db3f3fb02705c07e))
* wrong metric construction after es-config-love refactoring leads to failure ([8612cca](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/8612cca7ab0d079d29b6b36ca082266964b4df42))

## [2.2.0](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/compare/v2.1.1...v2.2.0) (2024-07-21)


### Features

* add support to monitor multiple instances of pg-promise and underlying pg-client and pg-pool instances ([13b4008](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/13b4008bec9e29f3e61f0ceab54049710ba88a6b))


### Bug Fixes

* check if duration is available in receive event ([717c1cb](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/717c1cb35c22ee71f6a1b4c1e274ee9bcd54d382))
* check if duration is available in receive event ([deee1bf](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/deee1bf136b55b5b87f375ee43afa6fc887636ff))
* check if duration is available in receive event ([d92b5d3](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/d92b5d3b2f674da38b8ac8851481a0242049d3a8))

## [2.1.1](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/compare/v2.1.0...v2.1.1) (2024-07-17)


### Bug Fixes

* **deps:** update dependency @christiangalsterer/node-postgres-prometheus-exporter to v1.2.0 ([3b0005a](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/3b0005a15a238fa232cd7dced55956cad5b27524))
* **deps:** update dependency @christiangalsterer/node-postgres-prometheus-exporter to v1.2.0 ([e2edb7d](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/e2edb7dcc3284807d315c6fe78ae3398a320c0d3))
* handle receive event correctly when query is not executed inside task or transaction ([1f4fe9d](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/1f4fe9d5dbc448aaab4ee6177bba887361066ce5))
* handle receive event correctly when query is not executed inside task or transaction ([db8fe5d](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/db8fe5d9bae15e3cf2452daea51092a88238cda2))
* handle receive event correctly when query is not executed inside task or transaction ([d4c62a5](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/d4c62a5a848d6615bd35601985ce97191a19878d))

## [2.1.0](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/compare/v2.0.0...v2.1.0) (2024-04-17)


### Features

* add support for node coveralls reports ([dc1170e](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/dc1170e64d925cc9cc8bc78c1817ecd6c448026b))
* Security upgrade pg-promise from 11.5.4 to 11.5.5 ([2dea15a](https://github.com/christiangalsterer/pg-promise-prometheus-exporter/commit/2dea15a9f44a94fe7e8d162f3f4aab4bc4e8d035))

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
