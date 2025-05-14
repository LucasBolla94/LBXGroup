export default function SwapFooterInfo() {
  return (
    <div className="mt-6 text-sm text-gray-400 space-y-1 text-center">
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <span>Slippage: <strong className="text-white">0%</strong></span>
        <span>Estimated Fee: <strong className="text-white">~0.00089 SOL</strong></span>
        <span>Exchange Rate: <strong className="text-white">0.01 SOL → 1000 LBXO</strong></span>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        By staking SOL, you mint LBXO based on a fixed exchange rate. All conversions are final.
      </p>
    </div>
  )
}
