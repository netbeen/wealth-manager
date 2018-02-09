#!/usr/bin/env bash
echo 'npm build successfully, start moving files.'
cp dist/index.html ../app/view/index.html
rm -rf ../app/public/antDesign/*
cp dist/* ../app/public/antDesign/
echo 'Done.'
