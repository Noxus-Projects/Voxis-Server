export default interface Action {
	timestamp: number;
	user: string;
	type: ActionType;
	data: unknown;
	id: string;
}

type ChannelActions = 'removedChannel' | 'editedChannel' | 'createdChannel';
type MessageActions = 'sentMessage' | 'removedMessage' | 'editedMessage';

export type ActionType = ChannelActions | MessageActions;

export type DbAction = Omit<Action, 'id'>;
