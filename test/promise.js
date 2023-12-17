const CleverBot = require('../index.js');

const firstMsg = 'Do you like cats?';
const context = [firstMsg];
const totalInteractions = 6;

function interactWithCleverBot(i) {
	if (i >= totalInteractions) {
		console.log(context);
		return;
	}

	console.log(`[${i}]: <- ${context[context.length - 1]}`);

	CleverBot(context[context.length - 1], context, 'en')
		.then(res => {
			if (!res) {
				console.error(`CleverBOT did not return a response at interaction ${i + 1}.`);
				process.exit(1);
			}

			context.push(res);
			console.log(`[${i}]: -> ${res}`);

			interactWithCleverBot(i + 1);
		})
		.catch(err => {
			console.error(`Error at interaction ${i + 1}: ${err.message}`);

			interactWithCleverBot(i + 1);
		});
}

console.log('Promise test...');
interactWithCleverBot(0);