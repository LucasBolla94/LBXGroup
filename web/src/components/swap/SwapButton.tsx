'use client'

import { useState } from 'react'
import { FaArrowCircleRight } from 'react-icons/fa'
import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'
import { BN } from '@project-serum/anchor'
import { useWorkspace } from '@/hooks/useWorkspace'

export default function SwapButton() {
  const [loading, setLoading] = useState(false)
  const { program, wallet, connection } = useWorkspace()

  const handleSwap = async () => {
    if (!program || !wallet?.connected || !wallet.publicKey) {
      alert('Wallet not connected or program not ready')
      return
    }

    try {
      setLoading(true)

      // ⚠️ Substitua pelos valores reais do seu projeto
      const CONFIG_PUBKEY = new PublicKey('CONFIG_ACCOUNT_PUBLIC_KEY_AQUI')
      const MINT_PUBKEY = new PublicKey('MINT_PUBLIC_KEY_AQUI')
      const MINT_AUTHORITY_PUBKEY = new PublicKey('MINT_AUTHORITY_PUBKEY_AQUI')
      const TOKEN_PROGRAM_ID = new PublicKey(
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
      )
      const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
      )

      // Derivar o endereço da ATA do usuário para o token LBXO
      const userTokenAccount = await getAssociatedTokenAddress(
        MINT_PUBKEY,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )

      const transaction = new Transaction()

      // Verificar se a ATA já existe
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

      // Quantidade de SOL a ser convertida
      const amountInSol = 0.01
      const amountLamports = new BN(amountInSol * 1_000_000_000) // 0.01 SOL

      // Instrução do Anchor para depositar SOL e mintar tokens
      const ix = await program.methods
        .depositSolAndMint(amountLamports)
        .accounts({
          user: wallet.publicKey,
          config: CONFIG_PUBKEY,
          mintAuthority: MINT_AUTHORITY_PUBKEY,
          mint: MINT_PUBKEY,
          userTokenAccount: userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .instruction()

      transaction.add(ix)

      // Enviar a transação assinada
      const txSignature = await wallet.sendTransaction(transaction, connection)
      await connection.confirmTransaction(txSignature, 'processed')

      alert('LBXO minted with success ✅')
    } catch (err) {
      console.error(err)
      alert('Transaction failed ❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSwap}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-md shadow disabled:opacity-60 disabled:cursor-not-allowed transition-all"
    >
      {loading ? 'Converting...' : 'Convert to LBXO'}
      <FaArrowCircleRight className="text-lg" />
    </button>
  )
}
