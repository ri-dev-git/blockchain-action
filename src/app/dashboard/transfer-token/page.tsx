"use client"; // Mark this file as a Client Component

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { pathname } = router;

  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');

  return (
    <div className="flex-col h-screen w-screen bg-gray-100 border-solid border-purple-500 border-4">
      {/* Top Bar */}
      <div className="flex w-full md:max-w items-center border-solid border-purple-500 border-4">
        <div className="border-b border-black flex h-24 w-full md:max-w items-center">
          <div className="flex w-full justify-between pl-4 pr-4 items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <span className="text-sm">address: {isConnected ? address : 'Not Connected'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[86%] w-full">
        {/* Sidebar Navigation */}
        <div className="w-1/4 bg-gray-100 flex flex-col border-solid border-purple-500 border-4">
          <nav className="flex flex-col mt-4">
            <Link href="/dashboard/nft-metadata" className={`p-4 text-lg font-medium hover:bg-purple-200 ${pathname === '/dashboard/nft-metadata' ? 'bg-purple-500 text-white' : 'text-black'}`}>
              NFT Metadata
            </Link>
            <Link href="/dashboard/transfer-token" className={`p-4 text-lg font-medium hover:bg-purple-200 ${pathname === '/dashboard/transfer-token' ? 'bg-purple-500 text-white' : 'text-black'}`}>
              Transfer Token
            </Link>
          </nav>

          <button className="p-4 text-lg font-medium bg-red-500 text-white mt-auto hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 border-solid border-purple-500 border-4">
          <h2 className="text-2xl font-bold">Transfer Token</h2>

          <div className="space-y-4 mt-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">From:</span>
              <input
                type="text"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="Enter sender address"
                className="border p-2 w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium">To:</span>
              <input
                type="text"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="Enter recipient address"
                className="border p-2 w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium">Amount:</span>
              <input
                type="text"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                placeholder="Enter token amount"
                className="border p-2 w-full"
              />
            </div>

            <button className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600">Get -&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
