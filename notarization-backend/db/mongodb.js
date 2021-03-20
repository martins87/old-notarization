const mongoose = require('mongoose');
require('dotenv').config();

// var dbUrl = process.env.LOCAL_DB_URL;
var dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log('Successfully connected to notarization-db!');
    } else {
        console.log('Error in database connection: ' + JSON.stringify(err, undefined, 2));
    }
});

module.exports = mongoose;
