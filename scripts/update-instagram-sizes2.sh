#!/bin/bash
set -o errexit
set -o nounset
set -o pipefail

# Usage:
#   ./scripts/update-instagram-size2.sh < data/kt-kitty.yaml > new.yaml

IFS=''
regex='^  images_instagram2: \{ shortcode: "([-_A-Za-z0-9]+)"'

while read line
do
  if [[ $line =~ $regex ]] ;
  then
    shortcode=${BASH_REMATCH[1]}
    # Did not test because of compatibility of Git Bash and Node. See https://github.com/fgnass/node-dev/issues/208
    new=$(./scripts/get-instagram-sizes.js $shortcode | grep 'images_instagram2:')
    echo "  $new"
    # ./scripts/get-instagram-sizes.js $shortcode # Edit get-instagram-sizes.js to emit images_instagram2 only.
  else
    echo $line
  fi
done
