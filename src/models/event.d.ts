export interface RoomEvent {
	user: string;
	room: string;
}

export interface VoiceEvent {
	user: string;
	data: Buffer;
}

export namespace MessageEvents {
	export interface Message {
		/**
		 * The channels id.
		 */
		channel: string;
		/**
		 * The message that needs to be sent.
		 */
		message: string;
	}

	export interface Edit {
		/**
		 * The channels id.
		 */
		channel: string;
		/**
		 * The message id.
		 */
		id: string;
		/**
		 * The new message content.
		 */
		updated: string;
	}
}

export namespace ChannelEvents {
	interface Edit {
		id: string;
		name: string;
	}
}
