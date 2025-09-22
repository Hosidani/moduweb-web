export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginUserResponse {
  username: string;
  // Add other user properties if needed
}

export function loginUser(params: LoginParams): Promise<LoginUserResponse>;