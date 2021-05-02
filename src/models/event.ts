import { Socket } from 'socket.io';

import User from './user';

type Event = (client: Socket, user: User, data: string) => void;

export default Event;
