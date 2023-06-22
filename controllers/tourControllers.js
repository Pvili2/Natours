const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require("../utils/ApiFeatures")
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

const aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name, price,ratingsAverage,summary,difficulty";
  next();
}

const getAllTours = async (req, res) => {
  try {
    const tours = await (new APIFeatures(Tour.find(), req.query).filter().sorting().pagination().fieldLimiting()).query;
    console.log(tours)
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    })
  } catch (error) {
    res.status(404).json({ status: 'error', error: error.message });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({ status: 'success', data: { tour } }); //200 means OK
  } catch (error) {
    res.status(404).json({ status: 'error', error: error });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    //201 means created
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error });
  }
  // res.send('Done'); We cannot send multiple responses, only one!
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ status: 'success', data: { tour: updatedTour } });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res
      .status(204) // 204 means NO CONTENT
      .json({ status: 'success', data: null });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error });
  }
};
const getTouStatistics = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      //STAGE 1, matching the correct data
      {
        $match: { "ratingsAverage": { $gte: 4.5 } }
      },
      //STAGE 2, we can group the datas in different groups
      {
        $group: {
          '_id': "$difficulty", // based on which field we want to group, if it is null, then we are grouping all data in a big group
          'numberOfTours': { $sum: 1 },
          'all-price': { $sum: "$price" },
          'avg-price': { $avg: "$price" },
          'avg-rating': { $avg: "$ratingsAverage" },
          'min-price': { $min: "$price" },
          'max-price': { $max: "$price" },
        }
      },
      //STAGE 3, we can modify the datas, for example we can round the avg numbers to two decimals
      {
        $set: {
          'avg-price': { $round: ['$avg-price', 2] }
        }
      },
      //STAGE 4, we can orderby the elements DESC or ASC
      {
        $sort: {
          "avg-price": - 1
        }
      },
      //We can repeat a stage any amount of times
      /* {
        $match: { "_id": { $ne: "easy" } }
      } */
    ])
    res.status(200).json({ status: 'success', data: stats });
  } catch (error) {
    res.status(404).json({ status: 'error', error: error });
  }
}
module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTouStatistics
};
