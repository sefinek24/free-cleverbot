const CleverBot = require('./index.js');

CleverBot.config({
	debug: false,
	defaultLanguage: 'en',
	maxRetryAttempts: 5,
	retryBaseCooldown: 4000,
	cookieExpirationTime: 18000000,
});

const msg = 'Hello';
const context = [];

(async () => {
	try {
		console.log('User message       :', msg);

		const res = await CleverBot.interact(msg, context);

		context.push(msg);
		context.push(res);

		console.log('Cleverbot response :', res);

		// console.log('\nconfig           :', CleverBot.getVariables());
	} catch (err) {
		console.error('Sorry, but something went wrong ):', err);
	}
})();