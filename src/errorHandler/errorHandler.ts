import {NextFunction, Request, Response} from "express";

type LibError = {status:number, message:string}

export const errorHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
    try{
        const error:LibError = JSON.parse(err.message)
        res.status(error.status).end(error.message)
    } catch (e) {
        res.status(500).end(`Unknown server error : ${err.message}`)
    }
}