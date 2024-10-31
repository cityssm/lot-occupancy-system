import type { Request, Response } from 'express';
export default function handler(request: Request<unknown, unknown, {
    occupancyTypeFieldId: string;
}>, response: Response): Promise<void>;
