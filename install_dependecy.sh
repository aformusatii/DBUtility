#!/bin/bash

docker run -it --rm --name nodeRuntimeInstall -v "$(pwd)":/usr/src/app -w /usr/src/app node:20.15.1-alpine3.20 npm install "$@"