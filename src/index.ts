console.clear();

import { config } from 'dotenv';
config();

import Server from './server';

const server = new Server();
server.start(parseInt(process.env.PORT ?? '0'));
