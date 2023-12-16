const axios = require('axios');
const md5 = require('./scripts/md5.js');
const useragent = require('./scripts/useragent.js');

const USER_AGENT = useragent();
const COOKIE_EXPIRATION_TIME = 86400000;
const MAX_RETRY_ATTEMPTS = 15;
let cbsId, cookies, lastCookieUpdate = 0, lastResponse, xai;

async function updateCookiesIfNeeded() {
	if (!cookies || Date.now() - lastCookieUpdate >= COOKIE_EXPIRATION_TIME) {
		const cookieResponse = await axios.get(`https://www.cleverbot.com/extras/conversation-social-min.js?${new Date().toJSON().split('T')[0].split('T')[0]}`, {
			headers: { 'User-Agent': USER_AGENT },
		});

		cookies = cookieResponse.headers['set-cookie'];
		lastCookieUpdate = Date.now();
	}
}

function buildAPIUrl(stimulus) {
	return `https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI${cbsId ? `&out=${encodeURIComponent(lastResponse)}&in=${encodeURIComponent(stimulus)}&bot=c&cbsid=${cbsId}&xai=${xai}&ns=2&al=&dl=&flag=&user=&mode=1&alt=0&reac=&emo=&sou=website&xed=&` : ''}`;
}

async function callCleverbotAPI(stimulus, context, language) {
	let payload = `stimulus=${encodeURIComponent(stimulus)}&${context.slice().reverse().map((c, i) => `vText${i + 2}=${encodeURIComponent(c)}`).join('&')}`;
	if (language) payload += `&cb_settings_language=${language}`;
	payload += `&cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=${md5(payload.substring(7, 33))}`;

	const response = await axios.post(buildAPIUrl(stimulus), payload, {
		timeout: 60000,
		headers: {
			'Cookie': `${cookies[0].split(';')[0]}; _cbsid=-1`,
			'User-Agent': USER_AGENT,
			'Content-Type': 'text/plain',
		},
	});

	const responseLines = response.data.split('\r');
	cbsId = responseLines[1];
	xai = `${cbsId.substring(0, 3)},${responseLines[2]}`;
	lastResponse = responseLines[0];
	return lastResponse;
}

module.exports = async (stimulus, context = [], language) => {
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