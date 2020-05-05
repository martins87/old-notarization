const { ethers, utils } = require('ethers');
const axios = require('axios');
require('dotenv').config();

const provider = ethers.getDefaultProvider('ropsten');
const wallet = new ethers.Wallet(process.env.WALLET_KEY, provider);
const WALLET_ADDRESS = wallet.address;
var nonce;

provider.getTransactionCount(WALLET_ADDRESS).then((transactionCount) => {
    nonce = transactionCount;
});

const main = async () => {
    let data = '.env test';
    let gasPrices = await getCurrentGasPrices();

    let txObject = {
        to: WALLET_ADDRESS,
        value: utils.parseEther('0'),
        gasLimit: 30000,
        gasPrice: gasPrices.high * 1000000000,
        nonce: nonce,
        data: '0x' + Buffer.from(data, 'utf8').toString('hex'),
        chainId: 3
    }
    
    wallet.sign(txObject).then((tx) => {
        console.log('Transaction signed: ', tx);
    }).catch(err => {
        console.log('Error on signing transaction: ', err);
    });
    
    wallet.sendTransaction(txObject).then((transaction) => {
        console.log('Transaction:', transaction);
    }).catch((err) => {
        console.log('Error on sending transaction: ', err);
    });
}

const getCurrentGasPrices = async () => {
    let response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json');
    let prices = {
        low: response.data.safeLow/10,
        medium: response.data.average/10,
        high: response.data.fast/10
    }

    return prices;
}

main();
