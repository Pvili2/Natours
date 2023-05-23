const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => console.log('DB connection successfull'));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The name property is required'],
    unique: [true, 'The name property must be unique'],
  },
  rating: {
    type: String,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'The price property is required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log(err));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server is listening on ' + port);
});
