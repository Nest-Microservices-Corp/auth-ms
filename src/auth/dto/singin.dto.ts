import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class SinginDto {
	
    @IsString()
    @IsEmail()
    username: string;

    @IsString()
    @IsStrongPassword()
    password: string;
    
}