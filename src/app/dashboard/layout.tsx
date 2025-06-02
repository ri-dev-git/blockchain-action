'use client';

import { useAccount, useDisconnect } from 'wagmi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();
  const router = useRouter();
  const [connectedAddress, setConnectedAddress] = useState(address);
  const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    setConnectedAddress(address);
  }, [address]);

  // Check screen size and categorize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }

      // Close tablet menu when switching to desktop or mobile
      if (width < 640 || width >= 1024) {
        setIsTabletMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close tablet menu when route changes
  useEffect(() => {
    setIsTabletMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when tablet menu is open
  useEffect(() => {
    if (isTabletMenuOpen && screenSize === 'tablet') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTabletMenuOpen, screenSize]);

  const handleLogout = () => {
    disconnect();
    router.push('/');
  };

  const toggleTabletMenu = () => {
    setIsTabletMenuOpen(!isTabletMenuOpen);
  };

  const navigationItems = [
    { href: '/dashboard/nft-metadata', label: 'NFT Metadata', icon: '🎨' },
    { href: '/dashboard/transfer-token', label: 'Transfer Token', icon: '🔄' }
  ];

  // Truncate address for display
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected';
  const fullDisplayAddress = address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Not Connected';

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* Top Bar */}
      <div className="w-full h-16 lg:h-20 border-b border-black px-4 lg:pr-10 flex items-center justify-between bg-white relative z-50">
        <div className="flex items-center gap-3">
          {/* Tablet Menu Toggle Button */}
          {screenSize === 'tablet' && (
            <button
              onClick={toggleTabletMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors sm:block md:block lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isTabletMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                  }`}
                ></span>
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                    isTabletMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                    isTabletMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                  }`}
                ></span>
              </div>
            </button>
          )}

          <h1 className="text-lg sm:text-xl lg:text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <span className="text-xs sm:text-sm lg:text-base text-gray-600">
            <span className="hidden sm:inline">Connected: </span>
            <span className="font-mono">
              {screenSize === 'mobile' ? displayAddress : fullDisplayAddress}
            </span>
          </span>
        </div>
      </div>

      {/* Mobile Horizontal Navigation (below navbar on mobile screens only) */}
      {screenSize === 'mobile' && (
        <nav className="w-full bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  pathname === item.href
                    ? 'bg-purple-500 text-white'
                    : 'hover:bg-gray-100 text-black'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-red-500 text-white hover:bg-red-600 transition-colors ml-2"
            >
              {/* <span className="mr-2">🚪</span> */}
              Disconnect Wallet
            </button>
          </div>
        </nav>
      )}

      {/* Tablet Menu Overlay */}
      {isTabletMenuOpen && screenSize === 'tablet' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleTabletMenu}
        />
      )}

      {/* Body with Sidebar and Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar (visible only on desktop) */}
        {screenSize === 'desktop' && (
          <aside className="w-1/4 h-full bg-gray-100 border-r border-black flex flex-col">
            <nav className="flex flex-col mt-4 flex-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center p-4 text-lg font-medium hover:bg-purple-200 transition-colors ${
                    pathname === item.href ? 'bg-purple-500 text-white' : 'text-black'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <button
              className="p-4 text-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={handleLogout}
            >
                            {/* <span className="mr-2">🚪</span> */}
              Disconnect Wallet
            </button>
          </aside>
        )}

        {/* Tablet Toggle Sidebar */}
        {screenSize === 'tablet' && (
          <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 max-w-[70vw] bg-white z-40 transform transition-transform duration-300 ease-in-out shadow-xl border-r border-gray-200 ${
              isTabletMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <nav className="flex flex-col p-6 h-full">
              <div className="space-y-3 flex-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium hover:bg-purple-100 transition-colors ${
                      pathname === item.href ? 'bg-purple-500 text-white' : 'text-black'
                    }`}
                    onClick={() => setIsTabletMenuOpen(false)}
                  >
                    <span className="mr-3 text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Logout button in tablet sidebar */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  onClick={() => {
                    setIsTabletMenuOpen(false);
                    handleLogout();
                  }}
                >
                  {/* <span className="mr-3 text-xl">🚪</span> */}
                  Disconnect wallet
                </button>
                
                {/* Tablet menu footer */}
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600">
                    Dashboard
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Tablet View
                  </div>
                </div>
              </div>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex flex-col h-full bg-gray-50 overflow-hidden ${
          screenSize === 'desktop' ? 'w-3/4' : 'w-full'
        }`}>
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Custom scrollbar hiding styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}