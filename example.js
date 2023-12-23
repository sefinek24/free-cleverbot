const CleverBot = require('./index.js');

const msg = 'Hello';
const context = [];

(async () => {
	try {
		const res = await CleverBot(msg, context, 'en');

		context.push(msg.content);
		context.push(res);

		console.log(res);
	} catch (err) {
		console.error('Sorry, but something went wrong ):', err);
	}
})();