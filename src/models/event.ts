import { Socket } from 'socket.io';

import User from './user';

type Event = (client: Socket, user: User, data: string) => void;

export interface RoomEvent {
	user: User;
	room: string;
}

export interface VoiceEvent {
	user: string;
	data: Buffer;
}

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

export default Event;
