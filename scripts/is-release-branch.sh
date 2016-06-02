#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

branch_name="${TRAVIS_BRANCH:-}"
if [ -z "$branch_name" ]; then
  branch_name=`git symbolic-ref --short HEAD`
fi 
test "release" = "${branch_name}"
