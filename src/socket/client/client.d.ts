import { ChannelEvents } from '@models/event';

export namespace Client {
	export type Reply = (message: string) => void;

	export namespace Channels {
		/**
		 * Removes a channel.
		 * @param id - The id of the channel.
		 * @param reply - Replies if an error occurs.
		 * @emits 'removedChannel' The id of the removed channel.
		 */
		export type remove = (id: string, reply?: Reply) => void;

		/**
		 * Edits a channel.
		 * @param edited - An object containing the new name and the id of the channel.
		 * @param reply - Replies if an error occurs.
		 * @emits 'updatedChannel' The updated channel.
		 */
		export type edit = (edit: ChannelEvents.Edit, reply?: Reply) => void;

		/**
		 * Returns a requested channel (Or every channel if none are specified).
		 * @param id - The id of the channel.
		 * @param reply - Replies with the channel, an array of channels or an error.
		 */
		export type get = (
			id: string | null,
			reply?: (channel: Channel | Channel[] | string) => void
		) => void;
	}
}
