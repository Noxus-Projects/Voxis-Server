import axios from 'axios';

import { OAuthTokenResponse } from '../models/discord';

const request = axios.create({
	baseURL: 'https://discord.com/api/v8/',
});

export default class Discord {
	private clientID = process.env.CLIENT_ID ?? '';
	private clientSecret = process.env.CLIENT_SECRET ?? '';
	private redirect = process.env.REDIRECT ?? '';

	public static async exists(token: string): Promise<boolean> {
		const { status } = await request('users/@me', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			validateStatus: () => true,
		});

		return status !== 401;
	}

	public async token(code: string): Promise<OAuthTokenResponse> {
		const params = new URLSearchParams();

		params.append('client_id', this.clientID);
		params.append('client_secret', this.clientSecret);
		params.append('grant_type', 'authorization_code');
		params.append('code', code);
		params.append('redirect_uri', this.redirect);

		const { data, status } = await request('oauth2/token', {
			method: 'POST',
			data: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			validateStatus: () => true,
		});

		if (status === 400) throw 'Bad code';

		return data;
	}
}
