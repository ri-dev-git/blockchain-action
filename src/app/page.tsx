"use client"; // Mark this file as a Client Component

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { isConnected, address } = useAccount(); // Check if the user is connected
  const chainId = useChainId(); // Get the current chain ID
  const { switchChain } = useSwitchChain(); // Use for switching networks
  const router = useRouter(); // For navigation

  useEffect(() => {
    if (isConnected && chainId === 11155111) {
      // Redirect to dashboard if connected and on Sepolia
      router.push("/dashboard/nft-metadata");
    }
  }, [isConnected, chainId, router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9fafb", // Light background color
        padding: "20px",
      }}
    >
      <h1 className="text-4xl font-bold mb-4">Welcome to Blockchain Actions</h1>

      {!isConnected ? (
        <div>
          <p className="mb-4">Please connect your wallet to continue.</p>
          <ConnectButton />
        </div>
      ) : chainId !== 11155111 ? (
        <div>
          <p className="mb-4">
            You are not on the Sepolia testnet. Please switch to Sepolia.
          </p>
          <button
            onClick={() => switchChain({ chainId: 11155111 })} // Switch to Sepolia
            className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition-colors"
          >
            Switch to Sepolia
          </button>
        </div>
      ) : (
        <p>Redirecting to dashboard...</p>
      )}
    </div>
  );
}