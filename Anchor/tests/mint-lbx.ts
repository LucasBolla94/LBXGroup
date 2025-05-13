import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MintLbx } from "../target/types/mint_lbx";
import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";

describe("mint-lbx", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.mintLbx as Program<MintLbx>;
  const wallet = provider.wallet;

  // Deriva as contas usando as seeds
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

  const mint = new PublicKey("7BQgRYaEqUACAv8BXgRvfzjyc8a7Epj1aTSB7GYvrYWE");
  const userTokenAccount = new PublicKey("5JPQHfBoLDXu3fHaKXeinhKFtbT4zJRMwyRrXexXHQwU");

  it("Initialize config", async () => {
    const configAccount = await provider.connection.getAccountInfo(configPda);

    if (configAccount !== null) {
      console.log("⚠️  Config já está inicializado, pulando...");
      return;
    }

    const tx = await program.methods
      .initializeConfig(new anchor.BN(10))
      .accounts({
        config: configPda,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Config initialized. Tx Signature:", tx);

    // Exibindo o mint authority após a inicialização
    console.log("Mint Authority correto para colocar no token é: ", mintAuthorityPda.toString());
  });

  it("Update exchange rate", async () => {
    const tx = await program.methods
      .updateExchangeRate(new anchor.BN(20))
      .accounts({
        config: configPda,
        authority: wallet.publicKey,
      })
      .rpc();

    console.log("✅ Exchange rate updated. Tx Signature:", tx);
  });

  it("Deposit SOL and mint LBX", async () => {
    const amount = 3 * LAMPORTS_PER_SOL; // meio SOL para teste

    console.log("💡 Usando o mint authority: ", mintAuthorityPda.toString());

    const tx = await program.methods
      .depositSolAndMint(new anchor.BN(amount))
      .accounts({
        user: wallet.publicKey,
        vault: vaultPda,
        config: configPda,
        mintAuthority: mintAuthorityPda,  // Passando o mintAuthorityPda corretamente
        mint: mint,
        userTokenAccount: userTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Deposited SOL and minted LBX. Tx Signature:", tx);

    const accountInfo = await getAccount(provider.connection, userTokenAccount);
    console.log("💰 Token balance:", accountInfo.amount.toString());
  });
});
