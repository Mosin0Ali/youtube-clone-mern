import jwt from "jsonwebtoken"
import { createError } from "./error.js"

export const verifyToken=(req,res,next)=>{
    const token= req.cookies.access_token
    if(!token) return next(createError(401,"Unauthenticated !"));

    jwt.verify(token,process.env.AUTH_SECRET,(err,user)=>{
        if(err) return next(createError(403,"Invalid Token !"));
        req.user=user;
        next();
    });

}