export interface LoginResponse {
    code: number;
    message: string;
    result: {
        authenticated: boolean;
        token: string;
    };
}
