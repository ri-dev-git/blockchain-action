'use client';

import { useState } from 'react';
import axios from 'axios';

export default function NFTMetadataPage() {
  const [metadata, setMetadata] = useState<any>(null);

  const fetchMetadata = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/nft/metadata', {
        contractAddress: '0x218d821bB23Ca1269F0e1A9A5f35394c1714D960',
        tokenId: '1',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMetadata(response.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between border-b mb-8 pb-4 border-black">
        <h2 className="text-2xl font-bold">NFT Metadata</h2>
      </div>
      <p className="mt-4 text-gray-700">
        In this backend implementation, we use a contract address (listed below) to interact with an Ethereum smart contract. The contract address is a unique identifier for the deployed smart contract on the Ethereum blockchain. In this case, the contract address is used to fetch metadata for a specific NFT (Non-Fungible Token) by calling the tokenURI method of the ERC721 contract. To facilitate interaction with the Ethereum blockchain, we use Infura, a service that provides access to Ethereum nodes. By connecting to Infura's Sepolia test network endpoint, we can send requests to the Ethereum blockchain without running our own node. The fetched metadata is then stored in a MongoDB database for efficient retrieval in future requests.
      </p>
      <br />
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Contract Address:</span>
          <span>0x218d821bB23Ca1269F0e1A9A5f35394c1714D960</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium">Token URI:</span>
          <span>1</span>
        </div>
        <button onClick={fetchMetadata} className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600">
          Get -&gt;
        </button>
      </div>

      <div className="border border-indigo-600">
        {metadata && (
          <div className="mt-8">
            <h3 className="text-xl font-bold">Metadata:</h3>
            <pre className="bg-gray-200 p-4 rounded">{JSON.stringify(metadata, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}