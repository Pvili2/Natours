const AppError = require("../utils/AppError");

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({ status: err.status, message: err.message, stack: err.stack, error: err });

}

const sendErrorProd = (err, res) => {
    err?.isOperational ? res.status(err.statusCode).json({ status: err.status, message: err.message })
        : res.status(500).json({ status: 'error', message: 'Something went wrong' }) //&& console.error('ERROR', err);
}

const castErrorHandler = (err) => {
    const message = `{${err.value}} is an invalid id!`
    return new AppError(message, 400) // 400 means bad request
}

const mongoErrorHandler = (err) => {
    const message = `The name {${err.keyValue?.name}} is already in the database`;

    return new AppError(message, 400) // 400 means bad request
}

const validationErrorHandler = (err) => {
    let errors = Object.entries(err.errors);
    let message = '';
    for (let i = 0; i < errors.length; i++) {

        message += `${errors[i][1]} \n`;
    }
    console.log(Object.entries(err.errors).length)
    return new AppError(message, 403) // 400 means bad request
}

const jsonWebErrorHandler = () => {

    return new AppError('Invalid token, please use a real one', 401)
}
const tokenExpiredHandler = () => {
    return new AppError('The token is expired, please log in again', 401)
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        switch (err.name) {
            case 'CastError':
                error = castErrorHandler(error);
                break;
            case 'MongoError':
                error = mongoErrorHandler(error)
                break;
            case 'ValidationError':
                error = validationErrorHandler(error)
                break;
            case 'JsonWebTokenError': error = jsonWebErrorHandler()
            case 'TokenExpiredError': error = tokenExpiredHandler(error)
        }
        sendErrorProd(error, res);
    }
    next();
}