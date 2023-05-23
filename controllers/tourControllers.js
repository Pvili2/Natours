const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

const checkId = (req, res, next, val) => {
  console.log(`The tour id is: ${val}`);

  if (tours.length < req.params.id * 1) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Must have a price and name' });
  }
  next();
};

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

  tour && res.status(200).json({ status: 'success', data: { tour } }); //200 means OK
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Updated tour is here>' } });
};

const deleteTour = (req, res) => {
  res
    .status(204) // 204 means NO CONTENT
    .json({ status: 'success', data: null });
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkBody,
};
