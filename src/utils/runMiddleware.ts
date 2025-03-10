import { NextApiRequest, NextApiResponse } from 'next';

const runMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- Consider using NextApiHandler instead
    fn: Function
) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
};

export default runMiddleware;
