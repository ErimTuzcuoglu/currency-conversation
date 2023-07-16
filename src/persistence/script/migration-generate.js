#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const { argv } = require('yargs');
const { execSync } = require('child_process');

// Parse the command-line arguments
const {
  _: [name],
  path,
} = argv;

// Construct the migration path
const migrationPath = `src/persistence/migrations/${name}`;

// Run the typeorm command
execSync(`yarn typeorm:cli migration:generate ${migrationPath}`, {
  stdio: 'inherit',
});
