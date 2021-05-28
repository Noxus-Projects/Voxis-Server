console.clear();

import chalk from 'chalk';
import { config } from 'dotenv';

config();

const DEFAULT_PORT = 10000;

if (!process.env.CLIENT_ID) {
	console.log(chalk.red('ERROR'), 'CLIENT_ID variable was not set, exiting...');
	process.exit();
}

if (!process.env.CLIENT_SECRET) {
	console.log(chalk.red('ERROR'), 'CLIENT_SECRET variable was not set, exiting...');
	process.exit();
}

if (!process.env.REDIRECT) {
	console.log(chalk.red('ERROR'), 'REDIRECT variable was not set, exiting...');
	process.exit();
}

if (!process.env.PORT) {
	console.log(
		chalk.yellow('INFO'),
		'PORT variable was not set, defaulting to port ' + DEFAULT_PORT
	);
}

if (!process.env.OWNER) {
	console.log(
		chalk.yellow('WARNING'),
		'OWNER variable was not set, you might not be able to connect'
	);
}

import Server from './server';

const server = new Server();
server.start(parseInt(process.env.PORT as string) || DEFAULT_PORT);
