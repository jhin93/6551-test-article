import {
  MediaRenderer,
  ThirdwebNftMedia,
  useAddress
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import {
  activeChain,
  nftDropAddress,
  ERC721_ADDRESS
} from "../../../const/constants";
import styles from "../../../styles/Token.module.css";
import { Toaster } from "react-hot-toast";
import { Signer } from "ethers";
import SmartWalletConnected from "../../../components/SmartWallet/smartConnected";
import CreateSmartWallet from "../../../components/SmartWallet/CreateSmartWallet";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
  const [tokenBoundAccount, setTokenBoundAccount] = useState<string | null>(
    null
  );
  const [signer, setSigner] = useState<Signer>();

  // get the currently connected wallet
  const address = "0x0f39A4f62CfB28B2b7316A88ed6567D20ae3c1D0";

  console.log("address : ", address)
  console.log("nft : ", nft)

  // create a smart wallet for the NFT
  useEffect(() => {
    const createWallet = async () => {
      const walletData = await CreateSmartWallet(nft, address);
      if (walletData) {
        setSigner(walletData.signer);
        setTokenBoundAccount(walletData.tokenBoundAccount);
      } else {
        console.log("smart wallet not created");
      }
    };
    createWallet();
  }, [nft, tokenBoundAccount, address]);

  console.log("tokenBoundAccount : ", tokenBoundAccount)

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.image}
            />
          </div>

          <div className={styles.listingContainer}>
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  src={contractMetadata.image}
                  className={styles.collectionImage}
                />
                <p className={styles.collectionName}>{contractMetadata.name}</p>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
            {tokenBoundAccount ? (
                <p className={styles.collectionName}>Token Bound Account : {tokenBoundAccount}</p>
            ) : (
                <p className={styles.collectionName}>Loading token bound address...  : {tokenBoundAccount}</p>
            )}
            {tokenBoundAccount ? (
              <SmartWalletConnected signer={signer} />
            ) : (
              <div className={styles.btnContainer}>
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;
  const sdk = new ThirdwebSDK(activeChain, {
    secretKey: process.env.TW_SECRET_KEY,
  });

  const contract = await sdk.getContract(nftDropAddress);

  const nft = await contract.erc721.get(tokenId);
  console.log(nft.metadata.uri, "Here!!!");

  let contractMetadata;

  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) {}

  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
    revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK(activeChain, {
    secretKey: process.env.TW_SECRET_KEY,
  });

  const contract = await sdk.getContract(nftDropAddress);

  const nfts = await contract.erc721.getAll();
  const paths = nfts.map((nft) => {
    return {
      params: {
        contractAddress: nftDropAddress,
        tokenId: nft.metadata.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
