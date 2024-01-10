import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

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

            return this.signToken(user.id, user.email);
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

        const isValidPassword = await argon.verify(user.hash, password);
        if (!isValidPassword) {
            throw new ForbiddenException("Invalid Password");
        }

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get("JWT_SECRET")
        });

        return {
            access_token: token,
        };
    }
}
