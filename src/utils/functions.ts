import { Request } from 'express';

import { join } from 'path';
const root = process.cwd();

/**
 * Returns a full path
 * @param path - The relative path.
 */
export function Base(...path: string[]): string {
	return join(root, ...path);
}

export function getIpAdress(req: Request): string {
	return (req.headers['cf-connecting-ip'] ??
		req.headers['x-forwarded-for'] ??
		req.socket.remoteAddress ??
		'') as string;
}
