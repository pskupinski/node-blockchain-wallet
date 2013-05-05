var request = require("request"),
    querystring = require("querystring");

var BlockchainWallet = function(guid, mainPassword, secondPassword) {
  var self = this;
  self.guid = guid;
  self.mainPassword = mainPassword;
  self.secondPassword = secondPassword;
  self.url = "https://blockchain.info/merchant/";

  self.makeRequest = function(method, secondPasswordApplicable, params, callback) {
    params.password = self.mainPassword;

    if(secondPasswordApplicable && self.secondPassword) {
      params.second_password = self.secondPassword;
    }

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

      callback(null, result);
    });
  };

  self.balance = function(callback) {
    self.makeRequest("balance", false, {}, callback);
  };

  self.list = function(callback) {
    self.makeRequest("list", false, {}, callback);
  };

  self.addressBalance = function(address, confirmations, callback) {
    self.makeRequest("address_balance", false, {
      "address": address,
      "confirmations": confirmations
    }, callback);
  };

  self.payment = function(to, amount, params, callback) {
    params.to = to;
    params.amount = amount;

    self.makeRequest("payment", true, params, callback);
  };

  self.sendMany = function(recipients, params, callback) {
    params.recipients = JSON.stringify(recipients);

    self.makeRequest("sendmany", true, params, callback);
  };

  self.newAddress = function(params, callback) {
    self.makeRequest("new_address", true, params, callback);
  };

  self.archiveAddress = function(address, callback) {
    self.makeRequest("archive_address", true, { "address": address }, callback);
  };

  self.unarchiveAddress = function(address, callback) {
    self.makeRequest("unarchive_address", true, { "address": address }, callback);
  };

  self.autoConsolidate = function(days, callback) {
    self.makeRequest("auto_consolidate", true, { "days": days }, callback);
  };
};

module.exports = BlockchainWallet;
