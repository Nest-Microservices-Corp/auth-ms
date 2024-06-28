import { PartialType } from "@nestjs/mapped-types";
import { SinginDto } from "./singin.dto";
import { IsString } from "class-validator";

export class registerDto extends PartialType( SinginDto ) {
    
    @IsString()
    name: string;

}