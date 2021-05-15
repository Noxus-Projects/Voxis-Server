export default interface User {
	name: string;
	avatar: string;
	id: string;
	nickname: string;
	status: Status;
	permissions: Permission[];
}

export type DbUser = Omit<User, 'id'>;

export enum Status {
	ONLINE = 1,
	AWAY = 2,
	OFFLINE = 3,
}

export enum Permission {
	MUTE_OTHERS = 1,
	DISCONNECT_OTHERS = 2,
	DEAFEN_OTHERS = 3,
	MOVE_OTHERS = 4,
	EDIT_CHANNEL = 5,
	SEE_CHANNELS = 6,
	CREATE_CHANNEL = 7,
	REMOVE_CHANNEL = 8,
	CREATE_ROOM = 9,
	JOIN_ROOM = 10,
	MANAGE_WHITELIST = 11,
	SEND_MESSAGE = 12,
	REMOVE_MESSAGE = 13,
	MANAGE_PERMISSIONS = 14,
	EDIT_NICKNAME = 15,
	SPEAK = 16,
}
