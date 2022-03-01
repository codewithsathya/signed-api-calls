let accessKey = "0yiw8VXGdcU2TSKUD-vaIcQgZMH8ajCOOHU11eVHPC6Epg";
let secretKey = "FnEQEZ4Gq4u-dCRJWCN1Y4H-KKl0LkIM2hp6-VIB";
const crypto = require("crypto");
const axios = require("axios");
const request = require("request");

async function getAccessToken(accessKey, secretKey) {
  let tonce = Math.floor(Date.now() / 1000) * 1000;
  console.log(tonce);
  let method = "POST";
  let url = "https://x.wazirx.com/api/v2/streams/create_auth_token";
  let sigString = `${method}|access-key=${accessKey}&tonce=${tonce}|/api/v2/streams/create_auth_token|`;
  let signature = crypto
    .createHmac("sha256", secretKey)
    .update(sigString)
    .digest("hex")
    .toString();
  console.log(signature);
  let headers = {
    "access-key": accessKey,
    signature: signature,
    tonce: tonce.toString(),
    "content-type": "application/x-www-form-urlencoded",
  };
  let response;
  try {
    const { data } = await axios({
      method: "POST",
      url: url,
      headers: headers,
    });
    response = data;
    console.log(response);
  } catch (error) {
    console.log(error.response.data);
  }
}

async function myDetails() {
  let tonce = Math.floor(Date.now() / 1000) * 1000;
  let method = "GET";
  let url = "https://x.wazirx.com/wazirx-falcon/api/v1.0/members/me";
  let sigString = `${method}|access-key=${accessKey}&tonce=${tonce}|/wazirx-falcon/api/v1.0/members/me|`;
  let signature = crypto
    .createHmac("sha256", secretKey)
    .update(sigString)
    .digest("hex")
    .toString();
  let headers = {
    "access-key": accessKey,
    signature: signature,
    tonce: tonce.toString(),
    "content-type": "application/x-www-form-urlencoded",
  };
  let response;
  try {
    const { data } = await axios({ method: "GET", url: url, headers: headers });
    response = data;
    // response = response.filter(item => parseInt(item.balance) > 0);
    console.log(response);
  } catch (error) {
    console.log(error.response.data);
  }
}

async function funds() {
  let tonce = Math.floor(Date.now() / 1000) * 1000;
  let method = "GET";
  let url = "https://x.wazirx.com/api/v2/funds";
  let sigString = `${method}|access-key=${accessKey}&tonce=${tonce}|/api/v2/funds|`;
  let signature = crypto
    .createHmac("sha256", secretKey)
    .update(sigString)
    .digest("hex")
    .toString();
  let headers = {
    "access-key": accessKey,
    signature: signature,
    tonce: tonce.toString(),
    "content-type": "application/x-www-form-urlencoded",
  };
  let response;
  try {
    const { data } = await axios({ method: "GET", url: url, headers: headers });
    response = data;
    response = response.filter((item) => parseInt(item.balance) > 0);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function depositDetails() {
  let tonce = Math.floor(Date.now() / 1000) * 1000;
  let method = "GET";
  let url = "https://x.wazirx.com/api/v2/deposits";
  let sigString = `${method}|access-key=${accessKey}&tonce=${tonce}|/api/v2/deposits|`;
  let signature = crypto
    .createHmac("sha256", secretKey)
    .update(sigString)
    .digest("hex")
    .toString();
  let headers = {
    "access-key": accessKey,
    signature: signature,
    tonce: tonce.toString(),
    "content-type": "application/x-www-form-urlencoded",
  };
  let response;
  try {
    const { data } = await axios({ method: "GET", url: url, headers: headers });
    response = data;
    // response = response.filter(item => parseInt(item.balance) > 0);
    console.log(response);
  } catch (error) {
    console.log(error.response.data);
  }
}

async function initTransaction(amount = 0, currency = "usdt") {
  // let tonce = Math.floor(Date.now() / 1000) * 1000;
	let tonce = Date.now();
  let method = "POST";
  let url = "https://x.wazirx.com/api/v2/thirdparty/asset_transfer/init";
  let sigString = `${method}|access-key=${accessKey}&tonce=${tonce}|/api/v2/thirdparty/asset_transfer/init|amount=${amount}&currency=${currency}`;
  let signature = crypto
    .createHmac("sha256", secretKey)
    .update(sigString)
    .digest("hex")
    .toString();
  let headers = {
    "access-key": accessKey,
    signature: signature,
    tonce: tonce.toString(),
    "content-type": "application/x-www-form-urlencoded",
  };
  let response;
  try {
    const { data } = await axios({
      method: "POST",
      url,
      headers,
      data: new URLSearchParams({
				amount,
				currency,
			})
    });
    response = data;
  } catch (error) {
		response = error.response.data;
  }
	return response.message;
}

async function getCurrentlyTransferrableCoins(){
	let url = "https://www.binance.com/bapi/asset/v1/public/asset-service/partner/supported-assets?clientId=aEd4v9Cd90"
	let {data: response} = await axios.get(url);
	let coins = response.data.map(item => item.assetCode.toLowerCase());
	let result = {};
	console.time("getCurrentlyTransferrableCoins");
	let arr = await getTransferrableCoinsInfo(coins);
	console.timeEnd("getCurrentlyTransferrableCoins");
	for(let item in coins){
		result[coins[item]] = arr[item];
	}
	console.log(result);
}

async function getTransferrableCoinsInfo(coins){
	let arr = [];
	for(let coin of coins){
		let data = await initTransaction(0, coin);
		arr.push(data);
	}
	return Promise.all(arr);
}

funds()
depositDetails()
