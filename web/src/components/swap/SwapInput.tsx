'use client'

import { FaCoins } from 'react-icons/fa'

type Props = {
  amount: string
  setAmount: (val: string) => void
}

export default function SwapInput({ amount, setAmount }: Props) {
  const userSolBalance = 0.0025885

  return (
    <div className="bg-white/5 rounded-lg p-4 shadow-sm border border-white/10">
      <div className="flex justify-between text-sm mb-2 text-gray-300">
        <span className="font-medium">You're staking</span>
        <span className="flex items-center gap-1">
          {userSolBalance.toFixed(8)} SOL
          <button
            onClick={() => setAmount(userSolBalance.toString())}
            className="ml-1 text-purple-400 text-xs hover:underline"
          >
            Use Max
          </button>
        </span>
      </div>

      <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
        <FaCoins className="text-yellow-400 text-lg mr-2" />
        <input
          type="number"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-transparent text-white text-lg w-full outline-none"
        />
      </div>

      <div className="mt-2 text-right text-xs text-gray-400 italic">Convert your other assets ↓</div>
    </div>
  )
}
