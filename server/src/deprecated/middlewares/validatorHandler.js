//validatorHandler.js
const validatorHandler = (req, res, next, schema) => {
    const { error } = schema.validate(req.body);
    // console.log(error)
    if (error) {
       res.status(400).json({
            status: 'error',
            message: error.details[0].message.replace('/[^a-zA-Z0-9 ]/g', '')
        });
        return;
    }
    next();
};

module.exports = validatorHandler;