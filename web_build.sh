#!/bin/bash
 cd webapp

if [ ! -d "node_modules" ]; then
  echo "Running npm install"
  npm install
else
  echo ""
fi
echo "Running npm run build"
npm run build
