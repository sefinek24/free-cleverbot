const axios = require('axios');
const SUPPORTED_LANGUAGES = require('./scripts/languages.js');
const DEFAULT_HEADERS = require('./scripts/headers/default-headers.js');
const md5 = require('./scripts/md5.js');
const sleep = require('./scripts/sleep.js');
const { version } = require('./package.json');

const CleverBot = {};
let debug = false;
let selectedLanguage = 'en';
let maxRetryAttempts = 3;
let retryBaseCooldown = 3000;
let cookieExpirationTime = 15768000; // 4,38 hours

let cookies;
let lastCookieUpdate = 0;

let cbsId;
let xai;
let ns = 0;
let lastResponse;
let successfulRequestsCount = 0;
let failedRequestsCount = 0;

/* Build payloads */
function buildCookieHeader() {
	let cookieHeader = cookies ? `_cbsid=-1; ${cookies[0].split(';')[0]};` : '';
	if (xai) cookieHeader += ` XAI=${xai.substring(0, 3)};`;
	if (cbsId) cookieHeader += ` CBSID=${cbsId};`;
	cookieHeader += ' note=1;';
	if (lastResponse) cookieHeader += ` CBALT=1~${encodeURIComponent(lastResponse)};`;

	if (debug) console.debug('Cookie header:', { cookieHeader });
	return cookieHeader;
}

function buildMainPayload(stimulus, context, language) {
	let payload = `stimulus=${encodeURIComponent(stimulus)}&`;

	context.reverse().forEach((msg, i) => {
		payload += `vText${i}=${encodeURIComponent(msg)}&`;
	});

	payload += `${language ? `cb_settings_language=${language}&` : ''}cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`;
	payload += payload + md5(payload.substring(7, 33));

	if (debug) console.debug('Built payload:', { stimulus, context, language, payload });
	return payload;
}

/* Update cookies */
async function updateCookiesIfNeeded() {
	if (debug) {
		if (cookies) {
			console.debug('Cookies are still valid.');
		} else {
			console.debug('Attempting to update cookies.');
		}
	}

	if (cookies && Date.now() - lastCookieUpdate < cookieExpirationTime) return;

	try {
		const cookieResponse = await axios.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${new Date().toISOString().split('T')[0].replace(/-/g, '')}`, {
			timeout: 28000,
			headers: {
				...DEFAULT_HEADERS,
				'Cookie': '_cbsid=-1; note=1',
			},
		});

		successfulRequestsCount++;
		cookies = cookieResponse.headers['set-cookie'];
		lastCookieUpdate = Date.now();

		if (debug) console.debug('Cookies has been updated:', cookies);
	} catch (err) {
		failedRequestsCount++;

		if (err.response && err.response.status === 403) {
			throw new Error(`Error code ${err.response.status}. Cookies cannot be updated because your IP address has been banned.`);
		} else {
			throw new Error(`Failed to update cookies. ${err.message}`);
		}
	}
}

/* Main Cleverbot function */
async function callCleverbotAPI(stimulus, context, language) {
	if (debug) console.debug('Calling Cleverbot API with:', { stimulus, context, language });

	await updateCookiesIfNeeded();

	const payload = buildMainPayload(stimulus, context, language);
	ns += 1;

	try {
		const urlParams = cbsId ? `out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsId}&xai=${xai}&ns=${ns}&al=&dl=&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&` : '';
		const url = `https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI&ncf=V2&${urlParams}`;

		if (debug) console.debug('Preparing to call Cleverbot API:', { url, payload });

		const response = await axios.post(url, payload, {
			timeout: 20000,
			headers: {
				...DEFAULT_HEADERS,
				'Content-Length': Buffer.byteLength(payload),
				'Cookie': buildCookieHeader(),
			},
		});

		successfulRequestsCount++;

		if (debug) console.debug('Received response from Cleverbot:', { response: response.data });

		const responseLines = response.data.split('\r');
		if (responseLines.length >= 3) {
			cbsId = responseLines[1];
			xai = `${cbsId.substring(0, 3)},${responseLines[2]}`;
			lastResponse = responseLines[0];
			return lastResponse;
		}

		console.error('Failure: The response format from Cleverbot API is invalid!');
	} catch (err) {
		failedRequestsCount++;

		throw new Error(`Cleverbot API call failed: ${err.message}`);
	}
}

CleverBot.interact = async (stimulus, context = [], language = selectedLanguage) => {
	let incrementalDelay = 0;

	for (let i = 0; i < maxRetryAttempts; i++) {
		try {
			return await callCleverbotAPI(stimulus, context, language);
		} catch (err) {
			if (err.response && err.response.status === 403) {
				throw new Error(`Attempt ${i + 1} failed: Error code ${err.response.status}. The response could not be obtained because your IP address has been banned.`);
			} else {
				const waitTime = retryBaseCooldown + Math.floor(Math.random() * 2000) + 1000 + incrementalDelay;
				console.log(`Attempt ${i + 1} failed: ${err.message}. Waiting ${waitTime / 1000}s...`);
				await sleep(waitTime);

				incrementalDelay += Math.floor(Math.random() * 3000) + 1000;
			}
		}
	}

	throw new Error(`Failed to get a response from Cleverbot after ${maxRetryAttempts} attempts.`);
};

CleverBot.settings = config => {
	if (typeof config === 'object' && config !== null) {
		if ('debug' in config) {
			debug = !!config.debug;
		}
		if ('defaultLanguage' in config) {
			const lang = config.defaultLanguage;
			if (typeof lang === 'string' && SUPPORTED_LANGUAGES.has(lang)) {
				selectedLanguage = lang;
			} else {
				throw new Error(`Invalid value for defaultLanguage. Supported languages are: ${[...SUPPORTED_LANGUAGES].join(', ')}.`);
			}
		}
		if ('maxRetryAttempts' in config) {
			if (typeof config.maxRetryAttempts === 'number' && config.maxRetryAttempts > 0) {
				maxRetryAttempts = config.maxRetryAttempts;
			} else {
				throw new Error('Invalid value for maxRetryAttempts. It must be a positive number.');
			}
		}
		if ('retryBaseCooldown' in config) {
			if (typeof config.retryBaseCooldown === 'number' && config.retryBaseCooldown > 0) {
				retryBaseCooldown = config.retryBaseCooldown;
			} else {
				throw new Error('Invalid value for retryBaseCooldown. It must be a positive number.');
			}
		}
		if ('cookieExpirationTime' in config) {
			if (typeof config.cookieExpirationTime === 'number' && config.cookieExpirationTime > 0) {
				cookieExpirationTime = config.cookieExpirationTime;
			} else {
				throw new Error('Invalid value for cookieExpirationTime. It must be a positive number.');
			}
		}
	} else {
		throw new Error('The settings must be provided as an object.');
	}
};

CleverBot.getVariables = () => {
	return { debug, selectedLanguage, maxRetryAttempts, retryBaseCooldown, cookie: { cookieExpirationTime, data: [{ content: cookies, lastUpdate: lastCookieUpdate }] }, session: { cbsId, xai, ns, lastResponse }, request: { successfulRequestsCount, failedRequestsCount, headers: DEFAULT_HEADERS } };
};

CleverBot.version = version;

module.exports = CleverBot;