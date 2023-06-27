const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require("../utils/ApiFeatures")
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf8')
);

const aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage, price";
  req.query.fields = "name, price,ratingsAverage,summary,difficulty";
  next();
}

const getAllTours = catchAsync(async (req, res) => {
  const tours = await (new APIFeatures(Tour.find(), req.query).filter().sorting().pagination().fieldLimiting()).query;
  res.status(200).json({ status: "success", results: tours.length, data: { tours } })
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  !tour ? next(new AppError('Tour not found', 404)) : res.status(200).json({ status: 'success', data: { tour } }); //200 means OK
});

const createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  //201 means created
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  !updateTour ? next(new AppError('Tour not found', 404)) :
    res.status(200).json({ status: 'success', data: { tour: updatedTour } });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  !tour ? next(new AppError('Tour not found', 404)) :
    res.status(204).json({ status: 'success', data: null }); // 204 means NO CONTENT
});
const getTouStatistics = catchAsync(async (req, res) => {
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
})

const getMonthlyPlan = catchAsync(async (req, res) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates" //deconstruct an array which is good for us
    },
    {
      $addFields: {
        "startYear": { $year: "$startDates" },
      }
    },
    {
      $match: {
        startYear: year
      }
    },
    {
      $group: {
        "_id": { $month: "$startDates" },
        "numOfTours": { $sum: 1 },
        "tours": { $push: "$name" }
      }
    },
    {
      $sort: {
        "numOfTours": -1
      }
    },
    {
      $addFields: {
        "month": "$_id"
      }
    },
    {
      $project: {
        _id: 0,
      }
    }
  ])
  res.status(200).json({
    status: 'success', results: plan.length, data: plan
  });
})

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTouStatistics,
  getMonthlyPlan
};
