const express = require('express');
const cors = require('cors');

const { mongoose } = require('./db/mongodb.js');
const transactionController = require('./controllers/transactionController.js');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// With the configuration below it shouted the error 'HttpErrorResponse: Unkown Error'
// app.use(cors({ origin: 'http://localhost:4200/' }));
app.use(cors());

app.use('/transactions', transactionController);

app.get('/', (req, res) => {
    res.status(200).send(`Server on port ${port} (database and HTTP requests) successfully configured`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
