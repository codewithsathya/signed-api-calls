require("dotenv").config();
const Wazirx = require("./classes/Wazirx");

const wazirxAccessKey = process.env.WAZIRX_ACCESS_KEY;
const wazirxSecretKey = process.env.WAZIRX_SECRET_KEY;
const wazirxAuthKey = process.env.WAZIRX_2FA_KEY;
const wazirx = new Wazirx(wazirxAccessKey, wazirxSecretKey, wazirxAuthKey);

async function run(){
	console.time("totalTime");
	const response = await wazirx.transferToBinance("wrx", "10");
	console.timeEnd("totalTime");
	console.log(response);
}

run();

const {authenticator} = require("otplib");
const token = authenticator.generate(wazirxAuthKey);
console.log(token);