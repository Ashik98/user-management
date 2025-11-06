export interface JwtPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn?: number;
}

export enum GrantType {
  PASSWORD = 'password',
  REFRESH_TOKEN = 'refresh_token',
  CLIENT_CREDENTIALS = 'client_credentials',
}

export interface OAuthTokenRequest {
  grantType: GrantType;
  email?: string;
  password?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
}
