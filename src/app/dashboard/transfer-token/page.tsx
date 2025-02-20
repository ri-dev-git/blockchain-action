'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TransferTokenPage() {
  const [fromAddress] = useState('0x36E2dA3F27Eeb2a3f3B892BbaB63A9833459A9eE');
  const [toAddress, setToAddress] = useState('');
  const [tokenAmount] = useState('0.1');
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const isValidEthereumAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const handleSubmit = async () => {
    if (!isValidEthereumAddress(fromAddress) || !isValidEthereumAddress(toAddress)) {
      setError('Invalid Ethereum address. Please check the addresses.');
      return;
    }

    if (fromAddress === toAddress) {
      setError('Sender and recipient addresses cannot be the same.');
      return;
    }

    setError('');
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
    } catch (error) {
      console.error('Error transferring token:', error);
      setError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-bold">Transfer Token</h2>

      <p className="mt-4 text-gray-700">
        Use the form below to transfer tokens between Ethereum addresses. Ensure that the addresses are valid and the amount is a positive number.
        Token Address:0x7f4211C8870568d6e1D12A30C1b53863Ff888dbd
        <br /><br />
        Upon submission, the application will:
        <br />
        - Validate the Ethereum addresses and the token amount.
        <br />
        - Send a request to the backend server to process the token transfer.
        <br />
        - The backend server will create and sign the transaction, then send it to the Ethereum network.
        <br />
        - Once the transaction is confirmed, the transaction hash will be displayed on the screen.
      </p>

      <div className="space-y-4 mt-4">
        {error && <div className="text-red-500">{error}</div>}
        {transactionHash && <div className="text-green-500">Transaction successful! Hash: {transactionHash}</div>}

        <div className="flex flex-col">
          <span className="font-medium mb-1">From:</span>
          <span>0x36E2dA3F27Eeb2a3f3B892BbaB63A9833459A9eE</span>
        </div>

        <div className="flex flex-col">
          <span className="font-medium mb-1">To:</span>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter recipient address"
            className="border p-2 w-full"
          />
        </div>

        <div className="flex flex-col">
          <span className="font-medium mb-1">Amount:</span>
          <span>0.1 SMTK</span>
        </div>

        <div className="flex justify-center">
          {loading ? <button
            className={"bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed Pointer-events-none"}
          >
            Transferring...
          </button>
          :  <button
            className={"mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"}
            onClick={handleSubmit}
          >
            Submit
          </button>}
          
        </div>
      </div>
    </div>
  );
}