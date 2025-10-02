"use client";
import { WalletButton } from "@vechain/dapp-kit-react";

export default function AppHeader() {
  return (
    <div className="mx-4 md:mx-0">
      <div className="bg-slate-50 border border-e-2 border-slate-200 rounded-2xl max-w-3xl mx-auto mt-4 px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <span className="text-xl font-medium text-black">Digivalley</span>
        </div>

        <nav className="flex items-center gap-3">
          <div className="flex gap-2 items-center flex-wrap">
            <WalletButton />
          </div>
        </nav>
      </div>
    </div>
  );
}
