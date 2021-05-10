import { Response, Request } from 'express';

export default function rateLimit(req: Request, res: Response): void {
	res.status(429).json({ error: 'Too many requests' });
}
