# 🤖 Free CleverBOT
**Simple and unofficial NPM module for interacting with the same API that the Cleverbot website uses for free.**

This module allows developers to interact with Cleverbot's API without the need for an official API key, making it a convenient and cost-effective solution for incorporating Cleverbot's chatbot capabilities into your projects.


## ⚠️ Warning
**Using this module may result in a permanent IP ban on cleverbot.com, although this is unlikely.**

While this module provides access to Cleverbot's API for free, it's essential to use it responsibly and be aware of the potential consequences. Cleverbot.com may take action against IP addresses that abuse their service. Therefore, it's crucial to exercise caution and consider the following guidelines when using this module:

- **Use Responsibly**: Avoid making an excessive number of requests to Cleverbot in a short period. Respect their terms of service.

- **Testing and Development**: This module is ideal for testing and development purposes. Avoid using it for high-traffic or production applications, as it may lead to IP bans.

- **Use Your Own Risk**: By using this module, you assume the responsibility for any potential consequences, including IP bans or other actions taken by Cleverbot.com.

- **Consider an Official API Key**: If you plan to use Cleverbot's services extensively and commercially, consider obtaining an official API key from Cleverbot to ensure reliable and uninterrupted access.

We encourage responsible usage of this module and respect for Cleverbot's service.

## 🔒 Security
This module randomly selects a User Agent from an [array] and utilizes it to send requests to the `cleverbot.com` server. Upon restarting the application, a different user agent will be selected at random.

## 📥 Installation
To install this module, you can use npm or yarn:

```bash
npm install free-cleverbot
```

## 🏓 Example
```js
const CleverBot = require('free-cleverbot');
const context = [];

(async () => {
    const res = await CleverBot('Do you like cats? >w<', context, 'en'); // input, conversation context, language

    context.push(res);
    context.push(firstMsg);
    
    console.log(res);
})();
```

## 🤔 What can this module be used for?
- Your Discord Bot
- *Do you have additional ideas for utilizing this module? Create a Pull Request and contribute them here!*

## 💜 Credits
It is inspired by the [IntriguingTiles/cleverbot-free](https://github.com/IntriguingTiles/cleverbot-free) project.

## 📝 MIT License
Copyright 2023 © by [Sefinek](https://sefinek.net). All Rights Reserved.