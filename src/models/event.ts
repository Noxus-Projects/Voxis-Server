import { Socket } from 'socket.io';

import User from './user';

type Event = (client: Socket, user: User, data: string) => void;

export interface RoomEvent {
	user: User;
	room: string;
}

export interface VoiceEvent {
	user: User;
	data: Buffer;
}

export interface MessageEvent {
	channel: string;
	message: string;
}

export default Event;
