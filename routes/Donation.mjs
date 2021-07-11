import route from 'express';
const { Router } = route;
import FileSys from 'fs';
import Axios from 'axios';
import Hash from 'hash.js';
import Moment from 'moment';

const router = Router();
export default router

//router.get("/donation", function (req, res){return res.render('donation.html')});
router.get("/generate", page_generate);
router.post("/generate", nets_generate);
router.post("/query",    nets_query);
router.post("/void",     nets_void);

const nets_api_key = "231e4c11-135a-4457-bc84-3cc6d3565506";
const nets_api_skey = "16c573bf-0721-478a-8635-38e53e3badf1";
const nets_api_gateway = {
	request: "https://uat-api.nets.com.sg:9065/uat/merchantservices/qr/dynamic/v1/order/request",
	query: "https://uat-api.nets.com.sg:9065/uat/merchantservices/qr/dynamic/v1/transaction/query",
	void: "https://uat-api.nets.com.sg:9065/uat/merchantservices/qr/dynamic/v1/transaction/reversal"
};
import axios from 'axios';

let nets_stan = 0;


/**
 * Draws the page that will create the QR Code
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */

async function page_generate(req, res) {
 	return res.render('donation.html'); 

}

/**
 * Signs the payload with the secret key
 * @param {{}} payload 
 * @returns {string} Signature
 */

function generate_signature(payload) {	
	const content = JSON.stringify(payload) + nets_api_skey;
	 
	const hash    = Hash.sha256().update(content).digest('hex').toUpperCase();
	
	return (Buffer.from(hash, 'hex').toString('base64'));
}

/**
 * Generates a NETs QR code to be scanned. With specified price in CENTS
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */

async function nets_generate(req, res) {
	try {
		if (!req.body.amount)
			throw Error("missing required parameter `amount`");
	}
	catch (error) {
		console.error(`Bad request`);
		console.error(error);
		return res.sendStatus(400);
	}


	try {
		const amount   = parseInt(req.body.amount);	
		const datetime = new Date();				
		const payload  = JSON.parse(FileSys.readFileSync(`${process.cwd()}/res/nets/nets-qr-request.json`));
		const stan     = ++nets_stan;
		
		
		if (nets_stan >= 1000000)
			nets_stan = 0;

		console.log(payload);

		payload.stan             = stan.toString().padStart(6, '0');
		payload.amount           = amount;
		payload.npx_data.E201    = amount;
		
		payload.transaction_date = Moment(datetime).format("MMDD");
		//payload.transaction_date = `${datetime.getMonth().toString().padStart(2, '0')}${datetime.getDay().toString().padStart(2, '0')}`;
		payload.transaction_time = Moment(datetime).format("HHmmss");
		//payload.transaction_time =  datetime.toTimeString().split(' ')[0].replace(':', '').replace(':', '');

		const signature = generate_signature(payload);

		const response = await Axios.post(nets_api_gateway.request, payload, {
			headers: {
				"Content-Type": "application/json",
				"KeyId":        nets_api_key,
				"Sign":         signature
			}
		});

		if (response.status != 200)
			throw new Error("Failed request to NETs");

		if (response.data.response_code != '00') {
			throw new Error("Failed to request for QR Code");
		}

		console.log(response.data);
		return res.json({
			"txn_identifier":   response.data.txn_identifier,
			"amount":           response.data.amount,
			"stan":             response.data.stan,
			"transaction_date": response.data.transaction_date,
			"transaction_time": response.data.transaction_time,
			"qr_code":          response.data.qr_code
		});
	}
	catch (error) {
		console.error(`Failed to generate QR code for payment`);
		console.error(error);
		return res.sendStatus(500);
	}
}
/**
 * Query a created transaction status. Whether its completed or in progress or cancelled
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function nets_query(req, res) {
	try {

	}
	catch (error) {
		console.error(`Bad request`);
		console.error(error);
		return res.sendStatus(400);
	}

	try {
		const payload  = JSON.parse(FileSys.readFileSync(`${process.cwd()}/res/nets/nets-qr-query.json`));
		
		payload.txn_identifier   = req.body.txn_identifier;
		payload.stan             = req.body.stan;
		payload.transaction_date = req.body.transaction_date;
		payload.transaction_time = req.body.transaction_time;
		payload.npx_data.E201    = req.body.amount;
		
		const signature = generate_signature(payload);
		const response  = await Axios.post(nets_api_gateway.query, payload, {
			headers: {
				"Content-Type": "application/json",
				"KeyId":        nets_api_key,
				"Sign":         signature
			}
		});

		if (response.status != 200) 
			throw new Error(`Failed to query transaction: ${payload.txn_identifier}`);
		
		switch (response.data.response_code) {
			//	Pending
			case "09":
				return res.json({
					status : 0
				});

			//	Okay
			case "00":
				return res.json({
					status : 1
				});

			//	Failed
			default:
				return res.json({
					status : -1
				});
		}
	}
	catch (error) {
		console.error(`Failed to query transaction`);
		console.error(error);
		return res.sendStatus(500);
	}
}

/**
 * Cancel a specified transaction
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function nets_void(req, res) {
	try {

	}
	catch (error) {
		console.error(`Bad request`);
		console.error(error);
		return res.sendStatus(400);
	}

	try {
		const payload  = JSON.parse(FileSys.readFileSync(`${process.cwd()}/res/nets/nets-qr-void.json`));
		
		payload.txn_identifier   = req.body.txn_identifier;
		payload.stan             = req.body.stan;
		payload.transaction_date = req.body.transaction_date;
		payload.transaction_time = req.body.transaction_time;
		payload.amount           = req.body.amount;
		// payload.npx_data.E201    = req.body.amount;
		
		const signature = generate_signature(payload);
		const response  = await Axios.post(nets_api_gateway.void, payload, {
			headers: {
				"Content-Type": "application/json",
				"KeyId":        nets_api_key,
				"Sign":         signature
			}
		});

		if (response.status != 200) 
			throw new Error(`Failed to query donation: ${payload.txn_identifier}`);
		
		console.log(response.data);

		switch (response.data.response_code) {
			//	Okay
			case "00":
				return res.json({
					status : 1
				});
			case "68":
				return res.json({
					status : 0
				});
			//	Skip?
			default:
				return res.json({
					status : -1
				});
		}
	}
	catch (error) {
		console.error(`Failed to void donation`);
		console.error(error);
		return res.sendStatus(500);
	}
}
