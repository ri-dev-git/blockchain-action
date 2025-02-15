'use client';

import { useAccount, useDisconnect } from 'wagmi';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();
  const router = useRouter();
  const [connectedAddress, setConnectedAddress] = useState(address);


  useEffect(() => {
    setConnectedAddress(address);
  }, [address]);


  const handleLogout = () => {
    disconnect();
    router.push('/');
  };
  return (
    <div className="flex-col h-screen w-screen bg-gray-100">
      {/* Top Bar */}
      <div className="flex w-full md:max-w items-center">
        <div className="border-b border-black flex h-24 w-full md:max-w items-center">
          <div className="flex w-full justify-between pl-4 pr-4 items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <span className="text-sm">connected address: {isConnected ? address : 'Not Connected'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[87.08%] w-full">
        <div className="w-1/4 h-[100%] bg-gray-100 flex border-r-black flex-col">
          <nav className="flex flex-col mt-4">
            <Link 
              className={`p-4 text-lg text-black font-medium hover:bg-purple-200 ${
                pathname === '/dashboard/nft-metadata' ? 'bg-purple-500 text-white' : 'text-black'
              }`}
              href="/dashboard/nft-metadata">
              NFT Metadata
            </Link>
            <Link 
              className={`p-4 text-lg font-medium hover:bg-purple-200 ${
                pathname === '/dashboard/transfer-token' ? 'bg-purple-500 text-white' : 'text-black'
              }`}
              href="/dashboard/transfer-token">
              Transfer Token
            </Link>
          </nav>

          <button 
            className="p-4 text-lg font-medium bg-red-500 text-white mt-auto hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 border-solid border-purple-500 border-1 h-80% p-8 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}