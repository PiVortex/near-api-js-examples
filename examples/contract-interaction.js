import { connect, keyStores, KeyPair } from "near-api-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", accountId, keyPair);

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://rpc.testnet.near.org",
};
const nearConnection = await connect(connectionConfig);

const account = await nearConnection.account(accountId);

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
  }, // Arguments for the method
  gas: 100000000000000, // Optional: gas limit
  deposit: 0, // Optional: deposit in yoctoNEAR
});
console.log(contractCallResult);

// Deploy a contract to the account
const contractPath = "contracts/contract.wasm";
const transactionOutcome = await account.deployContract(
  fs.readFileSync(contractPath), // path/contract.wasm
);
console.log(transactionOutcome);
