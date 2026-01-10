/**
 * API responses and their meanings
 * @author: https://www.linkedin.com/in/ajimatidavid
 *
 * 00 - success / OK
 * 41 - Unauthorized access
 * 43 -  Action Forbidden
 * 44 -  Resource not found
 * 55 -  Service unavailable
 * 77 -  duplicate request
 * 99 -  Bad request
 * 100 - internal server error
 */

const successResponse = (res: any, data: any): void => {
    return res.status(200).json({
        code: "00",
        message: "Success",
        data: data
    });
}

const badRequest = (res: any, data: any): void => {
    return res.status(400).json({
        code: "99",
        message: "Bad Request",
        data: data
    });
}

const notFound = (res: any, data: any): void => {
    return res.status(404).json({
        code: "44",
        message: "Not found",
        data: data
    });
}

const unauthorizedRequest = (res: any, data: any): void => {
    return res.status(401).json({
        code: "41",
        message: "Unauthorized Access",
        data: data
    });
}

const forbiddenRequest = (res: any, data: any): void => {
    return res.status(403).json({
        code: 43,
        message: "Action Forbidden",
        data: data
    });
}

const serviceUnavailable = (res: any, data: any): void => {
    return res.status(503).json({
        code: "55",
        message: "Service unavailable at the moment",
        data: data
    })
}

const duplicateRequest = (res: any, data: any): void => {
    return res.status(409).json({
        code: "77",
        message: "Conflicting request",
        data: data
    })
}

const internalServerError = (res: any, data: any): void => {
    return res.status(500).json({
        code: "100",
        message: "internal server error",
        data: data
    })
}

const genericResponse = (res: any, status: Number, code: string, msg: string, data: any): void => {
    return res.status(status).json({
        code: code,
        message: msg,
        data: data
    })
}

export {
    successResponse,
    badRequest,
    notFound,
    unauthorizedRequest,
    forbiddenRequest,
    serviceUnavailable,
    duplicateRequest,
    internalServerError,
    genericResponse
}