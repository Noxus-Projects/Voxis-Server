console.clear();

import { config } from 'dotenv';
config();

import { io } from 'socket.io-client';
import Mic from 'node-microphone';

import { OpusEncoder } from '@discordjs/opus';
const encoder = new OpusEncoder(44100, 2);

const mic = new Mic({ bitwidth: 16, rate: 44100, channels: 2 });
const micStream = mic.startRecording();

const URL = 'http://localhost:' + process.env.PORT;

class Client {
	private socket;
	constructor(token: string) {
		this.socket = io(URL, {
			autoConnect: false,
			auth: { token },
		});

		this.socket.on('connect', () => {
			micStream.on('data', (data) => this.socket.emit('voice', encoder.encode(data)));
			this.socket.emit('joinRoom', 'fakka');
		});

		this.socket.on('voice', console.log);

		this.socket.on('joinedRoom', console.log);
	}

	public connect() {
		this.socket.connect();
	}
}

const client1 = new Client('rJvNsPK2siyXj6FHpYrJC52buffZxB');
client1.connect();

// const client2 = new Client('pGLd8Bvf9eQZSGjOfnwJBOkXwH2jjW');
// client2.connect();
