export interface User {
	id: number;
	userName: string;
	email: string;
}

export function createUser(data: { userName: string; email: string; password: string }): Promise<User>;
export function getUser(id: number | string): Promise<User>;
export function updateUser(id: number | string, data: Partial<User> & { password?: string }): Promise<{ message: string }>;
export function deleteUser(id: number | string): Promise<{ message: string }>;
export function getUsers(): Promise<User[]>;
