import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup(dto: AuthDto) {
        const { email, password } = dto;

        try {
            const hash = await argon.hash(password);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    hash,
                },
            })

            delete user.hash;

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new ForbiddenException("Credentials Taken");
                }
            }
        }
    }

    async signin(dto: AuthDto) {
        const { email, password } = dto;

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        });
        if (!user) {
            throw new ForbiddenException("Invalid Credentials");
        }
        if (await argon.verify(user.hash, password)) {
            delete user.hash;
            return user;
        } else {
            throw new ForbiddenException("Invalid Password");
        }

    }
}
