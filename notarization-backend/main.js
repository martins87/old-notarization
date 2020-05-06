const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db/mongodb.js');
var transactionController = require('./controllers/transactionController.js');

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// With the configuration below it shouted the error 'HttpErrorResponse: Unkown Error'
// app.use(cors({ origin: 'http://localhost:4200/' }));
app.use(cors());

app.use('/transactions', transactionController);

app.get('/', (req, res) => {
    res.send(`Server on port ${port} (database and HTTP requests) successfully configured`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
