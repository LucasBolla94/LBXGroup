'use client'

import { useState } from 'react'
import { FaCoins, FaArrowCircleRight } from 'react-icons/fa'
import { useExchangeRate } from '@/hooks/useExchangeRate'
import { useWorkspace } from '@/hooks/useWorkspace'
import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'
import { BN } from '@coral-xyz/anchor'

export default function SwapForm() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const exchangeRate = useExchangeRate()
  const { program, wallet, connection } = useWorkspace()
  const userSolBalance = 0.0025885

  const parsed = parseFloat(amount)
  const lbxo = exchangeRate && !isNaN(parsed) ? parsed * exchangeRate : 0

  const handleSwap = async () => {
    if (!program || !wallet?.connected || !wallet.publicKey) {
      alert('Wallet not connected or program not ready')
      return
    }

    try {
      setLoading(true)

      const amountInSol = parseFloat(amount)
      if (isNaN(amountInSol) || amountInSol <= 0) {
        alert('Invalid amount')
        return
      }

      // ⚠️ Substitua pelos valores reais
      const CONFIG_PUBKEY = new PublicKey('CONFIG_ACCOUNT_PUBLIC_KEY_AQUI')
      const MINT_PUBKEY = new PublicKey('MINT_PUBLIC_KEY_AQUI')
      const MINT_AUTHORITY_PUBKEY = new PublicKey('MINT_AUTHORITY_PUBKEY_AQUI')
      const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

      const userTokenAccount = await getAssociatedTokenAddress(
        MINT_PUBKEY,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )

      const transaction = new Transaction()
      const accountInfo = await connection.getAccountInfo(userTokenAccount)
      if (!accountInfo) {
        const createATAIx = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          userTokenAccount,
          wallet.publicKey,
          MINT_PUBKEY,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
        transaction.add(createATAIx)
      }

      const amountLamports = new BN(amountInSol * 1_000_000_000)

      const ix = await program.methods
        .depositSolAndMint(amountLamports)
        .accounts({
          user: wallet.publicKey,
          config: CONFIG_PUBKEY,
          mintAuthority: MINT_AUTHORITY_PUBKEY,
          mint: MINT_PUBKEY,
          userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction()

      transaction.add(ix)

      const tx = await wallet.sendTransaction(transaction, connection)
      await connection.confirmTransaction(tx, 'processed')

      alert('✅ Swap successful! LBXO minted.')
    } catch (err) {
      console.error(err)
      alert('❌ Swap failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      {/* INPUT */}
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

        <div className="mt-2 text-right text-xs text-gray-400 italic">
          Convert your other assets ↓
        </div>
      </div>

      {/* OUTPUT */}
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
          <div className="text-xs text-yellow-400 mt-2 text-center">
            Loading exchange rate from on-chain...
          </div>
        )}
      </div>

      {/* BOTÃO */}
      <button
        onClick={handleSwap}
        disabled={loading || !amount}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md shadow disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {loading ? 'Converting...' : 'Convert to LBXO'}
        <FaArrowCircleRight className="text-lg" />
      </button>
    </div>
  )
}
