import { connect, keyStores, KeyPair, providers } from "near-api-js";
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
// Set up a new provider
const url = `https://rpc.testnet.near.org`;
const provider = new providers.JsonRpcProvider({ url });

const viewCallResult = await provider.query({
  request_type: "call_function",
  account_id: "guestbook.near-examples.testnet", // Contract account ID
  method_name: "total_messages", // Method to call
  args_base64: "", // No args in this case (optional)
  finality: "optimistic", // Optimistic finality (or 'final' for final finality)
});

const viewCallData = JSON.parse(
  Buffer.from(viewCallResult.result).toString(),
); // Parse the result as JSON
console.log(viewCallData);

// Make a function call to a contract
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
const deployResult = await account.deployContract(
  fs.readFileSync("contracts/contract.wasm"), // Path of contract WASM relative to the working directory
);
console.log(deployResult);
