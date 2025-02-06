"use client"
import Link from 'next/link';
import { useDisconnect } from 'wagmi';

export default function Dashboard() {
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <Link href="/fetch-nft-metadata">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Fetch NFT Metadata
          </button>
        </Link>
        <Link href="/transfer-token">
          <button className="bg-purple-500 text-white px-4 py-2 rounded">
            Transfer Token
          </button>
        </Link>
      </div>
      <button
        onClick={disconnect}
        className="bg-red-500 text-white px-4 py-2 rounded mt-8"
      >
        Logout
      </button>
    </div>
  );
}