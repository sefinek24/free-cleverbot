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

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_BASE_COOLDOWN = 4000; // Base cooldown period in milliseconds (4 seconds)
const COOKIE_EXPIRATION_TIME = 86400000; // 24 hours
let cbsId, cookies, lastCookieUpdate = 0, lastResponse, xai;

async function updateCookiesIfNeeded() {
	try {
		if (!cookies || Date.now() - lastCookieUpdate >= COOKIE_EXPIRATION_TIME) {
			const cookieResponse = await axios.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${new Date().toJSON().split('T')[0]}`, {
				timeout: 25000,
				headers: {
					...DEFAULT_HEADERS,
					// 'Cookie': cookies ? `${cookies[0].split(';')[0]}; _cbsid=-1` : '',
				},
			});

			cookies = cookieResponse.headers['set-cookie'];
			lastCookieUpdate = Date.now();
		}
	} catch (err) {
		if (err.response && err.response.status === 403) {
			throw new Error(`Failed to update cookies. Your IP is banned. ${err.message}`);
		} else {
			throw new Error(`Failed to update cookies. Unknown error. ${err.message}`);
		}
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
			timeout: 19000,
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
			if (err.response && err.response.status === 403) {
				throw new Error(`Error on attempt ${i + 1}. Sorry, but your IP address is banned. ${err.message}`);
			} else {
				// Random additional cooldown between 1 and 5 seconds
				const additionalCooldown = Math.floor(Math.random() * 4000) + 1000;
				const waitTime = RETRY_BASE_COOLDOWN + additionalCooldown;

				console.log(`Error on attempt ${i + 1}. ${err.message}. Waiting ${waitTime / 1000}s...`);
				await sleep(waitTime);
			}
		}
	}

	throw new Error(`Failed to get a response from Cleverbot after ${MAX_RETRY_ATTEMPTS} attempts. ${cbsId ? `Session ${cbsId}.` : 'Unknown session.'}`);
};