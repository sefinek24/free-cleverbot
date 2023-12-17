const logUserMessage = (i, message) => {
	console.log(`[${i + 1}]: <- ${message}`);
};

const logCleverbotResponse = (i, response) => {
	console.log(`[${i + 1}]: -> ${response}`);
};

module.exports = { logUserMessage, logCleverbotResponse };