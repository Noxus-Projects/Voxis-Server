import axios from 'axios';

import { OAuthTokenResponse, UserInfo } from '@models/discord';

const request = axios.create({
	baseURL: 'https://discord.com/api/v8/',
});

export default class Discord {
	private clientID = process.env.CLIENT_ID ?? '';
	private clientSecret = process.env.CLIENT_SECRET ?? '';
	private redirect = process.env.REDIRECT ?? '';

	public static async user(token: string): Promise<[UserInfo | void, boolean]> {
		const { data, status } = await request('users/@me', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			validateStatus: () => true,
		});

		return [data, status === 200];
	}

	public async refresh(refreshToken: string): Promise<OAuthTokenResponse> {
		const params = new URLSearchParams();

		params.append('client_id', this.clientID);
		params.append('client_secret', this.clientSecret);
		params.append('grant_type', 'refresh_token');
		params.append('refresh_token', refreshToken);

		const { data, status } = await request('oauth2/token', {
			method: 'POST',
			data: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			validateStatus: () => true,
		});

		if (status !== 200) throw 'Bad refresh token';

		return data;
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
