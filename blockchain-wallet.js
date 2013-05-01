var request = require("request"),
    querystring = require("querystring");

var BlockchainWallet = function(guid, mainPassword) {
  var self = this;
  self.guid = guid;
  self.mainPassword = mainPassword;
  self.url = "https://blockchain.info/merchant/";

  self.makeRequest = function(method, params, callback) {
    var queryString = querystring.stringify(params);
    url = self.url + self.guid + "/" + method + "?" + queryString;
    request(url, function(err, response, body) {
      if(err || response.statusCode !== 200) {
        callback(err ? err : response.statusCode);
        return;
      }

      var result = JSON.parse(body);

      if(result.error) {
        callback(result.error);
        return;
      }

      callback(false, result);
    });
  };

  self.balance = function(callback) {
    self.makeRequest("balance", { "password": self.mainPassword }, callback);
  };

  self.list = function(callback) {
    self.makeRequest("list", { "password": self.mainPassword }, callback);
  };

  self.addressBalance = function(address, confirmations, callback) {
    self.makeRequest("address_balance", {
      "password": self.mainPassword,
      "address": address,
      "confirmations": confirmations
    }, callback);
  };
}

module.exports = BlockchainWallet;
