export interface RoomEvent {
	user: string;
	room: string;
}

export interface VoiceEvent {
	user: string;
	data: Buffer;
}

export namespace MessageEvents {
	export interface MessageEvent {
		/**
		 * The channels id.
		 */
		channel: string;
		/**
		 * The message that needs to be sent.
		 */
		message: string;
	}

	export interface EditMessageEvent {
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

export interface EditChannelEvent {
	id: string;
	name: string;
}
