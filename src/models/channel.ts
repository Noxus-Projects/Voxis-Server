export default interface Channel {
	name: string;
	id: string;
	created: number;
	creator: string;
}

export type DbChannel = Omit<Channel, 'id'>;

export interface Message {
	content: string;
	author: string;
	id: string;
	created: number;
}

export type DbMessage = Omit<Message, 'id'>;
