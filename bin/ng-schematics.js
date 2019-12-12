#!/usr/bin/env node

'use strict';
const { exec } = require('child_process');

const args = process.argv.slice(2);
const [type, ...options] = args;
if (type !== 'adapter' && type !== 'store') {
  console.error('error');
  return;
}

const execCommand = `yarn schematics @kasaharu/ng-schematics:${type} ${options.join(' ')}`;
exec(execCommand);
