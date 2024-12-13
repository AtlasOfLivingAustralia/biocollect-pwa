#!/usr/bin/env bash

tsc && for mode in production staging test dev; do
  outDir="./dist/app-$mode"

  # If the mode is production, you may not need to specify the --mode flag
  if [ "$mode" = "prod" ]; then
    vite build --outDir "$outDir"
  else
    vite build --mode "$mode" --outDir "$outDir"
  fi
  
  cd "./dist/app-$mode"
  zip -r "../app-$mode.zip" . *
  cd ../..
done