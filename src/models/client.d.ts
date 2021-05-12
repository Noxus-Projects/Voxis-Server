import { Permission } from '@models/user';

export namespace Client {
	export type Reply = (message: string) => void;

	export namespace Channel {
		/**
		 * Removes a channel.
		 * @param id - The id of the channel.
		 * @param reply - Replies if an error occurs.
		 * @emits 'removedChannel' The id of the removed channel.
		 */
		export type remove = (id: string, reply?: Reply) => void;

		interface Edit {
			id: string;
			name: string;
		}

		/**
		 * Edits a channel.
		 * @param edited - An object containing the new name and the id of the channel.
		 * @param reply - Replies if an error occurs.
		 * @emits 'updatedChannel' - The updated channel.
		 */
		export type edit = (edit: Edit, reply?: Reply) => void;

		/**
		 * Returns a requested channel (Or every channel if none are specified).
		 * @param id - The id of the channel.
		 * @param reply - Replies with the channel, an array of channels or an error.
		 */
		export type get = (id: string, reply?: (channel: Channel | Channel[] | string) => void) => void;
	}

	export namespace Message {
		interface Send {
			/**
			 * The channels id.
			 */
			channel: string;
			/**
			 * The message that needs to be sent.
			 */
			content: string;
		}

		/**
		 * Sends a message in a given channel.
		 * @param options - An object containing the id of a channel and the message to send.
		 * @param reply - Replies when an eror occurs.
		 * @emits 'message' - The sent message, with the channel it was sent in.
		 */
		export type send = (options: Send, reply?: Reply) => void;

		interface Remove {
			/**
			 * The channels id.
			 */
			channel: string;
			/**
			 * The id of the message that needs to be removed.
			 */
			id: string;
		}

		/**
		 * Removes a message in a given channel.
		 * @param options - An object containing the id of a channel and the message to remove.
		 * @param reply - Replies when an eror occurs.
		 * @emits 'removedMessage' - The removed message, with the channel it was sent in.
		 */
		export type remove = (options: Remove, reply?: Reply) => void;

		interface Edit {
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

		/**
		 * Edits a message in a given channel.
		 * @param options - An object containing the id of a channel and the message to edit.
		 * @param reply - Replies when an eror occurs.
		 * @emits 'editedMessage' - The edited message, with the channel it was sent in.
		 */
		export type edit = (options: Edit, reply?: Reply) => void;
	}

	export namespace Nickname {
		interface Edit {
			/**
			 * The new nickname.
			 */
			updated: string;
			/**
			 * The users id.
			 */
			user?: string;
		}

		/**
		 * Edit a users nickname.
		 * @param data - An object containing the new nickname and optionally the user id.
		 * @param reply - The reply when an error occurs.
		 * @emits 'editedNickname' - The new nickname, with the user that had the nickname edited
		 */
		export type edit = (data: Edit, reply: (message: string) => void) => void;
	}

	export namespace Permission {
		/**
		 * Get a permission for a user with a given id.
		 * @param id - The users id.
		 * @param reply - Replies with a list of permissions.
		 */
		export type get = (id: string, reply: (permissions: Permission[] | string) => void) => void;

		interface Add {
			/**
			 * The users id.
			 */
			user?: string;
			/**
			 * The new permission(s).
			 */
			updated: Permission[];
		}

		export type add = (data: Add, reply: Reply) => void;

		interface Remove {
			/**
			 * The users id.
			 */
			user?: string;
			/**
			 * The new permission(s).
			 */
			removed: Permission[];
		}

		/**
		 * Remove permissions from a given user.
		 * @param data - An object containing the removed permission(s) and the users id.
		 * @param reply - Replies when an error occurs.
		 */
		export type remove = (data: Remove, reply: Reply) => void;
	}

	export namespace Room {
		interface Change {
			/**
			 * The room that a disconnected / joined
			 */
			room: string;
			/**
			 *
			 */
			user?: string;
		}

		export type change = (data: Change, reply: (message: string) => void) => void;
	}
}
