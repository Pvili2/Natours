const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name property is required'],
    unique: [true, 'The name property must be unique'],
    trim: true,
    maxlength: [40, 'The maximum length of the name property is 40 characters'],
    minlength: [10, 'The minimum length of the name property is 10 characters'],
    validate: {
      validator: (value) => {
        return validator.isAlpha(value.replaceAll(' ', ''));
      },
      message: 'The name property must be contains alpha characters'
    }
  },
  slug: {
    type: String,
  },
  duration: {
    type: Number,
    required: [true, 'The duration property is required'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'The difficulty property must have a value of easy or medium or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "The rating must be above 1"],
    max: [5, "The rating must be below 5"]
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'The price property is required'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      //only works when the user create a document. If you wanna update a tour, this is not going to work
      validator: function (value) {
        return value < this.price;
      },
      message: "The priceDiscount({VALUE}) must be lower then the pice."
    }
  },
  summary: {
    type: String,
    trim: true, // eltávolít minden white space-t a string elejéről és végéről
    required: [true, 'The summary property is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have an image cover'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  secretTours: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true } //virtual properties are appear in the response if we set this true 
});

//implement a virtual property to this schema

tourSchema.virtual("durationWeek").get(function () {

  return this.duration && this.duration / 7;
})

//implement some mongoose middleware


tourSchema.pre('save', function (next) { //this middleware is run before we save a new document in our database
  this.slug = slugify(this.name, { lower: true })
  next();
})

tourSchema.pre(/^find/, function (next) { //this middleware is run every query that starts with "find"
  this.find({ secretTours: { $ne: true } })
  next();
})

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ //we are push the object to the array first index
    $match: { "secretTours": { $ne: true } }
  })
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
