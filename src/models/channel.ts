import User from './user';

export default interface Channel {
	name: string;
	id: string;
	messages: Message[];
	created: Date;
	creator: string;
}

export interface Message {
	content: string;
	author: User;
	timestamp: Date;
}
