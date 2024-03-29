const userAgents = [
	// Windows - Chrome
	{
		agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
		secChUa: '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
		secChUaFullArch: '"x86"',
		secChUaFullBitness: '"64"',
		secChUaFullVersion: '"120.0.6099.110"',
		secChUaFullVersionList: '"Not_A Brand";v="8.0.0.0", "Chromium";v="122.0.6261.129", "Google Chrome";v="122.0.6261.129"',
		secChUaPlatform: '"Windows"',
		secChUaPlatformVersion: '"10.0.0"',
	},

	// Windows - Firefox
	{
		agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
	},

	// MacOS - Chrome
	// {
	// 	agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
	// 	secChUa: '"Google Chrome";v="120", "Chromium";v="120", "Mac OS X";v="14.1"',
	// 	secChUaPlatform: '"macOS"',
	// },

	// MacOS - Firefox
	// {
	// 	agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.1; rv:120.0) Gecko/20100101 Firefox/120.0',
	// 	secChUa: '"Firefox";v="120", "Gecko";v="20100101", "Mac OS X";v="14.1"',
	// 	secChUaPlatform: '"macOS"',
	// },
];

module.exports = () => {
	const RandomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
	return {
		userAgent: RandomUserAgent.agent,
		secChUa: RandomUserAgent.secChUa,
		secChUaFullArch: RandomUserAgent.secChUaFullArch,
		secChUaFullBitness: RandomUserAgent.secChUaFullBitness,
		secChUaFullVersion: RandomUserAgent.secChUaFullVersion,
		secChUaFullVersionList: RandomUserAgent.secChUaFullVersionList,
		secChUaPlatform: RandomUserAgent.secChUaPlatform,
		secChUaPlatformVersion: RandomUserAgent.secChUaPlatformVersion,
	};
};