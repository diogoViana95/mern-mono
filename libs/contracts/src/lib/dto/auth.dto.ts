export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

export type TokenResponse = {
  token: string;
  tokenDuration: number;
  refreshToken: string;
  refreshTokenDuration: number;
};
