// CreateSmartWallet.js
import newSmartWallet from "./SmartWallet";

const CreateSmartWallet = async (nft: any, address: any, wallet: any) => {

    if (nft && address && wallet) {
        const smartWallet = newSmartWallet(nft);
        console.log("personal wallet", address);
        await smartWallet.connect({
            personalWallet: wallet,
        });
        const signer = await smartWallet.getSigner();
        console.log("signer", signer);
        const smartWalletAddress = await smartWallet.getAddress();
        console.log("smart wallet address", smartWalletAddress);
        return { smartWallet, signer, smartWalletAddress };
    } else {
        console.log("smart wallet not created");
        return null;
    }
};

export default CreateSmartWallet;
