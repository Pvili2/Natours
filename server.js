const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

//Error handler to uncaught exceptions
process.on('uncaughtException', err => {
  console.log('💥 UNCAUGHT ERROR. Server shutdown...')
  console.log(err.name, err.message);
  process.exit(1);

})

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => console.log('DB connection successfull'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Server is listening on ' + port);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1);
  });
})

console.log(x)
