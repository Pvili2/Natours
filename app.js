const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError')
const globalErrorHandler = require('./controllers/errorController')
const app = express();

//MIDDLEWARES

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json()); // Middleware, with that we can access the request body
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTE HANDLERS

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//app.all is listening on every http method request (we can use app.use for this error handling but app.all is better)
app.all('*', async (req, res, next) => {

  next(new AppError(`404 - route not found (${req.path})`, 404)); // we can pass a paramter to the "next" function. Express automatically knows that there is an error.
});

//Global error handling middleware
app.use(globalErrorHandler);

//Start server
module.exports = app;
