import * as nearAPI from "near-api-js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const { connect, keyStores, KeyPair, utils } = nearAPI;

// Load environment variables
dotenv.config({ path: '.env' });
const accountId = process.env.ACCOUNT_ID;

// Fetch the private key from a credentials file
const credentialsPath = "credentials-file.json";
const credentials = JSON.parse(fs.readFileSync(credentialsPath));
// Create a key pair from the private key
const keyPair = KeyPair.fromString(credentials.private_key);
// Create a keystore and add the key pair
const myKeyStore = new keyStores.InMemoryKeyStore();
myKeyStore.setKey("testnet", accountId, keyPair);

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