node-blockchain-wallet
======================

An unofficial node.js client for the [blockchain.info wallet api](http://blockchain.info/api/blockchain_wallet_api).

## Usage

```javascript
var BlockchainWallet = require('blockchain-wallet'),
    blockchainWallet = new BlockchainWallet("YourGuid", "YourPassword"),
    // Certain API methods require a second password if the wallet is second password protected, while others don't at all.
    transactionBlockchainWallet = new BlockchainWallet("YourGuid", "YourPassword", "YourSecondPassword");

blockchainWallet.list(function(err, data) {
  if(err) {
    throw err;
  }

  console.log(data);
});

// Send a donation to blockchain.info.
transactionBlockchainWallet.payment("1JArS6jzE3AJ9sZ3aFij1BmTcpFGgN86hA", 500, {"note": "Thanks"}, function(err, data) {
  if(err) {
    throw err;
  }

  console.log(data);
});
```

## Reference

A method-by-method [reference](https://github.com/pskupinski/node-blockchain-wallet/wiki/API-Reference) is available on the wiki.

## License

This module is [ISC licensed](https://github.com/pskupinski/node-blockchain-wallet/blob/master/LICENSE.txt).
