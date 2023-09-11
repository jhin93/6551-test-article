
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
        const tokenBoundAccount = await smartWallet.getAddress();
        console.log("token bound account address", tokenBoundAccount);
        return { smartWallet, signer, tokenBoundAccount };
    } else {
        console.log("smart wallet not created");
        return null;
    }
};

export default CreateSmartWallet;
