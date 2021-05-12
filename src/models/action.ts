export default interface Action {
	timestamp: number;
	user: string;
	type: string;
	data: unknown;
}
