const axios = require('axios');
const md5 = require('./scripts/md5.js');
const useragent = require('./scripts/useragent.js');

const USER_AGENT = useragent();
const DEFAULT_HEADERS = {
	'Accept': '*/*',
	'Accept-Encoding': 'gzip, deflate, br',
	'Connection': 'keep-alive',
	'Content-Type': 'text/plain;charset=UTF-8',
	'Host': 'www.cleverbot.com',
	'Origin': 'https://www.cleverbot.com',
	'Sec-Ch-Ua': '"Not_A Brand";v="8"',
	'Sec-Ch-Ua-Mobile': '?0',
	'Sec-Ch-Ua-Platform': '"Windows"',
	'Sec-Fetch-Dest': 'empty',
	'Sec-Fetch-Mode': 'cors',
	'Sec-Fetch-Site': 'same-origin',
	'Sec-Gpc': '1',
	'User-Agent': USER_AGENT,
};
const COOKIE_EXPIRATION_TIME = 86400000; // 24 hours
const MAX_RETRY_ATTEMPTS = 15;
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
		console.error(`Error updating cookies: ${err.message}`);
		throw err;
	}
}

function buildAPIUrl(stimulus, language) {
	let url = 'https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI&ncf=V2';
	if (cbsId) {
		url += `&out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsId}&xai=${xai}&ns=4&dl=${language}`;
	}
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
		console.error(`Error calling Cleverbot API: ${err.message}`);
		throw err;
	}
}

module.exports = async (stimulus, context = [], language = 'en') => {
	await updateCookiesIfNeeded();

	for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
		try {
			return await callCleverbotAPI(stimulus, context, language);
		} catch (err) {
			if (err.response && err.response.status === 503) {
				await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
			} else {
				console.error(`Error on attempt ${i}: ${err.message}`);
			}
		}
	}

	throw new Error(`Failed to get a response from Cleverbot after ${MAX_RETRY_ATTEMPTS} attempts`);
};