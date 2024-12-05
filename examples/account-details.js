import * as nearAPI from "near-api-js";
import dotenv from "dotenv";

const { connect } = nearAPI;

// Load environment variables
dotenv.config({ path: ".env" });
const accountId = process.env.ACCOUNT_ID;

// Create a connection to NEAR testnet
const connectionConfig = {
  networkId: "testnet",
  keyStore: null, // No key store needed for this example
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://testnet.mynearwallet.com/",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://testnet.nearblocks.io",
};
const nearConnection = await connect(connectionConfig);

// Create an account object
const account = await nearConnection.account(accountId); // example-account.testnet

// Gets the account balance in yoctoNEAR for an account
// Includes the total balance, stateStaked, staked, and available
const accountBalance = await account.getAccountBalance();
console.log(accountBalance);

// Returns basic account information
// and the basic block details at which it was queried
const accountState = await account.state();
console.log(accountState);

// Gets a list of authorized apps for an account
const accountDetails = await account.getAccountDetails();
console.log(accountDetails);
