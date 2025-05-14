'use client'

import { useExchangeRate } from '@/hooks/useExchangeRate'

type Props = {
  amount: string
}

export default function SwapOutput({ amount }: Props) {
  const exchangeRate = useExchangeRate()
  const parsed = parseFloat(amount)
  const lbxo = exchangeRate && !isNaN(parsed) ? parsed * exchangeRate : 0

  return (
    <div className="bg-white/5 rounded-lg p-4 shadow-sm border border-white/10">
      <div className="flex justify-between text-sm mb-2 text-gray-300">
        <span className="font-medium">To receive</span>
        <span className="text-xs">0% Price Impact</span>
      </div>

      <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
        <input
          readOnly
          value={lbxo.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          className="bg-transparent text-white text-lg w-full outline-none"
        />
        <span className="text-sm text-white ml-2">LBXO</span>
      </div>

      {!exchangeRate && (
        <div className="text-xs text-yellow-400 mt-2 text-center">Loading exchange rate from on-chain...</div>
      )}
    </div>
  )
}
