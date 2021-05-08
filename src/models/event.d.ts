export namespace MessageEvents {
	export interface Message {
		/**
		 * The channels id.
		 */
		channel: string;
		/**
		 * The message that needs to be sent.
		 */
		id: string;
	}

	export interface Remove {
		/**
		 * The channels id.
		 */
		channel: string;
		/**
		 * The message that needs to be sent.
		 */
		id: string;
	}

	export interface Edit {
		/**
		 * The channels id.
		 */
		channel: string;
		/**
		 * The message id.
		 */
		id: string;
		/**
		 * The new message content.
		 */
		updated: string;
	}
}

export namespace RoomEvents {
	export interface Change {
		/**
		 * The users id.
		 */
		user?: string;
		/**
		 * The rooms name
		 */
		room: string;
	}
}

export namespace NicknameEvents {
	export interface Edit {
		/**
		 * The new nickname.
		 */
		updated: string;

		/**
		 * The users id.
		 */
		user?: string;
	}
}

export namespace PermissionEvents {
	export interface Add {
		/**
		 * The users id.
		 */
		user?: string;
		/**
		 * The new permission(s).
		 */
		updated: Permission[];
	}

	export interface Remove {
		/**
		 * The users id.
		 */
		user?: string;
		/**
		 * The new permission(s).
		 */
		removed: Permission[];
	}
}

export namespace ChannelEvents {
	export interface Edit {
		id: string;
		name: string;
	}
}
