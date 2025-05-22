import {
    IsString,
    IsNotEmpty,
} from 'class-validator';
export class RegisterDTO {

    @IsString()
    @IsNotEmpty()
    userName: string;
    @IsString()
    @IsNotEmpty()
    passWord: string;
    @IsString()
    @IsNotEmpty()
    retypePassword: string;

    constructor(data: any) {
        this.userName = data.userName;
        this.passWord = data.passWord;
        this.retypePassword = data.retypePassword;
    }
}