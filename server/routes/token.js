const express = require("express");
const cors = require("cors");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth.js");
const { Web3 } = require("web3");
const Transaction = require('../models/transactionsSchema.js');
const process = require("process");

const dotenv = require("dotenv");

dotenv.config();

const web3 = new Web3(`https://sepolia.infura.io/v3/${process.env.INFURA}`);

// ERC20 Token contract address
const contractAddress = "0x7f4211c8870568d6e1d12a30c1b53863ff888dbd";

// ABI of the ERC20 Token contract
const contractABI = require('../ABI/erc20.json'); // You should have the ABI JSON file for your contract

const tokenContract = new web3.eth.Contract(contractABI, contractAddress);

const privateKey = process.env.PRIVATE_KEY;

// Use CORS middleware globally
router.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Apply requireAuth middleware to protect the transfer route
router.post("/transfer", async (req, res) => {
  const { from, to, amount } = req.body;

  try {
    // Get the nonce (transaction count) for the from address
    const nonce = await web3.eth.getTransactionCount(from, 'pending');

    // Estimate the gas limit for the transaction
    const gasLimit = await tokenContract.methods.transfer(to, web3.utils.toWei(amount, 'ether')).estimateGas({ from });

    // Get the current gas price from the network
    const gasPrice = await web3.eth.getGasPrice();

    // Create the transaction object
    const tx = {
      from,
      to: contractAddress, // The contract address (token contract)
      nonce,
      gas: gasLimit, // Use the estimated gas limit
      gasPrice, // Use the current gas price
      data: tokenContract.methods.transfer(to, web3.utils.toWei(amount, 'ether')).encodeABI(),
    };

    // Sign the transaction with the sender's private key
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Save transaction data to MongoDB
    const transaction = new Transaction({
      from,
      to,
      amount,
      transactionHash: receipt.transactionHash,
    });
    await transaction.save();

    // Send response with transaction details
    res.json({
      status: 'success',
      message: 'Transaction successful',
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Error sending transaction', error);
    res.status(500).json({ status: 'error', message: 'Transaction failed', error });
  }
});

module.exports = router;