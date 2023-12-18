const axios = require('axios');
const sleep = require('./scripts/sleep.js');
const md5 = require('./scripts/md5.js');
const DEFAULT_HEADERS = require('./scripts/useragent/object.js');

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_BASE_COOLDOWN = 4000;
const COOKIE_EXPIRATION_TIME = 15768000; // 4,38 hours

let cookies;
let lastCookieUpdate = 0;

let cbsId;
let xai;
let ns = 0;
let lastResponse;

async function updateCookiesIfNeeded() {
	if (cookies && Date.now() - lastCookieUpdate < COOKIE_EXPIRATION_TIME) return;

	try {
		const cookieResponse = await axios.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${new Date().toISOString().split('T')[0].replace(/-/g, '')}`, {
			timeout: 25000,
			headers: {
				...DEFAULT_HEADERS,
				'Cookie': '_cbsid=-1; note=1',
			},
		});

		cookies = cookieResponse.headers['set-cookie'];
		lastCookieUpdate = Date.now();
	} catch (err) {
		throw new Error(`Failed to update cookies: ${err.message}`);
	}
}

function buildPayload(stimulus, context, language) {
	let payload = `stimulus=${encodeURIComponent(stimulus)}&`;
	context.reverse().forEach((msg, i) => {
		payload += `vText${i + 2}=${encodeURIComponent(msg)}&`;
	});
	payload += `${language ? `cb_settings_language=${language}&` : ''}cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`;
	return payload + md5(payload.substring(7, 33));
}

async function callCleverbotAPI(stimulus, context, language) {
	await updateCookiesIfNeeded();
	const payload = buildPayload(stimulus, context, language);

	try {
		ns = ns + 1;
		const url = `https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI&ncf=V2&${cbsId ? `out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsId}&xai=${xai}&ns=${ns}&al=&dl=&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&` : ''}`;
		const response = await axios.post(url, payload, {
			timeout: 19000,
			headers: {
				...DEFAULT_HEADERS,
				'Content-Length': Buffer.byteLength(payload),
				'Cookie': cookies ? `_cbsid=-1; note=1; ${cookies[0].split(';')[0]}; ${xai ? `XAI=${cbsId.substring(0, 3)};` : ''} ${lastResponse ? `CBALT=1~${lastResponse};` : ''}` : '',
			},
		});

		const responseLines = response.data.split('\r');
		if (responseLines.length >= 3) {
			cbsId = responseLines[1];
			xai = `${cbsId.substring(0, 3)},${responseLines[2]}`;
			lastResponse = responseLines[0];
			return lastResponse;
		}

		throw new Error('Invalid response format from Cleverbot API');
	} catch (err) {
		throw new Error(`Cleverbot API call failed: ${err.message}`);
	}
}

module.exports = async (stimulus, context = [], language = 'en') => {
	for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
		try {
			return await callCleverbotAPI(stimulus, context, language);
		} catch (err) {
			if (err.response && err.response.status === 403) {
				throw new Error(`Attempt ${i + 1} failed: IP address is banned. ${err.message}`);
			} else {
				const waitTime = RETRY_BASE_COOLDOWN + Math.floor(Math.random() * 4000) + 1000;
				console.log(`Attempt ${i + 1} failed: ${err.message}. Waiting ${waitTime / 1000}s...`);
				await sleep(waitTime);
			}
		}
	}
	throw new Error(`Failed to get a response from Cleverbot after ${MAX_RETRY_ATTEMPTS} attempts.`);
};