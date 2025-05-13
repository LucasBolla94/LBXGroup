import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MintLbx } from "../target/types/mint_lbx";  // Atualize esse caminho conforme necessário
import { PublicKey } from "@solana/web3.js";

async function fetchDetails() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.mintLbx as Program<MintLbx>;
  const wallet = provider.wallet;

  // Derivando os PDAs
  const [configPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  );

  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    program.programId
  );

  const [mintAuthorityPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint_authority")],
    program.programId
  );

  // Pegando o valor do Exchange Rate da conta de configuração
  const configAccount = await program.account.config.fetch(configPda);

  // Exibindo as informações
  console.log("Exchange Rate:", configAccount.exchangeRate.toString());
  console.log("Vault Address:", vaultPda.toString());
  console.log("Mint Authority:", mintAuthorityPda.toString());
}

fetchDetails().catch((err) => {
  console.error("Erro ao buscar detalhes:", err);
});
