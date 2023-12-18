const CleverBot = require('../index.js');
const { logUserMessage, logCleverbotResponse } = require('./scripts/log.js');

const message = 'Do you like cats?';
const context = [];
const totalInteractions = 6;

const interactWithCleverBot = async () => {
	for (let i = 0; i < totalInteractions; i++) {
		const messageToSend = i === 0 ? message : context[context.length - 1];
		logUserMessage(i, messageToSend);

		try {
			const res = await CleverBot(messageToSend, context, 'en');
			if (!res) {
				console.error(`CleverBOT did not return a response at interaction ${i + 1}.`);
				process.exit(1);
			}

			context.push(messageToSend);
			context.push(res);

			logCleverbotResponse(i, res);
		} catch (err) {
			console.error(`Error during interaction ${i + 1}: ${err.message}`);
			break;
		}
	}
};

console.log('» Starting async/await test...');
interactWithCleverBot().then(() => console.log());