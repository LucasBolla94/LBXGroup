import { useWalletUi } from '@wallet-ui/react'
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import idl from '../idl/mint_lbx.json'

// Verificação de segurança: certifique-se de que `idl.address` existe
const programID = new PublicKey((idl as any).address)

export const useWorkspace = () => {
  const { wallet, client } = useWalletUi()

  if (!wallet || !client) {
    return {
      wallet: null,
      connection: null,
      provider: null,
      program: null,
    }
  }

  // Cria o provider do Anchor (conexão + carteira + config)
  const provider = new AnchorProvider(client, wallet, { commitment: 'processed' })

  // Inicializa o programa Anchor usando IDL, ID e provider
  const program = new Program(idl as Idl, programID, provider)

  return {
    wallet,
    connection: client,
    provider,
    program,
  }
}
