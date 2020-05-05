const { ethers, utils } = require('ethers');
const axios = require('axios');
require('dotenv').config()

const provider = ethers.getDefaultProvider('ropsten');
const wallet = new ethers.Wallet(process.env.WALLET_KEY, provider);
const walletAddress = wallet.address;
var nonce;

provider.getTransactionCount(walletAddress).then((transactionCount) => {
    nonce = transactionCount;
})

const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json');
    let prices = {
        low: response.data.safeLow/10,
        medium: response.data.average/10,
        high: response.data.fast/10
    }

    return prices;
}

// needs to be a function that returns a Promise
// for this promise to be used on transactionController.js
const register = async (data) => {
    // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise
    let gasPrices = await getCurrentGasPrices();

    let txObject = {
        to: walletAddress,
        value: utils.parseEther('0'),
        gasLimit: 30000,
        gasPrice: gasPrices.high * 1000000000,
        // nonce: nonce,
        data: '0x' + Buffer.from(data, 'utf8').toString('hex'),
        chainId: 3
    }

    wallet.sign(txObject).then((signedTransaction) => {
        console.log('Transaction signed: ', signedTransaction);
    }).catch(err => {
        console.log('Error on signing transaction: ', err);
    });

    let txHash = await wallet.sendTransaction(txObject);

    return txHash.hash;
}

module.exports.register = register;
