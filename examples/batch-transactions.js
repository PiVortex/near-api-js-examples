import * as nearAPI from "near-api-js";
import dotenv from 'dotenv';

const { connect, keyStores, KeyPair, transactions, utils } = nearAPI;

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

// Send a batch of actions to a receiver
// Prepare the actions
const callAction = transactions.functionCall("increment", [], 100000000000000, 0);
const transferAction = transactions.transfer(utils.format.parseNearAmount("1"));
const actions = [callAction, transferAction];

// Send the batch of actions
const batchActionsResult = await account.signAndSendTransaction({
    receiverId: "counter.near-examples.testnet",
    actions: actions,
});
console.log(batchActionsResult);

// // Send transactions simultaneously to multiple receivers
// // Prepare the transactions
// const guestTx = transactions.functionCall("add_message", ["Hello, world!"], 100000000000000, 0);
// const counterTx = transactions.functionCall("increment", [], 100000000000000, 0);

// await account.sign