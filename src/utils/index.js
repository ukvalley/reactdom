//const contractAddress = 'TJufiXZ2xk5m1ov1CLhMoCM8Pty4pGttQV'
const contractAddress = 'TDsoxHCffioMrBieJJXJLgx5FcthUf5M3i'


const utils = {
    tronWeb: false,
    contract: false,

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress)
    },

};

export default utils;

