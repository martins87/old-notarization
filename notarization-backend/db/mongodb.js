const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blockchain-db', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Successfully connected to blockchain-db!');
    } else {
        console.log('Error in database connection: ' + JSON.stringify(err, undefined, 2));
    }
});

module.exports = mongoose;
