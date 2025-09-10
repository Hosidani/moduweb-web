import { ReactNode } from 'react';
interface User {
    id: number;
    userName: string;
    email: string;
}
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}
export declare const AuthProvider: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
