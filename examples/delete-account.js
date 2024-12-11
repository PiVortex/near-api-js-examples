import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";

// Random account ID generator
const generateTestnetAccountId = () =>
  Math.random().toString(36).substring(2, 10) + ".testnet";

dotenv.config({ path: ".env" });
const privateKey = process.env.PRIVATE_KEY;
const beneficiaryAccountId = process.env.ACCOUNT_ID;

const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey);
await myKeyStore.setKey("testnet", beneficiaryAccountId, keyPair);

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://rpc.testnet.near.org",
};
const nearConnection = await connect(connectionConfig);

const accountCreator = await nearConnection.account(beneficiaryAccountId);

// First create a new account to be deleted
const accountToDeleteId = generateTestnetAccountId();
const newKeyPair = KeyPair.fromRandom("ed25519");
const newPublicKey = newKeyPair.getPublicKey().toString();

await accountCreator.functionCall({
  contractId: "testnet",
  methodName: "create_account",
  args: {
    new_account_id: accountToDeleteId,
    new_public_key: newPublicKey,
  },
  gas: "300000000000000",
  attachedDeposit: utils.format.parseNearAmount("0.1"),
});

// Create an account object for the new account
// and add the new key pair to the keystore
const accountToDelete = await nearConnection.account(accountToDeleteId);
await myKeyStore.setKey("testnet", accountToDeleteId, newKeyPair);

// Delete the account with account ID of the account object
// specifying the beneficiary account ID
const deleteAccountResult = await accountToDelete.deleteAccount(beneficiaryAccountId); // example-beneficiary.testnet
console.log(deleteAccountResult);
