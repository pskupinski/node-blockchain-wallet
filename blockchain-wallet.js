var request = require("request"),
    querystring = require("querystring");

var BlockchainWallet = function(guid, main_password) {
  var self = this;
  self.guid = guid;
  self.main_password = main_password;
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
      }

      callback(false, result);
    });
  };

  self.balance = function(callback) {
    self.makeRequest("balance", { "password": self.main_password }, callback);
  }
}

module.exports = BlockchainWallet;
