import User from './user';

export default interface Channel {
	name: string;
	id: string;
	type: 'text' | 'voice';
}

export interface TextChannel extends Channel {
	type: 'text';
	messages: Message[];
}

export interface Message {
	content: string;
	author: User;
	timestamp: Date;
}
