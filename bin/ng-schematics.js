#!/usr/bin/env node

'use strict';
const { exec } = require('child_process');

const args = process.argv.slice(2);
const [type, ...options] = args;
if (type !== 'adapter' && type !== 'store') {
  console.error('error');
  return;
}

const generatingCommands = { adapter: 'generate:adapter', store: 'generate:store' };
const scripts = require('../package.json').scripts;

const execCommand = `yarn ${scripts[generatingCommands[type]]} ${options.join(' ')}`;
exec(execCommand);
