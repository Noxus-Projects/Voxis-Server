console.clear();

import { config } from 'dotenv';
config();

import { io } from 'socket.io-client';

const URL = 'http://localhost:' + process.env.PORT;
const socket = io(URL, { autoConnect: false, auth: { token: 'rJvNsPK2siyXj6FHpYrJC52buffZxB' } });

socket.connect();

socket.on('rooms', console.log);
