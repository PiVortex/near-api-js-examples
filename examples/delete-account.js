import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";

// Random account ID generator
const generateTestnetAccountId = () =>
  Math.random().toString(36).substring(2, 10) + ".testnet";

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

const accountCreator = await nearConnection.account(accountId);

// First create a new account to be deleted
const newAccountId = generateTestnetAccountId();
// Generate a new key pair
const newKeyPair = KeyPair.fromRandom("ed25519");
const newPublicKey = newKeyPair.getPublicKey().toString();
const newPrivateKey = newKeyPair.toString();
console.log("Public key", newPublicKey);
console.log("Private key", newPrivateKey);

await accountCreator.functionCall({
  contractId: "testnet",
  methodName: "create_account",
  args: {
    new_account_id: newAccountId,
    new_public_key: newPublicKey,
  },
  gas: "300000000000000",
  attachedDeposit: utils.format.parseNearAmount("0.1"),
});

// Create an account object for the new account
// and add the new key pair to the keystore
const account = await nearConnection.account(newAccountId);
await myKeyStore.setKey("testnet", newAccountId, newKeyPair);

// Delete the account with account ID of the account object
const deleteAccountResult = await account.deleteAccount(accountId); // example-beneficiary.testnet
console.log(deleteAccountResult);
