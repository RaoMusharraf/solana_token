import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  MINT_SIZE,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  createInitializeMintInstruction,
  ACCOUNT_SIZE,
  createInitializeAccountInstruction,
  getMinimumBalanceForRentExemptAccount,
  createTransferCheckedInstruction,
  createAccount,
  transfer,
} from "@solana/spl-token";

import { useEffect, useState } from "react";
import mint_nft from "../abi/mint_nft.json";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
  setProvider,
} from "@project-serum/anchor";
import { Buffer } from "buffer";
import * as bs58 from "bs58";
window.Buffer = Buffer;
const programID = new PublicKey(mint_nft.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
};

const Mint = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [stakeStore, setStakestore] = useState({});
  const [stakeList, setStakelist] = useState({});
  const [campaign, setCampaign] = useState({});
  const MAX_ITEMS = 1000;

  const contractAddress = "4SgjCWpjLWVZJagvqxFEyAxEjc14nqox13qUH7KKgzTL";
  const getProvider = () => {
    // const connection = new Connection(network, opts.preflightCommitment);
    var connection = new web3.Connection(clusterApiUrl("devnet"), {
      commitment: "confirmed",
    });
    console.log(connection);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    provider.wallet.connect();
    console.log("Provider", provider);
    return provider;
  };

  // const StakingReward = async (publicKey) => {
  //     try {
  //       const provider = getProvider();
  //       const proId = new PublicKey(mint_nft.metadata.address);
  //       const program = new Program(mint_nft, proId, provider);
  //       const mintPublicKey = new PublicKey("2TwqRvwrk85JpHhd5mVB9S9ohcRcX6sAJaWgYhjsw9Rq");
  //       const transection = await program.rpc.mint(
  //         {
  //           accounts: {
  //             store: stakeStore.publicKey,
  //             list: stakeList.publicKey,
  //             depositor: provider.wallet.publicKey,
  //             stakeNft: associatedTokenAccount,
  //             mint: mintKey,
  //             metadata: getMetadata,
  //             clock: web3.SYSVAR_CLOCK_PUBKEY,
  //             systemProgram: web3.SystemProgram.programId,
  //             tokenProgram: TOKEN_PROGRAM_ID,
  //           },
  //         });
  //       console.log("Hello Transection", transection);

  //     //   let stakeListAccount = await program.account.stakeList.fetch(
  //     //     stakeList.publicKey
  //     //   );

  //     //   let stakeAccountNFT2;
  //     //   for (let i = 0; i < stakeListAccount.count.toNumber(); i++) {
  //     //     console.log(" S T A R T ");
  //     //     if (
  //     //       stakeListAccount.time[i].owner.toString() ===
  //     //       provider.wallet.publicKey.toString() &&
  //     //       stakeListAccount.time[i].mint.toString() ===
  //     //       mintPublicKey.toString()
  //     //     ) {
  //     //       stakeAccountNFT2 = stakeListAccount.time[i].stakeTime;
  //     //     }
  //     //   }
  //     //   console.log(" S T A R T ");
  //     //   console.log("campain", stakeAccountNFT2.toString());
  //     //   let result = stakeAccountNFT2 / 300;
  //     //   await program.rpc.reward(new BN(result * 0.2 * web3.LAMPORTS_PER_SOL), {
  //     //     accounts: {
  //     //       campaign: campaign,
  //     //       list: stakeList.publicKey,
  //     //       mint: mintPublicKey,
  //     //       user: provider.wallet.publicKey,

  //     //     },
  //     //   });
  //       console.log("Withdraw Some Money to", mintPublicKey.toString());
  //     } catch (error) {
  //       console.error("Error Donating", error);
  //     }
  //   };

  const NFTmint = async (publicKey) => {
    try {
      console.log("Starting tasting ---->>>>>");
      const provider = getProvider();
      setProvider(provider);

      const proId = new PublicKey(mint_nft.metadata.address);
      const program = new Program(mint_nft, proId, provider);

      const mintKeypair = web3.Keypair.generate();
      console.log("mintKeypair---->", mintKeypair);
      console.log(mintKeypair.toString());

      const testNftTitle = "RAOWAO";
      const testNftSymbol = "Nice786";
      const testNftUri =
        "https://gateway.pinata.cloud/ipfs/QmQ782Gr3zZMNUrg6jcZhUUR837edoixv6XjkZjAjsordi";
      const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );

      const mintKey = new PublicKey(
        "Aji18LadiRaXi3zFGuGV81VUdwcAre7jJHDJaoCV3SWb"
      );

      const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
        "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
      );
      console.log("NFT Account: ", mintKeypair.publicKey.toBase58());
      console.log("NFT Account: ", provider);

      const NftTokenAccount = await getAssociatedTokenAddress(
        mintKey,
        provider.wallet.publicKey
      );

      console.log("NFT Account: ", NftTokenAccount.toBase58());

      console.log("Metadata");
      const getMetadata = (
        await web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mintKeypair.publicKey.toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
      console.log("Metadata");
      console.log("Metadata initialized");
      const masterEditionAddress = (
        await web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mintKeypair.publicKey.toBuffer(),
            Buffer.from("edition"),
          ],
          TOKEN_METADATA_PROGRAM_ID
        )
      )[0];
      console.log("Metadata initialized", getMetadata);
      console.log("MintKey -->>", mintKeypair.publicKey.toString());

      const tx = await program.methods
        .mint(testNftTitle, testNftSymbol, testNftUri)
        .accounts({
          mintAuthority: provider.wallet.publicKey,
          mint: mintKeypair.publicKey,
          tokenAccount: NftTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          masterEdition: masterEditionAddress,
          metadata: getMetadata,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
          associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        })
        .signers([mintKeypair])
        .rpc();
      console.log("Your transaction signature", tx);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <button onClick={NFTmint}>mint</button>
    </>
  );
};
export default Mint;
