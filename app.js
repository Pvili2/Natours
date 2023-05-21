const express = require('express');
const fs = require('fs');
const app = express();

/* app.get('/', (req, res) => {
  //Küldhetünk szöveget vissza:
  // res.status(200).end('Hello from the server');
  //Küldhetünk jSON-t is vissza:
  res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post this url');
}); */

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('Server is listening on ' + port);
});
