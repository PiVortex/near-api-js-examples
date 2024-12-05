import * as nearAPI from "near-api-js";
import dotenv from 'dotenv';
import { homedir } from 'os';
import path from 'path';

const { connect, keyStores, utils } = nearAPI;

// Load environment variables
dotenv.config({ path: '.env' });
const accountId = process.env.ACCOUNT_ID;

// Create a keystore and add the key pair via credentials directory
const CREDENTIALS_DIR = ".near-credentials";
const credentialsPath = path.join(homedir(), CREDENTIALS_DIR);
const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

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

// Test the signer with transferring 1 NEAR
const sendTokensResult = await account.sendMoney(
    "receiver-account.testnet",
    utils.format.parseNearAmount("1") 
);
console.log(sendTokensResult);