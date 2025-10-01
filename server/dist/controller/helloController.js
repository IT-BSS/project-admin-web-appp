import logger from '../middleware/logger.js';
export const getHello = (req, res) => {
    try {
        logger.info('Hello endpoint accessed', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        });
        res.status(200).json({
            success: true,
            message: 'Server is working!',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
    catch (error) {
        logger.error('Error in hello endpoint', { error: error instanceof Error ? error.message : error });
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
//# sourceMappingURL=helloController.js.map