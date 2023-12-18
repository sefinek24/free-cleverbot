const randomUserAgent = require('./get-ua.js');
const { userAgent, secChUa, secChUaFullArch, secChUaFullBitness, secChUaFullVersion, secChUaFullVersionList, secChUaPlatform, secChUaPlatformVersion } = randomUserAgent();

const DEFAULT_HEADERS = {
	'Accept': '*/*',
	'Accept-Encoding': 'gzip, deflate, br',
	'Accept-Language': 'en;q=0.7',
	'Cache-Control': 'no-cache',
	'Connection': 'keep-alive',
	'Content-Type': 'text/plain;charset=UTF-8',
	'Host': 'www.cleverbot.com',
	'Pragma': 'no-cache',
	'Origin': 'https://www.cleverbot.com',
	'Referer': 'https://www.cleverbot.com/',
	'Sec-Ch-Ua': secChUa,
	'Sec-Ch-Ua-Arch': secChUaFullArch,
	'Sec-Ch-Ua-Bitness': secChUaFullBitness,
	'Sec-Ch-Ua-Full-Version': secChUaFullVersion,
	'Sec-Ch-Ua-Full-Version-List': secChUaFullVersionList,
	'Sec-Ch-Ua-Mobile': '?0',
	'Sec-Ch-Ua-Model': '""',
	'Sec-Ch-Ua-Platform': secChUaPlatform,
	'Sec-Ch-Ua-Platform-Version': secChUaPlatformVersion,
	'Sec-Ch-Ua-Wow64': '?0',
	'Sec-Fetch-Dest': 'empty',
	'Sec-Fetch-Mode': 'cors',
	'Sec-Fetch-Site': 'same-origin',
	'Sec-Gpc': '1',
	'User-Agent': userAgent,
};


function getValidHeaders(headers) {
	return Object.fromEntries(
		Object.entries(headers).filter(
			([, value]) => value !== undefined && value !== null,
		),
	);
}

module.exports = getValidHeaders(DEFAULT_HEADERS);