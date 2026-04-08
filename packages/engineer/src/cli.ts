#!/usr/bin/env node

import { install } from './install.js';
import { uninstall } from './uninstall.js';

const command = process.argv[2];

switch (command) {
  case 'install':
    install();
    break;
  case 'uninstall':
    uninstall();
    break;
  default:
    console.log('Usage: npx @x402/engineer <install|uninstall>');
    process.exit(1);
}
