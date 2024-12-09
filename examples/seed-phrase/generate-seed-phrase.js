import { generateSeedPhrase } from "near-seed-phrase";

// Create a seed phrase with its corresponding Keys
const { seedPhrase, publicKey, secretKey } = generateSeedPhrase();
console.log(seedPhrase, publicKey, secretKey);
