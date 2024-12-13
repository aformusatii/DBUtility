#!/bin/bash

docker run --rm --name nodeRuntime -v "$(pwd)":/usr/src/app -w /usr/src/app node:20.15.1-alpine3.20 node ./src/energyConsumptionCalculator/runner.js "$@"