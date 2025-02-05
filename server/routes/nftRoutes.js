const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth.js");
const { Web3 } = require("web3");
const NFT = require('../models/nftModel.js')
const ERC721_ABI = require("../ABI/ERC_721.json")

const web3 = new Web3("https://sepolia.infura.io/v3/b46557a185ed44dcb2a9de6c1f8586b1");

router.post('/metadata', async (req, res) => {
    // console.log(req.params)
    const { contractAddress, tokenId } = req.body;
    console.log(contractAddress,tokenId)

    try {
        // Check if the NFT metadata is already in the database
        let nft = await NFT.findOne({ contractAddress, tokenId });
        if (nft) {
            return res.json(nft);
        }

        // Interact with the contract to get tokenURI
        const contract = new web3.eth.Contract(ERC721_ABI, contractAddress);
        const tokenURI = await contract.methods.tokenURI(tokenId).call();

        // Fetch the actual metadata from the tokenURI 
        const metadataResponse = await fetch(tokenURI);
        const metadata = await metadataResponse.json();

        // Store metadata in MongoDB
        nft = new NFT({
            contractAddress,
            tokenId,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
        });

        await nft.save();

        res.json(nft);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving NFT metadata');
    }
});

module.exports = router;    