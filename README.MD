## Introduction

Welcome to the `Xerial Wallet SDK` for `JavaScript`. This SDK allows you to seamlessly integrate `Xerial Wallet` functionality into your `React` applications or any other `front-end JavaScript framework`.

## Installation

- To get started, install the SDK using npm:

```bash
npm install xerial-wallet-sdk
```

## Usage

- Initialize the `Xerial Wallet SDK` in your application:

```javascript
import Xerial from 'xerial-wallet-sdk';

const xerial = new Xerial({ projectId: 'your_project_id', chain: 'polygon' });
```
**Note:** The Xerial Wallet SDK supports Telos and Polygon chains.

## Authentication

- To verify if a user is authenticated, use the isAuth method:

```javascript
const isAuth = xerial.isAuth() // Returns true or false
```

- To authenticate a user, use the auth method:

```javascript
xerial.auth().then(user => {
  console.log('Authenticated user:', user);
}).catch(error => {
  console.error('Authentication failed:', error);
});
```

- To logout a user, use the logout method:

```javascript
await xerial.logout()
```

## User Information

- Retrieve user information:

```javascript
xerial.user().then(user => {
  console.log('User information:', user);
}).catch(error => {
  console.error('Error fetching user information:', error);
});
```

## Token Balances

- Retrieve token balances for specific address:

```javascript
xerial.tokens(address).then(balances => {
  console.log('Token balances:', balances);
}).catch(error => {
  console.error('Error fetching token balances:', error);
});
```

## Native Currency Balance

- Retrieve native currency balance for specific address:

```javascript
xerial.eth(address).then(balance => {
  console.log('Ethereum balance:', balance);
}).catch(error => {
  console.error('Error fetching Ethereum balance:', error);
});
```

## Transaction

- Send a transaction from specific address:

```javascript
const transaction = { /* Your transaction details */ };

xerial.sendTransaction(transaction, address).then(transactionHash => {
  console.log('Transaction sent. Hash:', transactionHash);
}).catch(error => {
  console.error('Error sending transaction:', error);
});
```

## Inventory (Polygon Only)

- Retrieve global inventory for specific address:

```javascript
xerial.inventory(address).then(inventory => {
  console.log('Global inventory on Polygon:', inventory);
}).catch(error => {
  console.error('Error fetching inventory:', error);
});
```

**Note:** Currently supported only on Polygon chain.

## Contributions ✨

- We appreciate any contribution. If you find a bug or have any suggestions, feel free to open an issue or submit a pull request on [GitHub](https://github.com/xerial-games/wallet-sdk).

- When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change. You can learn more about how you can contribute to this project in the [Contribution Guide](docs/CONTRIBUTING.md).

Thank you for using the Xerial Wallet SDK for JavaScript! 💫

Made with ❤️ by [Xerial Team](https://github.com/xerial-games)