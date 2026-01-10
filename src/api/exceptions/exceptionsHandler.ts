import {z} from 'zod'
import {HttpError} from './HttpError.js'
import {badRequest} from '../ApiResponseContract.js'
import type {Request, Response, NextFunction} from 'express';
import {InvalidPasswordError} from './InvalidPasswordError.js';

export function exceptionsHandler(
    err: Error | HttpError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(err);
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({message: err.message});
    } else if (err instanceof InvalidPasswordError) {
        return res.status(err.statusCode).json({message: err.message});
    } else {
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export async function handleZodError(res: Response, error: z.ZodError) {
    console.log("zod error: " + error)

    return badRequest(res, error.issues.map(issue => {
        let message = issue.message;
        if (message.includes("Invalid option:")) {
            message = message.replace(/"\|\"/g, ", ").replace(/"/g, "");
        }
        return issue.path.join(".") + ": " + message;
    }));
}