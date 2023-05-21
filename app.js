const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json()); // Middleware, with that we can access the request body

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

//ROUTE HANDLERS
const getAllTours = (req, res) => {
  //200 means OK
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((x) => x.id == req.params.id);

  tour
    ? res.status(200).json({ status: 'success', data: { tour } }) //200 means OK
    : res.status(404).json({ status: 'fail', message: 'Invalid ID' }); //404 means NOT FOUND
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      //201 means created
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
  // res.send('Done'); We cannot send multiple responses, only one!
};

const updateTour = (req, res) => {
  tours.length < req.params.id * 1
    ? res.status(404).json({ status: 'fail', message: 'Invalid ID' })
    : res
        .status(200)
        .json({ status: 'success', data: { tour: '<Updated tour is here>' } });
};

const deleteTour = (req, res) => {
  tours.length < req.params.id * 1
    ? res.status(404).json({ status: 'fail', message: 'Invalid ID' })
    : res
        .status(204) // 204 means NO CONTENT
        .json({ status: 'success', data: null });
};

const getAllUsers = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  }); //500 means server error
};
const createUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};
const getUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};
const updateUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};
const deleteUser = (req, res) => {
  res.status(501).json({
    status: 'error',
    data: { message: 'This endpoint not implemented yet!' },
  });
};

//ROUTES
const tourRouter = express.Router();
const userRouter = express.Router();
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
//Start server
const port = 3000;
app.listen(port, () => {
  console.log('Server is listening on ' + port);
});
