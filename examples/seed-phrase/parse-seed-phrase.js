import { parseSeedPhrase } from "near-seed-phrase";

// Parse a seed phrase to get its corresponding keys
const seedPhrase =
  "describe much wisdom poem tackle muffin polar list hair cost bench digital";
const { publicKey, secretKey } = parseSeedPhrase(seedPhrase);
console.log(publicKey, secretKey);
