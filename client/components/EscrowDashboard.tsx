"use client";

import { useState } from "react";
import { Copy, CheckCircle2, ArrowRight, ShieldCheck, Wallet, Activity } from "lucide-react";

interface EscrowDashboardProps {
  walletAddress: string | null;
}

export default function EscrowDashboard({ walletAddress }: EscrowDashboardProps) {
  const [depositAmount, setDepositAmount] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [status, setStatus] = useState<"pending" | "deposited" | "released">("pending");
  const [txHash, setTxHash] = useState<string | null>(null);

  const mockClientAddress = walletAddress || "Không có thẻ kết nối";
  const mockFreelancerAddress = "GBB47X...3F9VK3E";
  const mockContractAddress = "CCTZ98...M4H9V4W";

  const handleDeposit = () => {
    if (!walletAddress) {
      alert("Vui lòng kết nối ví trước!");
      return;
    }
    if (!depositAmount || Number(depositAmount) <= 0) return;
    setTxHash("Đang tạo giao dịch nạp tiền...");
    setTimeout(() => {
      setStatus("deposited");
      setTxHash(`0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}...`);
      setDepositAmount("");
    }, 1500);
  };

  const handleRelease = () => {
    setTxHash("Đang xử lý giải ngân cho Freelancer...");
    setTimeout(() => {
      setStatus("released");
      setTxHash(`0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}...`);
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up mt-8">
      {/* Status Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <AddressCard 
          title="Khách Hàng (Client)" 
          address={mockClientAddress} 
          role="Người gửi" 
          icon={<Wallet className="w-5 h-5 text-accent-2" />} 
          isActive={!!walletAddress}
        />
        <AddressCard 
          title="Smart Contract" 
          address={mockContractAddress} 
          role="Escrow" 
          icon={<ShieldCheck className="w-5 h-5 text-accent" />} 
          isActive={true}
        />
        <AddressCard 
          title="Freelancer" 
          address={mockFreelancerAddress} 
          role="Người nhận" 
          icon={<Activity className="w-5 h-5 text-success" />} 
          isActive={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposit Section */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c1d]/60 backdrop-blur-xl p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-2 opacity-80"></div>
          
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent text-sm">1</span>
            Nạp Tiền (Deposit)
          </h2>
          <p className="text-sm text-white/50 mb-8 leading-relaxed">
            Khách hàng khóa quỹ vào Smart Contract. Tiền sẽ được giữ an toàn cho đến khi xác nhận hoàn thành công việc.
          </p>
          
          <div className="space-y-6">
            <div>
              <label className="text-xs text-white/50 mb-3 block font-mono uppercase tracking-wider">Số lượng</label>
              <div className="relative group">
                <input 
                  type="number" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#050510] border border-white/[0.1] hover:border-white/[0.2] rounded-xl px-5 py-4 text-white text-lg placeholder-white/20 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  disabled={status !== "pending" || !walletAddress}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div className="h-6 w-px bg-white/10"></div>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-transparent text-white font-medium focus:outline-none appearance-none cursor-pointer pl-1 pr-4 py-2"
                    disabled={status !== "pending" || !walletAddress}
                  >
                    <option value="USDC" className="bg-[#0c0c1d]">USDC</option>
                    <option value="XLM" className="bg-[#0c0c1d]">XLM</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleDeposit}
              disabled={status !== "pending" || !depositAmount || !walletAddress}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-2 py-4 font-semibold text-white shadow-[0_0_20px_rgba(124,108,240,0.3)] transition-all hover:shadow-[0_0_30px_rgba(124,108,240,0.4)] hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Nạp Quỹ Vào Hợp Đồng <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Release Section */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c1d]/60 backdrop-blur-xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${status === 'released' ? 'bg-success' : status === 'deposited' ? 'bg-warning' : 'bg-white/10'}`}></div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition-colors ${status === 'pending' ? 'bg-white/10 text-white/50' : 'bg-success/20 text-success'}`}>2</span>
              Giải Ngân (Release)
            </h2>
            <p className="text-sm text-white/50 mb-6 leading-relaxed">
              Sau khi Freelancer hoàn thành cột mốc công việc đã thỏa thuận, nhấn vào đây để báo hợp đồng tự động chuyển tiền cho họ.
            </p>
            
            <div className="mt-8 rounded-xl bg-black/40 border border-white/[0.05] p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/40">Trạng thái hợp đồng</span>
                <span className={`text-xs font-mono px-2 py-1 rounded bg-white/5 uppercase tracking-wider ${status === 'pending' ? 'text-white/40' : status === 'deposited' ? 'text-warning' : 'text-success'}`}>
                  {status === 'pending' ? "Chưa có quỹ" : status === 'deposited' ? "Đã khóa quỹ" : "Đã hoàn tất"}
                </span>
              </div>
              <div className="h-2 w-full bg-[#050510] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${status === 'pending' ? 'w-0' : status === 'deposited' ? 'w-1/2 bg-warning' : 'w-full bg-success'}`}
                ></div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleRelease}
            disabled={status !== "deposited"}
            className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-success/10 py-4 font-semibold text-success transition-all hover:bg-success/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/30"
          >
            {status === "released" ? (
              <><CheckCircle2 className="w-5 h-5" /> Tiền Đã Được Chuyển</>
            ) : "Xác Nhận & Giải Ngân"}
          </button>
        </div>
      </div>

      {/* Transaction Result Area */}
      {txHash && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c1d]/80 backdrop-blur-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10 w-full">
            <div className={`flex shrink-0 h-12 w-12 items-center justify-center rounded-full shadow-lg ${txHash.startsWith("0x") ? "bg-success/20 text-success border border-success/30" : "bg-warning/20 text-warning animate-pulse border border-warning/30"}`}>
              {txHash.startsWith("0x") ? <CheckCircle2 className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/40 font-mono uppercase tracking-wider mb-1 flex items-center gap-2">
                <span>Transaction Hash</span>
                {txHash.startsWith("0x") ? (
                  <span className="text-success text-[10px] bg-success/10 px-1.5 py-0.5 rounded border border-success/20">Thành công</span>
                ) : (
                  <span className="text-warning text-[10px] bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20">Đang xử lý...</span>
                )}
              </p>
              <p className="text-sm font-mono text-white/80 truncate w-full">{txHash}</p>
            </div>
          </div>
          
          {txHash.startsWith("0x") && (
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="shrink-0 text-xs font-medium text-accent hover:text-accent-2 transition-colors flex items-center gap-1.5 bg-accent/10 hover:bg-accent/20 px-4 py-2 rounded-lg"
            >
              View Explorer <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function AddressCard({ title, address, role, icon, isActive }: { title: string, address: string, role: string, icon: React.ReactNode, isActive: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (address.includes("Không có")) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border ${isActive ? 'border-white/[0.08] bg-[#0c0c1d]/60' : 'border-white/[0.03] bg-white/[0.01] opacity-60'} backdrop-blur-md p-5 flex flex-col gap-4 group hover:border-white/[0.15] transition-all shadow-lg hover:shadow-xl`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-2.5 items-center text-sm font-semibold text-white/90">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            {icon}
          </div>
          {title}
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider bg-white/5 border border-white/[0.05] px-2 py-1.5 rounded text-white/50">{role}</span>
      </div>
      <div className={`flex items-center justify-between ${isActive ? 'bg-[#050510]' : 'bg-transparent'} rounded-lg p-3 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors`}>
        <span className="font-mono text-xs text-white/70 truncate mr-3">{address}</span>
        <button 
          onClick={handleCopy} 
          disabled={!isActive}
          className="shrink-0 text-white/30 hover:text-white/90 transition-colors disabled:opacity-30 flex items-center justify-center p-1.5 rounded-md hover:bg-white/10"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
