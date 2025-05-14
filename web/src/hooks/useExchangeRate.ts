import { useEffect, useState } from 'react'

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(null)

  useEffect(() => {
    // Simula fetch on-chain (ajuste para leitura do contrato depois)
    const fakeRate = 1000 // 1 SOL = 1000 LBXO
    setTimeout(() => setRate(fakeRate), 500)
  }, [])

  return rate
}
