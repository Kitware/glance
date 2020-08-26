const register = require('../src/register');

register(async (message) => {
  const messageType = getMessageType(message);

  if(messageType === 'object')
    message.pong = 'pong';

  if(messageType === 'array')
    message.push('pong');

  if(messageType === 'string')
    message+= 'pong';

  if(messageType === 'boolean')
    message = true;

  return message;
});

const getMessageType = (message) => {
  if(typeof message === 'boolean') {
    return 'boolean';
  }
  else if(Array.isArray(message)) {
    return 'array';
  }
  else if(typeof message === 'object') {
    return 'object';
  }
  else if(typeof message === 'string') {
    return 'string';
  }
};