
import { Role } from "../../models/role"
export interface UserResponse {
    id: number,
    userName: string,
    fullName: string,
    address: string,
    email: string,
    phone: number,
    roles: Role,
    roleName: string
}