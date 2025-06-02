'use client';

import { useState } from 'react';
import axios from 'axios';

export default function NFTMetadataPage() {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://blockchain-actionver.onrender.com/api/nft/metadata', {
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
      setError('Failed to fetch NFT metadata. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-none">
      {/* Header Section */}
      <div className="border-b border-gray-300 mb-6 pb-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          NFT Metadata Fetcher
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Retrieve metadata from Ethereum NFT contracts
        </p>
      </div>

      {/* Description Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-3">
          How It Works
        </h3>
        <p className="text-sm sm:text-base text-blue-800 leading-relaxed">
          This implementation uses a contract address to interact with an Ethereum smart contract. 
          The contract address is a unique identifier for the deployed smart contract on the Ethereum blockchain. 
          We fetch metadata for a specific NFT by calling the tokenURI method of the ERC721 contract through 
          Infura's Sepolia test network endpoint. The fetched metadata is then stored in a MongoDB database 
          for efficient retrieval in future requests.
        </p>
      </div>

      {/* Contract Details Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Contract Details
        </h3>
        
        <div className="space-y-4">
          {/* Contract Address */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-medium text-gray-700 text-sm sm:text-base min-w-fit">
              Contract Address:
            </span>
            <div className="flex items-center gap-2 flex-1">
              <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-mono break-all">
                0x218d821bB23Ca1269F0e1A9A5f35394c1714D960
              </code>
              <button
                onClick={() => copyToClipboard('0x218d821bB23Ca1269F0e1A9A5f35394c1714D960')}
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                title="Copy contract address"
              >
                📋
              </button>
            </div>
          </div>

          {/* Token ID */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-medium text-gray-700 text-sm sm:text-base min-w-fit">
              Token ID:
            </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-mono w-fit">
              1
            </code>
          </div>

          {/* Network */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-medium text-gray-700 text-sm sm:text-base min-w-fit">
              Network:
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm font-medium w-fit">
              Sepolia Testnet
            </span>
          </div>
        </div>

        {/* Fetch Button */}
        <div className="mt-6">
          <button
            onClick={fetchMetadata}
            disabled={loading}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
            } text-white shadow-sm hover:shadow-md`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fetching Metadata...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Fetch Metadata</span>
                <span>→</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg">⚠️</span>
            <p className="text-red-800 text-sm sm:text-base font-medium">
              Error
            </p>
          </div>
          <p className="text-red-700 text-sm sm:text-base mt-1">
            {error}
          </p>
        </div>
      )}

      {/* Metadata Display */}
      {metadata && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                NFT Metadata
              </h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(metadata, null, 2))}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 w-fit"
              >
                📋 Copy JSON
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {/* Metadata Summary Cards */}
            {metadata.name && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {metadata.name && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-600 font-medium text-sm">Name</p>
                    <p className="text-blue-900 font-semibold">{metadata.name}</p>
                  </div>
                )}
                {metadata.description && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-600 font-medium text-sm">Description</p>
                    <p className="text-green-900 font-semibold truncate" title={metadata.description}>
                      {metadata.description}
                    </p>
                  </div>
                )}
                {metadata.image && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="text-purple-600 font-medium text-sm">Image</p>
                    <p className="text-purple-900 font-semibold">Available</p>
                  </div>
                )}
              </div>
            )}

            {/* Image Display */}
            {metadata.image && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">NFT Image</h4>
                <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                  <img
                    src={metadata.image}
                    alt={metadata.name || 'NFT Image'}
                    className="max-w-full max-h-64 sm:max-h-80 object-contain rounded-lg shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Raw JSON Display */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Raw JSON Data</h4>
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <pre className="text-green-400 text-xs sm:text-sm p-4 overflow-x-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!metadata && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
            No Metadata Loaded
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Click "Fetch Metadata" to retrieve NFT information from the blockchain
          </p>
        </div>
      )}
    </div>
  );
}