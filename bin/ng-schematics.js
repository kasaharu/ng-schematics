#!/usr/bin/env node

'use strict';
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const [type, ...options] = args;
if (type !== 'my-service' && type !== 'ngrx-store') {
  console.error('Cannot find this type.');
  return;
}

const execCommand = `yarn schematics @kasaharu/ng-schematics:${type} ${options.join(' ')}`;
const result = execSync(execCommand);
console.log(result.toString());
