import * as nearAPI from "near-api-js";
import dotenv from 'dotenv';

const { connect, keyStores, KeyPair, utils } = nearAPI;

// Load environment variables
dotenv.config({ path: '.env' });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a keystore and add the key pair via the private key string
const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", accountId, keyPair);

// Create a connection to NEAR testnet
const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore, 
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://testnet.mynearwallet.com/",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://testnet.nearblocks.io",
};
const nearConnection = await connect(connectionConfig);

// Create an account object
const account = await nearConnection.account(accountId); // example-account.testnet

const sendTokensResult = await account.sendMoney(
  "receiver-account.testnet", // Receiver account
  utils.format.parseNearAmount("1") // Amount being sent in yoctoNEAR
);
console.log(sendTokensResult);