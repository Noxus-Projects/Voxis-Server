console.clear();

import { config } from 'dotenv';
config();

import { io } from 'socket.io-client';

const URL = 'http://localhost:' + process.env.PORT;
const socket = io(URL, { autoConnect: false });

socket.connect();
