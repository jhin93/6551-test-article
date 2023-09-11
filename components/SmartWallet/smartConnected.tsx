import {
  ThirdwebSDKProvider,
  useAddress,
  useBalance,
  useContract,
  Web3Button,
  useOwnedNFTs, ThirdwebNftMedia
} from "@thirdweb-dev/react";
import React from "react";
import { activeChain, tokenAddress, TWApiKey, EDITIONDROP_ADDRESS, MINT721_ADDRESS } from "../../const/constants";
import { Signer } from "ethers";
import style from "../../styles/Token.module.css";
import toast from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
interface ConnectedProps {
  signer: Signer | undefined;
}

// ThirdwebSDKProvider is a wrapper component that provides the smart wallet signer and active chain to the Thirdweb SDK.
const SmartWalletConnected: React.FC<ConnectedProps> = ({ signer }) => {
  return (
    <ThirdwebSDKProvider
      signer={signer}
      activeChain={activeChain}
      clientId={TWApiKey}
    >
      <ClaimTokens />
    </ThirdwebSDKProvider>
  );
};

// This is the main component that shows the user's token bound smart wallet.
const ClaimTokens = () => {
  const address = useAddress();
  const { data: tokenBalance, isLoading: loadingBalance } = useBalance(tokenAddress);

  const {
    contract
  } = useContract(EDITIONDROP_ADDRESS);

  const {
      data: ownedNFTs,
      isLoading: ownedNFTsIsLoading,
  } = useOwnedNFTs(contract, address)

  const metadata = {
    "name": "402_Edit Texture",
    "description": "\nMinted By CLO Virtual Fashion\n\nView Website : https://connect.clo-set.com/detail/28f156b9293d4fd780f1cf21d51cc83e\n\nCONNECT Creator E-mail : jhin@clo3d.com\n\nCONNECT Creator Address : 0x28cAB8f74cC7eFA51845e8d11C22636De13Bf430\n\nCONNECT Item Code : 23081800030\n\nItem Description : Check pattern with black and light gray\n",
    "imageAlt": "https://storagefiles.clo-set.com/public/marketplace/202308/28f156b9293d4fd780f1cf21d51cc83e/1/thumbnail/402_Edit%20Texture.png?verify=1692340956-dx6ekGjNHN628gATp%2fhP9gZ%2fsl9VvNscxbQuAOfgREs%3d",
    "external_url": "https://connect.clo-set.com/detail/28f156b9293d4fd780f1cf21d51cc83e",
    "attributes": [
      {
        "trait_type": "type",
        "value": "Garment"
      }
    ],
    "image": "https://caa2c003a548f6091241c33268082739.ipfscdn.io/ipfs/bafybeidzsrivpmfseozuccv6cczwwglchv7uy4xbcizm6ri2hxkqgpteiu/"
  }

  return (
    <div className={style.walletContainer}>
      <h2>This is Your Token Bound Smart Wallet!</h2>
      {address ? (
        loadingBalance ? (
          <h2>Loading Balance...</h2>
        ) : (
          <div className={style.pricingContainer}>
            <h2>Balance: {tokenBalance?.displayValue}</h2>
            <Web3Button
              contractAddress={tokenAddress}
              action={async (contract) => await contract.erc20.claim(10)}
              onSuccess={() => {
                toast(`Tokens Claimed!`, {
                  icon: "✅",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
              onError={(e) => {
                console.log(e);
                toast(`Tokens Claim Failed! Reason: ${(e as any).reason}`, {
                  icon: "❌",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
            >
              Claim 10 Tokens
            </Web3Button>
            <br />
            <h2>Claim NFT:</h2>
            <Web3Button contractAddress={MINT721_ADDRESS} action={(contract) => contract.erc721.mint(metadata)}>
              Claim NFT
            </Web3Button>
            {ownedNFTsIsLoading ? (
                <p>Loading...</p>
            ): (
                <div>
                  {ownedNFTs && ownedNFTs.length > 0 ? (
                      ownedNFTs.map((nft) => (
                          <div key={nft.metadata.id}>
                            <ThirdwebNftMedia metadata={nft.metadata} />
                            <p>{nft.metadata.name}</p>
                            <p>QTY : {nft.quantityOwned}</p>
                          </div>
                      ))
                  ) : (
                      <p>You have no NFTS</p>
                  )}
                </div>
            )}
          </div>
        )
      ) : null}
    </div>
  );
};

export default SmartWalletConnected;
