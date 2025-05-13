import { AnchorProvider, web3 } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';

const getProvider = () => {
  const connection = new Connection('https://api.devnet.solana.com');
  const provider = new AnchorProvider(connection, window.solana, {
    preflightCommitment: 'processed',
  });
  return provider;
};

export default getProvider;
