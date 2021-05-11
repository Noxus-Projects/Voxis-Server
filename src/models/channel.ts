export default interface Channel {
	name: string;
	id: string;
	created: Date;
	creator: string;
}

export type DbChannel = Omit<Channel, 'id'>;

export interface Message {
	content: string;
	author: string;
	id: string;
	created: Date;
}
