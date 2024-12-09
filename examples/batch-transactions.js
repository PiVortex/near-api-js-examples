import { connect, keyStores, KeyPair, transactions, utils } from "near-api-js";
import dotenv from "dotenv";

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

// Send a batch of actions to a receiver
// Prepare the actions
const callAction = transactions.functionCall(
  "increment",
  [],
  100000000000000,
  0,
);
const transferAction = transactions.transfer(utils.format.parseNearAmount("1"));
const actions = [callAction, transferAction];

// Send the batch of actions
const batchActionsResult = await account.signAndSendTransaction({
  receiverId: "counter.near-examples.testnet",
  actions: actions,
});
console.log(batchActionsResult);

// Send independent transactions simultaneously to different receivers
// Prepare the transactions
const transactionPromises = [
  account.signAndSendTransaction({
    receiverId: "guestbook.near-examples.testnet",
    actions: [
      transactions.functionCall(
        "add_message",
        ["Hello, world!"],
        100000000000000,
        0,
      ),
    ],
  }),
  account.signAndSendTransaction({
    receiverId: "counter.near-examples.testnet",
    actions: [transactions.functionCall("increment", [], 100000000000000, 0)],
  }),
];

// Send the transactions simultaneously
const transactionsResults = await Promise.all(transactionPromises);
console.log(transactionsResults);
