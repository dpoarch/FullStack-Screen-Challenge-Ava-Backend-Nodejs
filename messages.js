var uuid = require("uuid");

const messages = [];
const conversations = [];

const addMessage = (room, message) => {
  const msg = { id: uuid.v4(), room, ...message,  };
  const conv = { ok:"true", "conversations": [
    {
      "id": uuid.v4(),
			"text": message.body,
			"lastMutation": { // The last mutation of this conversation
				"type": "insert",
				"index": conversations.length-1 < 0 ? 'none' : conversations.length-1,
				"length": message.body.length,
				"text": "string",
			  "author": message.user.name,
				"origin": {
			    "alice": messages.filter((message) => message.user.name === 'Alice').length,
			    "bob": messages.filter((message)=> message.user.name === 'Bob').length
			  }
			}
    }
  ] 
};

  messages.push(msg);
  conversations.push(conv);

  return msg;
};

const removeMessage = (id) => {
  const index = messages.findIndex((message) => message.id === id);

  if (index !== -1) return messages.splice(index, 1)[0];
};

const getMessage = (id) => messages.find((message) => message.id === id);

const getMessagesInRoom = (room) =>
  messages.filter((message) => message.room === room);

const getConversations = (room) =>
  conversations;

module.exports = { addMessage, removeMessage, getMessage, getMessagesInRoom, getConversations };
