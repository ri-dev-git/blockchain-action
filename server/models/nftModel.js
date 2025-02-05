const mongoose = require("mongoose");
const { Schema } = mongoose;

const nftSchema = new mongoose.Schema({
    contractAddress: String,
    tokenId: String,
    name: String,
    description: String,
    image: String,
});

const NFT = mongoose.model('NFT', nftSchema);
module.exports = NFT; 