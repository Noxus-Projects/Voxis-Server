export default interface User {
	name: string;
	picture: string;
	id: string;
	permissions: Permission[];
}

export enum Permission {
	MUTE_OTHERS = 1,
	DISCONNECT_OTHERS = 2,
	DEAFEN_OTHERS = 3,
	MOVE_OTHERS = 4,
	EDIT_CHANNEL = 5,
	SEE_CHANNEL = 6,
	CREATE_CHANNEL = 7,
	REMOVE_CHANNEL = 8,
	CREATE_ROOM = 9,
}
