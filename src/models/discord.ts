export interface OAuthTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: 'identify';
}

export interface UserInfo {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	public_flags: number;
	flags: number;
	locale: string;
	system?: boolean;
	bot?: boolean;
	mfa_enabled?: boolean;
}
