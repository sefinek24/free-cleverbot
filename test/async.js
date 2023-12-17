const CleverBot = require('../index.js');

const firstMsg = 'Do you like cats? >w<';
const context = [firstMsg];
const totalInteractions = 6;

async function action() {
	for (let i = 0; i < totalInteractions; i++) {
		try {
			console.log(`[${i}]: <- ${context[context.length - 1]}`);

			const res = await CleverBot(context[context.length - 1], context, 'en');
			if (!res) {
				console.error(`CleverBOT did not return a response at interaction ${i + 1}.`);
				process.exit(1);
			}

			context.push(res);

			console.log(`[${i}]: -> ${res}`);
		} catch (err) {
			throw new Error(`Error at interaction ${i + 1}. ${err.message}`);
		}
	}

	console.log(context);
	console.log();
}

console.log('Async/await test...');
action();