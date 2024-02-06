# Xerial Wallet JavaScript SDK Documentation

## Introduction

Welcome to the documentation for the Xerial Wallet SDK for JavaScript. This SDK allows you to seamlessly integrate Xerial Wallet functionalities into your React or any other JavaScript front-end framework applications.

## Installation

To get started, install the SDK using npm:

```bash
npm install xerial-wallet-sdk
```

## Usage

Initialize the Xerial Wallet SDK in your application:

```javascript
import Xerial from 'xerial-wallet-sdk';

const xerial = new Xerial({ projectId: 'your_project_id', chain: 'polygon' });
```
**Note:** The Xerial Wallet SDK supports the Telos and Polygon chains.

## Authentication

To authenticate a user, use the auth method:

```javascript
xerial.auth().then(user => {
  console.log('Authenticated user:', user);
}).catch(error => {
  console.error('Authentication failed:', error);
});
```

## User Information

Retrieve user information:

```javascript
xerial.user().then(user => {
  console.log('User information:', user);
}).catch(error => {
  console.error('Error fetching user information:', error);
});
```

## Token Balances

Retrieve token balances:

```javascript
xerial.tokens().then(balances => {
  console.log('Token balances:', balances);
}).catch(error => {
  console.error('Error fetching token balances:', error);
});
```

## Native Currency Balance

Retrieve native currency balance:

```javascript
xerial.eth().then(balance => {
  console.log('Ethereum balance:', balance);
}).catch(error => {
  console.error('Error fetching Ethereum balance:', error);
});
```

## Transaction

Send a transaction:

```javascript
const transaction = { /* Your transaction details */ };

xerial.sendTransaction(transaction).then(transactionHash => {
  console.log('Transaction sent. Hash:', transactionHash);
}).catch(error => {
  console.error('Error sending transaction:', error);
});
```

## Inventory (Polygon Only)

Retrieve global inventory on the Polygon chain:

```javascript
xerial.inventory().then(inventory => {
  console.log('Global inventory on Polygon:', inventory);
}).catch(error => {
  console.error('Error fetching inventory:', error);
});
```

## Support

If you encounter any issues or have questions, please contact us at [ignaciopirisb@gmail.com](mailto:ignaciopirisb@gmail.com) or visit [xerial.io](https://xerial.io).

## Contributions

We welcome contributions! If you find a bug or have a suggestion, feel free to open an issue or submit a pull request on [GitHub](https://github.com/xerial-games/wallet-sdk).

Thank you for using the Xerial Wallet SDK for JavaScript!