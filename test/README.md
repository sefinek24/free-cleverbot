# 🤖 Cleverbot Conversation Flow Documentation
This document provides an explanation of the symbols used to denote message direction in the Cleverbot conversation flow within the `async.js` and `promise.js` scripts.

## Symbols 🚥
In these scripts, two symbols are used to clearly indicate the direction of the conversation:

- `->` 🡺 (Arrow Right): Represents a response from Cleverbot. When this symbol precedes a text, it indicates that the text following it is a response provided by Cleverbot in the conversation.
- `<-` 🡸 (Arrow Left): Denotes a user's message to Cleverbot. Any text following this symbol is a message sent by the user (or by the system acting as the user) to Cleverbot.

These symbols help in understanding and visualizing the flow of conversation between the user and Cleverbot, making it easier to follow and debug the interaction process.

## Example output 📃
```
PS C:\GitHub\npm\free-cleverbot> npm run test

> free-cleverbot@1.1.0 test
> node test/async.js && node test/promise.js

Async/await test...
[0]: <- Do you like cats?
[0]: -> Yes, I love cats.
[1]: <- Yes, I love cats.
[1]: -> What's your favorite breed of cat?
[2]: <- What's your favorite breed of cat?
[2]: -> Uhm. I don't know any?
[3]: <- Uhm. I don't know any?
[3]: -> Lol tell me a secret.
[4]: <- Lol tell me a secret.
[4]: -> I don't know any secrets.
[5]: <- I don't know any secrets.
[5]: -> Tell me something about the world.
[
  'Do you like cats?',
  'Yes, I love cats.',
  "What's your favorite breed of cat?",
  "Uhm. I don't know any?",
  'Lol tell me a secret.',
  "I don't know any secrets.",
  'Tell me something about the world.'
]

Promise test...
[0]: <- Do you like cats?
[0]: -> Yep! They are tasty. LOL.
[1]: <- Yep! They are tasty. LOL.
[1]: -> What's your favorite kind of apple?
[2]: <- What's your favorite kind of apple?
[2]: -> I don't like apples.
[3]: <- I don't like apples.
[3]: -> I only like them in pie.
[4]: <- I only like them in pie.
[4]: -> Soup of mathematics?
[5]: <- Soup of mathematics?
[5]: -> So are you good at maths?
[
  'Do you like cats?',
  'Yep! They are tasty. LOL.',
  "What's your favorite kind of apple?",
  "I don't like apples.",
  'I only like them in pie.',
  'Soup of mathematics?',
  'So are you good at maths?'
]
```