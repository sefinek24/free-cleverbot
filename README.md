<div align="center">
    <h1>❎ 💸 Free CleverBOT NPM Module 🤖 💻</h1>
    <p>
        <b>
            Simple and unofficial NPM module for interacting with the same API that the Cleverbot website uses.<br>
            Available for free! ✔️
        </b>
    </p>
    <p>
        <a href="https://www.npmjs.com/package/free-cleverbot" target="_blank" title="free-cleverbot - npm" style="text-decoration:none">
            <img src="https://img.shields.io/npm/dt/free-cleverbot?maxAge=3600" alt="Number of downloads">
            <img src="https://img.shields.io/github/issues/sefinek24/free-cleverbot" alt="Issues">
            <img src="https://img.shields.io/github/last-commit/sefinek24/free-cleverbot" alt="Last commit">
            <img src="https://img.shields.io/github/commit-activity/w/sefinek24/free-cleverbot" alt="Commit activity">
            <img src="https://img.shields.io/github/languages/code-size/sefinek24/free-cleverbot" alt="Code size">
        </a>
    </p>
</div>

This module enables developers to interact with the Cleverbot [API](https://en.wikipedia.org/wiki/API) without requiring an official [API key](https://en.wikipedia.org/wiki/API_key),
offering a convenient and cost-effective solution for integrating Cleverbot chatbot capabilities into your projects.


## 🔒 Security
The module selects a [User Agent](https://en.wikipedia.org/wiki/User_agent) randomly from an [array](https://github.com/sefinek24/free-cleverbot/blob/17442083acfc4ef29de709b788023b3e7bdb5981/scripts/useragent.js#L1) and uses it to send requests to `cleverbot.com`.
Each restart of the application results in the selection of a different user agent at random.


## ⚠️ Warning
**Using this module could potentially lead to a permanent [IP](https://en.wikipedia.org/wiki/IP_address) ban on [cleverbot.com](https://www.cleverbot.com), although this is unlikely.**

This module provides free access to Cleverbot's API, but it is crucial to use it responsibly, keeping in mind that Cleverbot.com may act against IP addresses that misuse their service.
Therefore, consider the following guidelines:
- **Use Responsibly**: Avoid excessive requests to Cleverbot in a short period. Adhere to their terms of service.
- **Testing and Development**: Ideal for testing and development purposes. Not recommended for high-traffic or production applications to prevent IP bans.
- **Use at Your Own Risk**: Users assume responsibility for any potential consequences, including IP bans or other actions by Cleverbot.com.
- **Consider Official API Key**: For extensive and commercial use, consider obtaining an official API key from Cleverbot for reliable and uninterrupted access.


## 📥 Installation
Install this module using npm or yarn:

```bash
npm install free-cleverbot
```


## 🔧 » Usage

### `CleverBot(message, context[], language)`
A function for interacting with the Cleverbot API. It processes the provided message, context, and language, then returns a response from Cleverbot.

- `message` (**string**, **required**): The message that the user wants to send to Cleverbot. This is the primary text to which Cleverbot will respond.
- `context[]` (**array**, **required**): An array containing the history of previous messages in the conversation. Used to maintain the context of the conversation. Each element of the array represents one line of dialogue.
- `language` (**string**, **optional**, **default**: `en`): The language in which the conversation is to be conducted.


## ⚙️ Module Settings
The module configuration includes the following settings:

| Variable                                                                                                                          | Value    | Description                                                   |
|-----------------------------------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------|
| [`MAX_RETRY_ATTEMPTS`](https://github.com/sefinek24/free-cleverbot/blob/cd18fe5b8516607341155b35e7e48b2c64f1a233/index.js#L6)     | 3        | The maximum number of attempts to make a request to the API.  |
| [`RETRY_BASE_COOLDOWN`](https://github.com/sefinek24/free-cleverbot/blob/cd18fe5b8516607341155b35e7e48b2c64f1a233/index.js#L7)    | 4000     | Base cooldown in case of API error (4 seconds).               |
| [`COOKIE_EXPIRATION_TIME`](https://github.com/sefinek24/free-cleverbot/blob/cd18fe5b8516607341155b35e7e48b2c64f1a233/index.js#L8) | 15768000 | The expiration time for cookies in milliseconds (4,38 hours). |

## 💬 Example
```js
const CleverBot = require('free-cleverbot');

const message = 'Do you like cats? >w<';
const context = [];

(async () => {
    const response = await CleverBot(message, context, 'en'); // Input, conversation context, language

    /*
     * Add the user's message first to the context followed by Cleverbot's
     * response to maintain the correct conversational order.
     */
    context.push(message); // User's message 
    context.push(response); // Cleverbot's response

    console.log(response);
})();
```


## 🤔 What can this module be used for?
- Your [Discord Bot](https://discord.com/developers/docs/intro)
- *Do you have additional ideas for utilizing this module? Create a [Pull Request](https://github.com/sefinek24/free-cleverbot/pulls) and contribute them here!*


## 💙 Thanks
If you require any assistance or have questions regarding this module, don't hesitate to open a new [GitHub Issue](https://github.com/sefinek24/free-cleverbot/issues).
Your feedback and contributions are highly appreciated.
If you find this module valuable and useful for your projects, we kindly invite you to show your support by giving it [⭐ a star on GitHub](https://github.com/sefinek24/free-cleverbot).
Thank you for using [free-cleverbot](https://www.npmjs.com/package/free-cleverbot)!


## 🔖 Credits
It is inspired by the [IntriguingTiles/cleverbot-free](https://github.com/IntriguingTiles/cleverbot-free) project.


## 📝 MIT License
Copyright 2023 © by [Sefinek](https://sefinek.net). All Rights Reserved.