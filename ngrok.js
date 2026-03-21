// ngrok.js
const ngrok = require('ngrok');

(async () => {
  try {
    const url = await ngrok.authtoken('შენი_ngrok_token'); // თუ ჯერ არ გაქვს ავტჰ-ტოკენი
    const tunnelUrl = await ngrok.connect({
      proto: 'http',
      addr: 3000
    });
    console.log('Ngrok URL:', tunnelUrl);
  } catch (err) {
    console.error('Ngrok error:', err);
  }
})();