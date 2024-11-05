export interface User {
    name: string;
    email: string;
    accessToken: string | null;
    refreshToken?: string | null;
    createdAt: string;
}