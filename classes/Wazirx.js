const axios = require("axios");
const crypto = require("crypto");
const { authenticator } = require("otplib");

class Wazirx {
  accessKey;
  secretKey;
  baseUrl = "https://x.wazirx.com";
  signedLinks = {
    userProfile: "/wazirx-falcon/api/v1.0/members/me",
    funds: "/api/v2/funds",
    paymentDetails: "/wazirx-falcon/api/v2.0/p2p/payments/all",
    binanceTransferInit: "/api/v2/thirdparty/asset_transfer/init",
    binanceTransferVerify: "/api/v2/thirdparty/asset_transfer/verify_2fa",
    order: "/api/v3/order",
    orderStatus: "/api/v3/order/status",
  };
  constructor(accessKey, secretKey, totpKey) {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.totpKey = totpKey;
  }

  async transferToBinance(currency, amount) {
    let initResponse = await this.binanceTransferInit(currency, amount);
    let verifyResponse = await this.binanceTransferVerify(initResponse);
    return verifyResponse;
  }

  async binanceTransferInit(currency, amount) {
    currency = currency.toLowerCase();
    const response = await this.sendRequest(
      "POST",
      this.signedLinks.binanceTransferInit,
      { currency, amount },
      "application/x-www-form-urlencoded"
    );
    return response;
  }

  async binanceTransferVerify(responseData) {
    console.log(responseData);
    const data = {
      token: authenticator.generate(this.totpKey),
      type: "Token::Authenticatior",
      code: responseData["2fa"].code,
      "platform[label]": "web",
    };
    console.log(data);
    const response = await this.sendRequest(
      "POST",
      this.signedLinks.binanceTransferVerify,
      data,
      "application/json"
    );
    return response;
  }

  async sendRequest(method, path, data, contentType) {
    const url = this.baseUrl + path;
    const tonce = Date.now();
    method = method.toUpperCase();
    let sigString = `${method}|access-key=${this.accessKey}&tonce=${tonce}|${path}|`;
    data &&
      contentType === "application/x-www-form-urlencoded" &&
      (sigString += this.utils.convertObjectToQueryString(data));
    console.log(sigString);
    const signature = this.utils.getSignature(this.secretKey, sigString);
    const headers = {
      "access-key": this.accessKey,
      signature,
      tonce,
      "content-type": contentType,
    };
    let response;
    if (contentType === "application/x-www-form-urlencoded") {
      data = new URLSearchParams(data);
    }
    try {
      const { data: res } = await axios({
        method,
        url,
        headers,
        data,
      });
      response = res;
    } catch (e) {
      response = e.response.data;
    }
    return response;
  }

  utils = {
    getSignature(secretKey, string) {
      return crypto
        .createHmac("sha256", secretKey)
        .update(string)
        .digest("hex")
        .toString();
    },
    convertObjectToQueryString(obj) {
      let queryString = "";
      for (let key in obj) {
        queryString += `${key}=${obj[key]}&`;
      }
      return this.sortQueryString(queryString.slice(0, -1));
    },
    sortQueryString(queryString) {
      return queryString.split("&").sort().join("&");
    },
  };
}

module.exports = Wazirx;
