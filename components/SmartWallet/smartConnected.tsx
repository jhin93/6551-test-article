import {
  ThirdwebSDKProvider,
  useAddress,
  useBalance,
  useContract,
  Web3Button,
  useOwnedNFTs, ThirdwebNftMedia
} from "@thirdweb-dev/react";
import React from "react";
import { activeChain, tokenAddress, TWApiKey, ERC721_ADDRESS } from "../../const/constants";
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
  } = useContract(ERC721_ADDRESS);

  const {
      data: ownedNFTs,
      isLoading: ownedNFTsIsLoading,
  } = useOwnedNFTs(contract, address)

  const metadata = {
    "name": "certification_wallet_tba",
    "description": "This is test ERC-721 NFT for test TBA",
    "image": "ipfs://QmPtnAXSb5a88wS77tZAnzvUBFubCzSfa46FZrxv9Jdo5C/certificate_test.jpeg",
    "external_url": "",
    "background_color": "",
    "attributes": [
      {
        "trait_type": "creator",
        "value": "jhin"
      }
    ],
    "customImage": "",
    "customAnimationUrl": ""
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
            <h2>Mint Wallet NFT:</h2>
            <Web3Button contractAddress={ERC721_ADDRESS} action={(contract) => contract.erc721.mint(metadata)}>
              Create TBA(NFT)
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
