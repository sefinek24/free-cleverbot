const logUserMessage = (i, message) => {
	console.log(`[Interaction ${i + 1}]: 🡸 ${message}`);
};

const logCleverbotResponse = (i, response) => {
	console.log(`[Interaction ${i + 1}]: 🡺 ${response}`);
};

module.exports = { logUserMessage, logCleverbotResponse };