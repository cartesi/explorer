import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';
import runMiddleware from '../../utils/runMiddleware';

const cors = Cors({
    methods: ['GET', 'HEAD'],
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await runMiddleware(req, res, cors);

    res.json({
        message: 'hello',
    });
};

export default handler;
