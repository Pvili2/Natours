const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

const getAllTours = (req, res) => {
  //200 means OK
  res.status(200).json({
    status: 'success',
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

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log('Server is listening on ' + port);
});
