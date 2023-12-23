const axios = require('axios');
const sleep = require('./scripts/sleep.js');
const md5 = require('./scripts/md5.js');
const DEFAULT_HEADERS = require('./scripts/headers/default-headers.js');

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_BASE_COOLDOWN = 3000;
const COOKIE_EXPIRATION_TIME = 15768000; // 4,38 hours

let cookies;
let lastCookieUpdate = 0;

let cbsId;
let xai;
let ns = 0;
let lastResponse;

/* Build payloads */
function buildCookieHeader() {
	let cookieHeader = cookies ? `_cbsid=-1; ${cookies[0].split(';')[0]};` : '';
	if (xai) cookieHeader += ` XAI=${xai.substring(0, 3)};`;
	if (cbsId) cookieHeader += ` CBSID=${cbsId};`;
	cookieHeader += ' note=1;';
	if (lastResponse) cookieHeader += ` CBALT=1~${encodeURIComponent(lastResponse)};`;

	return cookieHeader;
}

function buildMainPayload(stimulus, context, language) {
	let payload = `stimulus=${encodeURIComponent(stimulus)}&`;

	context.reverse().forEach((msg, i) => {
		payload += `vText${i}=${encodeURIComponent(msg)}&`;
	});

	payload += `${language ? `cb_settings_language=${language}&` : ''}cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`;
	return payload + md5(payload.substring(7, 33));
}

/* Update cookies */
async function updateCookiesIfNeeded() {
	if (cookies && Date.now() - lastCookieUpdate < COOKIE_EXPIRATION_TIME) return;

	try {
		const cookieResponse = await axios.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${new Date().toISOString().split('T')[0].replace(/-/g, '')}`, {
			timeout: 28000,
			headers: {
				...DEFAULT_HEADERS,
				'Cookie': '_cbsid=-1; note=1',
			},
		});

		cookies = cookieResponse.headers['set-cookie'];
		lastCookieUpdate = Date.now();
	} catch (err) {
		if (err.response && err.response.status === 403) {
			throw new Error(`Error code ${err.response.status}. Cookies cannot be updated because your IP address has been banned.`);
		} else {
			throw new Error(`Failed to update cookies. ${err.message}`);
		}
	}
}

/* Main Cleverbot function */
async function callCleverbotAPI(stimulus, context, language) {
	await updateCookiesIfNeeded();

	const payload = buildMainPayload(stimulus, context, language);
	ns += 1;

	try {
		const urlParams = cbsId ? `out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsId}&xai=${xai}&ns=${ns}&al=&dl=&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&` : '';
		const url = `https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI&ncf=V2&${urlParams}`;
		// console.log(url);

		const response = await axios.post(url, payload, {
			timeout: 20000,
			headers: {
				...DEFAULT_HEADERS,
				'Content-Length': Buffer.byteLength(payload),
				'Cookie': buildCookieHeader(),
			},
		});

		const responseLines = response.data.split('\r');
		if (responseLines.length >= 3) {
			cbsId = responseLines[1];
			xai = `${cbsId.substring(0, 3)},${responseLines[2]}`;
			lastResponse = responseLines[0];
			return lastResponse;
		}

		throw new Error('Failure: The response format from Cleverbot API is invalid!');
	} catch (err) {
		throw new Error(`Cleverbot API call failed: ${err.message}`);
	}
}

module.exports = async (stimulus, context = [], language = 'en') => {
	let incrementalDelay = 0;

	for (let i = 0; i < MAX_RETRY_ATTEMPTS; i++) {
		try {
			return await callCleverbotAPI(stimulus, context, language);
		} catch (err) {
			if (err.response && err.response.status === 403) {
				throw new Error(`Attempt ${i + 1} failed: Error code ${err.response.status}. The response could not be obtained because your IP address has been banned.`);
			} else {
				const waitTime = RETRY_BASE_COOLDOWN + Math.floor(Math.random() * 2000) + 1000 + incrementalDelay;
				console.log(`Attempt ${i + 1} failed: ${err.message}. Waiting ${waitTime / 1000}s...`);
				await sleep(waitTime);

				incrementalDelay += Math.floor(Math.random() * 3000) + 1000;
			}
		}
	}

	throw new Error(`Failed to get a response from Cleverbot after ${MAX_RETRY_ATTEMPTS} attempts.`);
};