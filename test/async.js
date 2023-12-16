const CleverBot = require('../index.js');

const firstMsg = 'Hello my friend! Do you like cats? >w<';
const context = [firstMsg];
const totalInteractions = 6;

async function action() {
	for (let i = 0; i < totalInteractions; i++) {
		try {
			console.log(`[${i}]: <- ${context[context.length - 1]}`);

			const res = await CleverBot(context[context.length - 1], context, 'en');
			if (!res) throw new Error(`CleverBot did not return a response at interaction ${i + 1}.`);

			context.push(res);

			console.log(`[${i}]: -> ${res}`);
		} catch (err) {
			console.error(`Error at interaction ${i + 1}: ${err.message}`);
		}
	}

	console.log(context);
}

action();