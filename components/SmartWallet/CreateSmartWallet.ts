
import newSmartWallet from "./SmartWallet";
import { LocalWallet } from "@thirdweb-dev/wallets";

const CreateSmartWallet = async (nft: any, address: any) => {
    const personalWallet = new LocalWallet();
    console.log("Local Wallet Instance: ", personalWallet)
    await personalWallet.generate();

    if (nft && address) {
        const smartWallet = newSmartWallet(nft);
        console.log("Local Wallet Address : ", address);
        await smartWallet.connect({
            personalWallet,
        });

        const signer = await smartWallet.getSigner();
        console.log("signer", signer);
        const tokenBoundAccount = await smartWallet.getAddress();
        console.log("token bound account address", tokenBoundAccount);
        return { smartWallet, signer, tokenBoundAccount };
    } else {
        console.log("smart wallet not created");
        return null;
    }
};

export default CreateSmartWallet;
