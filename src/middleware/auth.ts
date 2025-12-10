import { NextFunction, Request, Response } from "express"
import config from "../config";
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            console.log({ authToken: token });

            if (!token) {
                return res.status(500).json({ message: 'You are not allowed to access this resource' });
            };

            const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;

            req.user = decoded as jwt.JwtPayload;

            // console.log({ decoded })

            if(roles.length && !roles.includes(decoded.role as string)){
                return res.status(403).json({
                    message: 'unauthorized access',
                })
            }
            next();

        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err?.message,
            })

        }
    };
};

export default auth;