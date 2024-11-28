#!/usr/bin/env bash

tsc && for mode in prod staging test dev; do
  outDir="./dist/app-$mode"
  zipFile="./dist/app-$mode.zip"
  
  # If the mode is production, you may not need to specify the --mode flag
  if [ "$mode" = "prod" ]; then
    vite build --outDir "$outDir"
  else
    vite build --mode "$mode" --outDir "$outDir"
  fi
  
  zip -r "$zipFile" "$outDir"
done