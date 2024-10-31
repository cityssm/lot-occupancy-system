import type { Request, Response } from 'express';
export default function handler(request: Request<unknown, unknown, {
    lotStatusId: string;
    lotStatus: string;
}>, response: Response): Promise<void>;
