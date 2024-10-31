import type { Request, Response } from 'express';
export default function handler(request: Request<unknown, unknown, {
    occupancyTypeId: string;
    printEJS: string;
}>, response: Response): Promise<void>;
