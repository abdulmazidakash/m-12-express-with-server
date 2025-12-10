import { NextFunction, Request, Response } from "express"
import config from "../config";
import jwt from 'jsonwebtoken';

const auth = ()=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        const token = req.headers.authorization;
        console.log({ authToken: token });

        if(!token){
            return res.status(500).json({ message: 'You are not allowed to access this resource'});
        };

        const decoded = jwt.verify(token, config.jwtSecret as string);

        console.log({ decoded })
        next();
    };
};

export default auth;