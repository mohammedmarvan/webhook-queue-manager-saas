import { Request } from 'express'

export default function handleIncomingController(req: Request, projectName: string, sourceName: string) {
    if (!req || !projectName || !sourceName) return null;

    
}