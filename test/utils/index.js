require('dotenv').config();

module.exports = {
  /**
   * Returns the default BCS address.
   * @return {String} Default BCS address.
   */
  getDefaultBCSAddress: () => {
    if (!process.env.SENDER_ADDRESS) {
      throw Error('Must have SENDER_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.SENDER_ADDRESS));
  },

  /**
   * Returns the BCS network RPC url.
   * @return {String} The BCS network RPC url.
   */
  getBCSRPCAddress: () => {
    if (!process.env.BCS_RPC_ADDRESS) {
      throw Error('Must have BCS_RPC_ADDRESS in .env');
    }
    return String(Buffer.from(process.env.BCS_RPC_ADDRESS));
  },

  /**
   * Returns the wallet passphrase to unlock the encrypted wallet.
   * @return {String} The wallet passphrase.
   */
  getWalletPassphrase: () => (process.env.WALLET_PASSPHRASE ? String(Buffer.from(process.env.WALLET_PASSPHRASE)) : ''),

  isWalletEncrypted: async (bcsweb3) => {
    const res = await bcsweb3.getWalletInfo();
    return Object.prototype.hasOwnProperty.call(res, 'unlocked_until');
  },
};
