const CleverBot = require('../index.js');
const { logStartTests, logUserMessage, logCleverbotResponse, logWrongResponse, logFatalError } = require('./scripts/log.js');

// Add the --debug flag to start debugging: node test/async.js --debug
const isDebugMode = process.argv.slice(2).includes('--debug');
if (isDebugMode) CleverBot.settings({ debug: true });

// Variables
const message = 'Do you like kittens?';
const context = [];
const totalInteractions = 5;

const interactWithCleverBot = async () => {
	for (let i = 0; i < totalInteractions; i++) {
		const messageToSend = i === 0 ? message : context[context.length - 1];
		logUserMessage(i, messageToSend);

		try {
			const res = await CleverBot.interact(messageToSend, context, 'en');
			if (!res) return logWrongResponse(i);

			context.push(messageToSend);
			context.push(res);

			logCleverbotResponse(i, res);
		} catch (err) {
			logFatalError(i, err);
			break;
		}
	}

	if (isDebugMode) console.debug(CleverBot.getVariables());
};

logStartTests(`» Starting async/await test (version ${CleverBot.version})...`);
interactWithCleverBot().then(() => console.log());