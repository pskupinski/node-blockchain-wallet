var request = require('request'),
    querystring = require('querystring');

function BlockchainWallet(guid, mainPassword, secondPassword) {
  this.guid = guid;
  this.mainPassword = mainPassword;
  this.secondPassword = secondPassword;
  this.url = 'https://blockchain.info/merchant/';
}

BlockchainWallet.prototype.makeRequest = function(method, secondPasswordApplicable, params, callback) {
  var self = this;
  params.password = self.mainPassword;

  if(secondPasswordApplicable && self.secondPassword) {
    params.second_password = self.secondPassword;
  }

  var queryString = querystring.stringify(params);
  var url = self.url + self.guid + '/' + method + '?' + queryString;
  request(url, function(err, response, body) {
    if(err || response.statusCode !== 200) {
      return callback(new Error(err ? err : response.statusCode));
    }

    var result;
    try {
      result = JSON.parse(body);
    } catch (error) {
      return callback(error);
    }

    if(result.error) {
      return callback(new Error(result.error));
    }

    callback(null, result);
  });
};

BlockchainWallet.prototype.balance = function(callback) {
  this.makeRequest('balance', false, {}, callback);
};

BlockchainWallet.prototype.list = function(callback) {
  this.makeRequest('list', false, {}, callback);
};

BlockchainWallet.prototype.addressBalance = function(address, confirmations, callback) {
  this.makeRequest('address_balance', false, {
    'address': address,
    'confirmations': confirmations
  }, callback);
};

BlockchainWallet.prototype.payment = function(to, amount, params, callback) {
  params.to = to;
  params.amount = amount;

  this.makeRequest('payment', true, params, callback);
};

BlockchainWallet.prototype.sendMany = function(recipients, params, callback) {
  params.recipients = JSON.stringify(recipients);

  this.makeRequest('sendmany', true, params, callback);
};

BlockchainWallet.prototype.newAddress = function(params, callback) {
  this.makeRequest('new_address', true, params, callback);
};

BlockchainWallet.prototype.archiveAddress = function(address, callback) {
  this.makeRequest('archive_address', true, { 'address': address }, callback);
};

BlockchainWallet.prototype.unarchiveAddress = function(address, callback) {
  this.makeRequest('unarchive_address', true, { 'address': address }, callback);
};

BlockchainWallet.prototype.autoConsolidate = function(days, callback) {
  this.makeRequest('auto_consolidate', true, { 'days': days }, callback);
};

module.exports = BlockchainWallet;
