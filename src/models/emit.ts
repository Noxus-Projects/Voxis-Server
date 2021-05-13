import { Permission } from '@models/user';
import Channel, { Message } from '@models/channel';

/* eslint-disable @typescript-eslint/no-namespace */
export interface EmitMap {
	voice: VoiceEmit.send;

	joinedRoom: RoomEmit.join;
	leftRoom: RoomEmit.leave;

	addedPermission: PermissionEmit.add;
	removedPermission: PermissionEmit.remove;

	editedNickname: NicknameEmit.edit;

	sentMessage: MessageEmit.update;
	editedMessage: MessageEmit.update;
	removedMessage: MessageEmit.update;

	removedChannel: ChannelEmit.remove;
	updatedChannel: ChannelEmit.update;
	createdChannel: ChannelEmit.update;

	addedWhitelist: WhitelistEmit.add;
	removedWhitelist: WhitelistEmit.remove;
}

export namespace WhitelistEmit {
	export type add = (id: string) => void;
	export type remove = (id: string) => void;
}

export namespace VoiceEmit {
	interface Send {
		user: string;
		data: string;
	}

	export type send = (options: Send) => void;
}

export namespace RoomEmit {
	interface Change {
		room: string;
		user: string;
	}

	export type join = (options: Change) => void;

	export type leave = (options: Change) => void;
}

export namespace NicknameEmit {
	interface Edit {
		updated: string;
		user: string;
	}

	export type edit = (options: Edit) => void;
}

export namespace PermissionEmit {
	interface Change {
		user: string;
		updated: Permission[];
	}

	export type add = (options: Change) => void;

	export type remove = (options: Change) => void;
}

export namespace MessageEmit {
	interface Update {
		channel: string;
		message: Message;
	}

	export type update = (options: Update) => void;
}

export namespace ChannelEmit {
	export type remove = (id: string) => void;
	export type update = (channel: Channel) => void;
}
