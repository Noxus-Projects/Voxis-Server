export default interface User {
	name: string;
	picture: string;
	id: string;
	permissions: Permission[];
}

export enum Permission {
	MANAGE_OTHERS = 1,
	MANAGE_CHANNELS = 2,
}
