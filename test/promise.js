const CleverBot = require('../index.js');
const { logStartTests, logUserMessage, logCleverbotResponse, logWrongResponse, logFatalError } = require('./scripts/log.js');

const message = 'Cat?';
const context = [];
const totalInteractions = 4;

const interactWithCleverBot = i => {
	if (i >= totalInteractions) return;

	const messageToSend = i === 0 ? message : context[context.length - 1];
	logUserMessage(i, messageToSend);

	CleverBot.interact(messageToSend, context, 'en')
		.then(res => {
			if (!res) return logWrongResponse(i);

			context.push(messageToSend);
			context.push(res);

			logCleverbotResponse(i, res);
			interactWithCleverBot(i + 1);
		})
		.catch(err => {
			logFatalError(i, err);
			interactWithCleverBot(i + 1);
		});
};

logStartTests(`» Starting promise test (version ${CleverBot.version})...`);
interactWithCleverBot(0);