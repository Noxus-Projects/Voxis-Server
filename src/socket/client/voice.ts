import { ClientOptions } from '.';

export default class VoiceManager {
	private client;
	private user;

	constructor(options: ClientOptions) {
		this.client = options.client;
		this.user = options.user;

		this.client.on('voiceData', (data) => this.handleVoice(data));
	}

	private handleVoice(data: string): void {
		this.client.rooms.forEach((room) =>
			this.client.to(room).emit('voice', { user: this.user.id, data })
		);
	}
}
