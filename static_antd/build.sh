#!/usr/bin/env bash
echo 'npm build successfully, start moving files.'
cp dist/index.html ../app/view/
cp dist/* ../app/public/
echo 'Done.'
