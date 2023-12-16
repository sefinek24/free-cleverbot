const CleverBot = require('../index.js');

const firstMsg = 'Hello my friend! Do you like cats? >w<';
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
			if (!res) throw new Error(`CleverBot did not return a response at interaction ${i + 1}.`);

			context.push(res);
			console.log(`[${i}]: -> ${res}`);

			interactWithCleverBot(i + 1);
		})
		.catch(err => {
			console.error(`Error at interaction ${i + 1}: ${err.message}`);

			interactWithCleverBot(i + 1);
		});
}

interactWithCleverBot(0);