const CleverBot = require('../index.js');
const { logUserMessage, logCleverbotResponse } = require('./scripts/log.js');

const message = 'Cat?';
const context = [];
const totalInteractions = 4;

const interactWithCleverBot = i => {
	if (i >= totalInteractions) return;

	const messageToSend = i === 0 ? message : context[context.length - 1];
	logUserMessage(i, messageToSend);

	CleverBot(messageToSend, context, 'en')
		.then(res => {
			if (!res) {
				console.error(`CleverBOT did not return a response at interaction ${i + 1}.`);
				process.exit(1);
			}

			context.push(messageToSend);
			context.push(res);

			logCleverbotResponse(i, res);
			interactWithCleverBot(i + 1);
		})
		.catch(err => {
			console.error(`Error during interaction ${i + 1}: ${err.message}`);
			interactWithCleverBot(i + 1);
		});
};

console.log('» Starting promise test...');
interactWithCleverBot(0);