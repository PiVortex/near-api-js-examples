import * as nearAPI from "near-api-js";
import dotenv from "dotenv";
import fs from "fs";

const { connect, keyStores, KeyPair } = nearAPI;

// Load environment variables
dotenv.config({ path: ".env" });
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

// Make a view call to a contract
const viewCallResult = await account.viewFunction({
  contractId: "guestbook.near-examples.testnet", // Contract account ID
  methodName: "total_messages", // Method to call
  // No args in this case
});
console.log(viewCallResult);

const contractCallResult = await account.functionCall({
  contractId: "guestbook.near-examples.testnet", // Contract account ID
  methodName: "add_message", // Method to call
  args: {
    text: "Hello, world!",
  },
});
console.log(contractCallResult);

// Deploy a contract to the account
const contractPath = "contracts/contract.wasm";
const transactionOutcome = await account.deployContract(
  fs.readFileSync(contractPath), // path/contract.wasm
);
console.log(transactionOutcome);
