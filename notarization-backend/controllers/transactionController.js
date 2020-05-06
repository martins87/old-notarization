const express = require('express');
const router = express.Router();
const sha256 = require('sha256');
const ObjectId = require('mongoose').Types.ObjectId;

const Transaction = require('../models/transaction');
const ethereum = require('../ethereum');

router.get('/', (req, res) => {

    Transaction.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Error on retrieving transactions: ' + JSON.stringify(err, undefined, 2));
        }
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send(`No record with given id ${id}`);
    }

    Transaction.findById(id, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log('Error on retrieving transaction: ' + JSON.stringify(err, undefined, 2));
            res.send(JSON.stringify(err, undefined, 2));
        }
    });
});

router.get('/check/:data', (req, res) => {
    // const digestToCheck = sha256(req.params.data);
    const digestToCheck = req.params.data;
    // console.log('To check:', { data: req.params.data, digest: digestToCheck });
    console.log('To check:', { digest: digestToCheck });

    Transaction.find({ data: digestToCheck }, (err, doc) => {
        if (!err) {
            if (doc) {
                // map returns item.tx
                let txArray = doc.map(item => item.tx);
                console.log('Found on transaction(s)', txArray);
                res.send(txArray);
            } else {
                console.log('doc not found:', doc);
                res.send(false);
            }
        } else {
            console.log('Error searching document:', JSON.stringify(err, undefined, 2));
            res.send(JSON.stringify(err, undefined, 2));
        }
    });
});

router.post('/', async (req, res) => {
    // Register the data on ropsten test net
    let digest = req.body.data;
    // let digest = sha256(req.body.data);
    let txHash = await ethereum.register(digest);

    console.log('tx hash:', txHash);

    const transaction = new Transaction({
        address: '', // get from .env
        data: digest,
        timestamp: req.body.timestamp,
        tx: txHash
    });

    transaction.save((err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log('Error on saving the document: ' + JSON.stringify(err, undefined, 2));
            res.send(JSON.stringify(err, undefined, 2));
        }
    })
});

router.put('/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send(`No record with given id ${id}`);
    }

    const transaction = {
        address: req.body.address,
        data: req.body.data
    }

    Transaction.findByIdAndUpdate(id, { $set: transaction }, { new: true }, (err, doc) => {
        if (!err) {
            res.send(doc);
        } else {
            console.log('Error on updating the document: ' + JSON.stringify(err, undefined, 2));
            res.send(`Error on updating doc with id ${id}`);
        }
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(400).send(`No record with given id ${id}`);
    }

    Transaction.findByIdAndDelete(id, (err) => {
        if (!err) {
            res.status(200).send(`Object with id ${id} successfully deleted.`)
        } else {
            console.log('Error on deleting the document: ' + JSON.stringify(err, undefined, 2));
            res.send(`Error on deleting doc with id ${id}`);
        }
    });
});

module.exports = router;
