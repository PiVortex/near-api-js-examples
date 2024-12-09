# near-api-js-examples

In the `examples` folder, you can find examples of how to use the `near-api-js` library. These examples are used as code snippets in the NEAR API section of the documentation.

## Setup

To run the examples, you will need to create a `.env` file in the root of the project. The `.env` file should look like this:

```
ACCOUNT_ID=your-account-id.testnet // The account ID to use for the examples
PRIVATE_KEY=ed25519:5YPd... // The private key for the account
```

To run `credentials-directory.js` you will also need to create a file named `credentials-file.json` in the root of the project. This file needs to contain a `private_key` field with a valid private key for the account in the `.env` file. 

## Run the examples

To run these examples use the following command:

```bash
node examples/example-name.js
```

Replace `example-name` with the name of the example you want to run.