'use client'

import { useState } from 'react'

export default function SwapMethod() {
  const [selected, setSelected] = useState<'mint' | 'jupiter'>('mint')

  return (
    <div className="flex flex-col md:flex-row gap-2 mt-2">
      <button
        onClick={() => setSelected('mint')}
        className={`flex-1 rounded-md px-4 py-3 text-sm font-medium border transition-all ${
          selected === 'mint'
            ? 'bg-purple-600 text-white border-purple-500'
            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
        }`}
      >
        Direct Mint
        <div className="text-xs font-normal text-gray-300">Mint LBXO via Stake Contract</div>
      </button>

      <button
        disabled
        onClick={() => setSelected('jupiter')}
        className={`flex-1 rounded-md px-4 py-3 text-sm font-medium border cursor-not-allowed ${
          selected === 'jupiter'
            ? 'bg-purple-600 text-white border-purple-500'
            : 'bg-white/5 text-gray-400 border-white/10'
        }`}
      >
        Via Jupiter
        <div className="text-xs font-normal text-gray-400">Swap SOL for LBXO via Jupiter</div>
      </button>
    </div>
  )
}
