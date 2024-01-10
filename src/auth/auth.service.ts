import { Injectable } from '@nestjs/common';
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    signup(dto: AuthDto){
        return {
            msg: "I am sign up",
        };
    }

    signin(){
        return {
            msg: "I am sign in",
        };
    }
}
