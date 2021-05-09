import { join } from 'path';
const root = process.cwd();

/**
 * Returns a full path
 * @param path - The relative path.
 */
export function Base(path: string): string {
	return join(root, path);
}
