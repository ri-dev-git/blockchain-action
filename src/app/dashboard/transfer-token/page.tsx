'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TransferTokenPage() {
  const [fromAddress] = useState('0x36E2dA3F27Eeb2a3f3B892BbaB63A9833459A9eE');
  const [toAddress, setToAddress] = useState('');
  const [tokenAmount] = useState('0.1');
  const [tokenAddress] = useState('0x7f4211C8870568d6e1D12A30C1b53863Ff888dbd');
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEthereumAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openEtherscan = (hash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
  };

  const handleSubmit = async () => {
    // Clear previous states
    setError('');
    setTransactionHash('');

    // Validation
    if (!toAddress.trim()) {
      setError('Recipient address is required.');
      return;
    }

    if (!isValidEthereumAddress(fromAddress) || !isValidEthereumAddress(toAddress)) {
      setError('Invalid Ethereum address format. Please check the addresses.');
      return;
    }

    if (fromAddress.toLowerCase() === toAddress.toLowerCase()) {
      setError('Sender and recipient addresses cannot be the same.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://blockchain-actionver.onrender.com/api/transfer-tokens/transfer', {
        from: fromAddress,
        to: toAddress,
        amount: tokenAmount,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTransactionHash(response.data.transactionHash);
    } catch (error: any) {
      console.error('Error transferring token:', error);
      const errorMessage = error.response?.data?.message || 'Transaction failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setToAddress('');
    setError('');
    setTransactionHash('');
  };

  return (
    <div className="w-full max-w-none">
      {/* Header Section */}
      <div className="border-b border-gray-300 mb-6 pb-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Token Transfer
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Transfer SMTK tokens between Ethereum addresses
        </p>
      </div>

      {/* Instructions Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-3">
          How Token Transfer Works
        </h3>
        <div className="text-sm sm:text-base text-blue-800 space-y-2">
          <p className="leading-relaxed">
            Use the form below to transfer tokens between Ethereum addresses. Ensure that the addresses are valid and the amount is positive.
          </p>
          <div className="mt-4">
            <p className="font-medium mb-2">Upon submission, the application will:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Validate the Ethereum addresses and token amount</li>
              <li>Send a request to the backend server to process the transfer</li>
              <li>Create and sign the transaction, then send it to the Ethereum network</li>
              <li>Display the transaction hash once confirmed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
          Transfer Details
        </h3>

        <div className="space-y-6">
          {/* Token Contract Address */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium text-gray-700 text-sm sm:text-base">
                  Token Contract Address:
                </p>
                <code className="text-xs sm:text-sm text-gray-600 font-mono break-all">
                  {tokenAddress}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(tokenAddress)}
                className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0 w-fit"
                title="Copy token address"
              >
                📋
              </button>
            </div>
          </div>

          {/* From Address */}
          <div>
            <label className="block font-medium text-gray-700 text-sm sm:text-base mb-2">
              From Address (Sender):
            </label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <code className="text-xs sm:text-sm font-mono break-all flex-1 text-gray-700">
                {fromAddress}
              </code>
              <button
                onClick={() => copyToClipboard(fromAddress)}
                className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                title="Copy sender address"
              >
                📋
              </button>
            </div>
          </div>

          {/* To Address */}
          <div>
            <label className="block font-medium text-gray-700 text-sm sm:text-base mb-2">
              To Address (Recipient):
            </label>
            <div className="relative">
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="Enter recipient address (0x...)"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {toAddress && (
                <button
                  onClick={() => setToAddress('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear address"
                >
                  ✕
                </button>
              )}
            </div>
            {toAddress && !isValidEthereumAddress(toAddress) && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                Invalid Ethereum address format
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block font-medium text-gray-700 text-sm sm:text-base mb-2">
              Amount:
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  {tokenAmount} SMTK
                </span>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Fixed Amount
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={handleSubmit}
            disabled={loading || !toAddress || !isValidEthereumAddress(toAddress)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
              loading || !toAddress || !isValidEthereumAddress(toAddress)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-sm hover:shadow-md'
            } text-white`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Transfer...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Transfer Tokens</span>
                <span>→</span>
              </span>
            )}
          </button>
          
          <button
            onClick={handleClearForm}
            className="px-6 py-3 rounded-lg font-medium text-sm sm:text-base border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-red-800 text-sm sm:text-base font-medium">
                Transaction Error
              </p>
              <p className="text-red-700 text-sm sm:text-base mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {transactionHash && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-2 mb-4">
            <span className="text-green-500 text-lg flex-shrink-0">✅</span>
            <div>
              <p className="text-green-800 text-sm sm:text-base font-medium">
                Transaction Successful!
              </p>
              <p className="text-green-700 text-sm sm:text-base mt-1">
                Your token transfer has been processed successfully.
              </p>
            </div>
          </div>
          
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-gray-700 text-sm mb-1">
                  Transaction Hash:
                </p>
                <code className="text-xs sm:text-sm font-mono break-all text-gray-900">
                  {transactionHash}
                </code>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => copyToClipboard(transactionHash)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => openEtherscan(transactionHash)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  🔍 View on Etherscan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700 text-sm sm:text-base">
              Network: <span className="text-green-600">Sepolia Testnet</span>
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              All transactions are processed on the Ethereum Sepolia test network
            </p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}