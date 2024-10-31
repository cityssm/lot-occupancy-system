import type { Request, Response } from 'express';
export default function handler(request: Request<unknown, unknown, {
    lotStatusId: string;
}>, response: Response): Promise<void>;
