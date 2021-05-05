export default interface Channel {
	name: string;
	id: string;
	messages: Record<string, Message>;
	created: Date;
	creator: string;
}

export interface Message {
	content: string;
	author: string;
	id: string;
	timestamp: Date;
}
