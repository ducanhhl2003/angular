// export interface LoginResponseM {
//     code: string;
//     message: string;
//     result: {
//         token: string;
//         expiresIn: number;
//         user: {
//             id: number;
//             username: string;
//             email: string;
//             roleName: string;
//         };
//     };
// }
export interface LoginResponse {
    code: string;
    message: string;
    result: {
        authenticated: boolean;
        token: string;
    };
}
