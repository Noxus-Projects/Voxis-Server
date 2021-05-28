export default interface Action {
	timestamp: number;
	user: string;
	type: ActionType;
	data: unknown;
	id: string;
}

type ChannelActions = 'removedChannel' | 'editedChannel' | 'createdChannel';
type MessageActions = 'removedMessage' | 'editedMessage';
type NicknameActions = 'editedNickname';

export type ActionType = ChannelActions | MessageActions | NicknameActions;
