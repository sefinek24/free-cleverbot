const CleverBot = require('./index.js');

const msg = 'Hello';
const context = [];

(async () => {
	const res = await CleverBot(msg, context, 'en');

	context.push(msg.content);
	context.push(res);

	console.log(res);
})();