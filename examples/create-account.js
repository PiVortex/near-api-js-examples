import * as nearAPI from "near-api-js";
import dotenv from 'dotenv';

const { connect, keyStores, KeyPair, utils } = nearAPI;

// Random account ID generator
const generateTestnetAccountId = () => Math.random().toString(36).substring(2, 10) + '.testnet';

// Random sub account ID generator
const generateSubAccountId = (accountId) => 
    `sub-${Math.random().toString(36).substring(2, 10)}.${accountId}`;

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

// Create a .testnet account
const newAccountId = generateTestnetAccountId();
// Generate a new key pair 
const newKeyPair = KeyPair.fromRandom('ed25519');
const newPublicKey = newKeyPair.getPublicKey().toString();
const newPrivateKey = newKeyPair.toString();
console.log("Public key", newPublicKey);
console.log("Private key", newPrivateKey);

const createAccountResult = await account.functionCall({
    contractId: "testnet",
    methodName: "create_account",
    args: {
        new_account_id: newAccountId, // example-account.testnet
        new_public_key: newPublicKey, // ed25519:2ASWc... 
    },
    gas: "300000000000000",
    attachedDeposit: utils.format.parseNearAmount("0.1"), // Initial balance for new account in yoctoNEAR
});
console.log(createAccountResult);

// Create a sub account 
const newSubAccountId = generateSubAccountId(accountId);
// Generate a new key pair 
const newSubKeyPair = KeyPair.fromRandom('ed25519');
const newSubPublicKey = newSubKeyPair.getPublicKey().toString();
const newSubPrivateKey = newSubKeyPair.toString();
console.log("Public key", newSubPublicKey);
console.log("Private key", newSubPrivateKey);

const createSubAccountResult = await account.createAccount(
  newSubAccountId, // sub.example-account.testnet
  newSubPublicKey, // ed25519:2ASWc...
  utils.format.parseNearAmount("0.1") // Initial balance for new account in yoctoNEAR
);
console.log(createSubAccountResult);