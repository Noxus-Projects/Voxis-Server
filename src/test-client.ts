console.clear();

import { config } from 'dotenv';
config();

import { io } from 'socket.io-client';

const URL = 'http://localhost:' + process.env.PORT;

class Client {
	private socket;
	constructor(token: string) {
		this.socket = io(URL, {
			autoConnect: false,
			auth: { token },
		});

		this.socket.on('connect', () => {
			this.socket.emit('joinRoom', 'fakka');

			setTimeout(() => this.socket.emit('message', { channel: 1, message: 'hallotjes' }), 3000);
		});

		this.socket.on('message', console.log);

		this.socket.on('joinedRoom', console.log);
	}

	public connect() {
		this.socket.connect();
	}
}

const client1 = new Client('rJvNsPK2siyXj6FHpYrJC52buffZxB');
client1.connect();
