#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

npm run clean
npm run lint
npm run cover
