const axios = require('axios');
const sleep = require('./scripts/sleep.js');
const md5 = require('./scripts/md5.js');
const useragent = require('./scripts/useragent.js');

const DEFAULT_HEADERS = {
	'Accept': '*/*',
	'Accept-Encoding': 'gzip, deflate, br',
	'Connection': 'keep-alive',
	'Content-Type': 'text/plain;charset=UTF-8',
	'Host': 'www.cleverbot.com',
	'Origin': 'https://www.cleverbot.com',
	'Sec-Ch-Ua': '"Not_A Brand";v="8"',
	'Sec-Ch-Ua-Mobile': '?0',
	'Sec-Fetch-Dest': 'empty',
	'Sec-Fetch-Mode': 'cors',
	'Sec-Fetch-Site': 'same-origin',
	'Sec-Gpc': '1',
	'User-Agent': useragent(),
};

const COOKIE_EXPIRATION_TIME = 86400000; // 24 hours
const MAX_RETRY_ATTEMPTS = 4;
let cbsId, cookies, lastCookieUpdate = 0, lastResponse, xai;

async function updateCookiesIfNeeded() {
	try {
		if (!cookies || Date.now() - lastCookieUpdate >= COOKIE_EXPIRATION_TIME) {
			const cookieResponse = await axios.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${new Date().toJSON().split('T')[0]}`, {
				headers: {
					...DEFAULT_HEADERS,
					'Cookie': cookies ? `${cookies[0].split(';')[0]}; _cbsid=-1` : '',
				},
			});

			cookies = cookieResponse.headers['set-cookie'];
			lastCookieUpdate = Date.now();
		}
	} catch (err) {
		throw new Error(`Failed to update cookies: ${err.message}`);
	}
}

function buildAPIUrl(stimulus, language) {
	let url = 'https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI&ncf=V2';
	if (cbsId) url += `&out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsId}&xai=${xai}&ns=4&dl=${language}`;

	return url;
}

async function callCleverbotAPI(stimulus, context, language) {
	let payload = `stimulus=${encodeURIComponent(stimulus)}`;
	context.forEach((c, i) => {
		payload += `&vText${i + 2}=${encodeURIComponent(c)}`;
	});
	payload += `&cb_settings_scripting=no&sessionid=${cbsId || ''}&islearning=1&icognoid=wsf&icognocheck=${md5(payload.substring(7, 33))}`;

	try {
		const response = await axios.post(buildAPIUrl(stimulus, language), payload, {
			timeout: 60000,
			headers: {
				...DEFAULT_HEADERS,
				'Content-Length': Buffer.byteLength(payload),
				'Cookie': cookies ? `${cookies[0].split(';')[0]}; _cbsid=-1` : '',
			},
		});

		const responseLines = response.data.split('\r');
		if (responseLines.length >= 3) {
			cbsId = responseLines[1];
			xai = `${cbsId.substring(0, 3)},${responseLines[2]}`;
			lastResponse = responseLines[0];
		} else {
			throw new Error(`Invalid response format from Cleverbot API: ${response.data}`);
		}
		return lastResponse;
	} catch (err) {
		throw new Error(`Cleverbot API call failed. ${err.message}`);
	}
}

module.exports = async (stimulus, context = [], language = 'en') => {
	await updateCookiesIfNeeded();

	for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
		try {
			return await callCleverbotAPI(stimulus, context, language);
		} catch (err) {
			console.warn(`Error on attempt ${i + 1}. ${err.message}. Waiting 5s...`);
			await sleep(5000);
		}
	}

	throw new Error(`Failed to get a response from Cleverbot after ${MAX_RETRY_ATTEMPTS} attempts`);
};