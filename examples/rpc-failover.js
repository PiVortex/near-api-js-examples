import * as nearAPI from "near-api-js";
import dotenv from "dotenv";

const { connect, keyStores, KeyPair, utils, providers } = nearAPI;

// Load environment variables
dotenv.config({ path: ".env" });
const privateKey = process.env.PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

// Create a keystore and add the key pair via the private key string
const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey); // ed25519::5Fg2...
await myKeyStore.setKey("testnet", accountId, keyPair);

// Set up a new FailoverRpcProvider with two JSON RPC providers
const jsonProviders = [
  new providers.JsonRpcProvider(
    { url: "https://test.rpc.fastnear.com" }, // RPC URL
    {
      retries: 3, // Number of retries before giving up on a request
      backoff: 2, // Backoff factor for the retry delay
      wait: 500, // Wait time between retries in milliseconds
    }, // Retry options
  ),
  new providers.JsonRpcProvider({
    url: "https://rpc.testnet.near.org",
  }), // Second RPC URL
];
const provider = new providers.FailoverRpcProvider(jsonProviders); // Create a FailoverRpcProvider

// Create a connection to NEAR testnet
const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://incorrect-rpc-url.com", // Incorrect RPC URL
  provider: provider,
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
  utils.format.parseNearAmount("1"),
);
console.log(sendTokensResult);
