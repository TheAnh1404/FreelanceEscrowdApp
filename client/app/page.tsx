"use client";

import { useState, useEffect, useCallback } from "react";
import { Meteors } from "@/components/ui/meteors";
import Navbar from "@/components/Navbar";
import EscrowDashboard from "@/components/EscrowDashboard";
import {
  connectWallet,
  getWalletAddress,
  checkConnection,
} from "@/hooks/contract";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (await checkConnection()) {
          const addr = await getWalletAddress();
          if (addr) setWalletAddress(addr);
        }
      } catch {
        /* Freighter not installed */
      }
    })();
  }, []);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      setWalletAddress(await connectWallet());
    } catch {
      // handled in Contract component
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setWalletAddress(null);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#050510] overflow-hidden">
      {/* Meteors */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Meteors number={12} />
      </div>

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#7c6cf0]/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#4fc3f7]/15 blur-[120px] animate-float-delayed" />
      </div>

      {/* Navbar */}
      <Navbar
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
      />

      {/* Content */}
      <main className="relative z-10 flex flex-1 w-full flex-col items-center px-6 pt-10 pb-16">
        {/* Header Title */}
        <div className="mb-6 text-center animate-fade-in-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-sm text-white/60 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#34d399]" />
            </span>
            Stellar Smart Contract (Testnet)
          </div>

          <h1 className="mb-4">
            <span className="block text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              <span className="text-white drop-shadow-md">Freelance </span>
              <span className="bg-gradient-to-r from-accent via-accent-2 to-accent bg-[length:200%_auto] animate-gradient-shift bg-clip-text text-transparent drop-shadow-lg">
                Escrow
              </span>
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base sm:text-lg leading-relaxed text-white/50">
            Nền tảng thanh toán phi tập trung dành cho Freelancers. An tâm thực hiện công việc với Smart Contract.
          </p>
        </div>

        {/* Escrow Dashboard UI */}
        <EscrowDashboard walletAddress={walletAddress} />

        {/* Footer info */}
        <div className="mt-16 flex flex-col items-center gap-5 animate-fade-in text-center">
          <div className="flex items-center gap-5 text-[11px] text-white/20 font-mono uppercase tracking-widest bg-white/[0.02] px-6 py-3 rounded-2xl border border-white/[0.05]">
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent/50 text-white shadow-[0_0_10px_rgba(124,108,240,0.5)]"></div>Stellar Network</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-accent-2/50 text-white shadow-[0_0_10px_rgba(79,195,247,0.5)]"></div>Freighter Wallet</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-success/50 text-white shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>Soroban Smart Contracts</span>
          </div>
        </div>
      </main>
    </div>
  );
}
