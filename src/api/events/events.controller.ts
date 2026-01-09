import type {Request, Response} from "express";

async function getAllEvents(req: Request, res: Response) {
    return res.status(200).send({})
}

async function getEventById(req: Request, res: Response) {
    return res.status(200).send({})
}

async function createEvent(req: Request, res: Response) {
    return res.status(200).send({})
}

async function updateEvent(req: Request, res: Response) {
    return res.status(200).send({})
}

async function deleteEvent(req: Request, res: Response) {
    return res.status(200).send({})
}


export {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
}