import {LocalWallet, SmartWallet, SmartWalletConfig} from "@thirdweb-dev/wallets";
import { Mumbai } from "@thirdweb-dev/chains";
import {ThirdwebSDK} from "@thirdweb-dev/sdk";
import {
    TWApiKey,
    factoryAddress,
    activeChain,
    TW_SECRET_KEY
} from "../../const/constants";

export default async function FromWallet() {

// First, connect the personal wallet, which can be any wallet (metamask, walletconnect, etc.)
// Here we're just generating a new local wallet which can be saved later
    const personalWallet = new LocalWallet();
    await personalWallet.generate();

// Setup the Smart Wallet configuration
    const config: SmartWalletConfig = {
        chain: activeChain, // the chain where your smart wallet will be or is deployed
        factoryAddress: factoryAddress, // your own deployed account factory address
        clientId: TWApiKey, // obtained from the thirdweb dashboard
        secretKey: TW_SECRET_KEY,
        gasless: true, // enable or disable gasless transactions
    };

// Then, connect the Smart wallet
    const wallet = new SmartWallet(config);
    await wallet.connect({
        personalWallet,
    });

// You can then use this wallet to perform transactions via the SDK
    const sdk = await ThirdwebSDK.fromWallet(wallet, Mumbai);
    return sdk
}
