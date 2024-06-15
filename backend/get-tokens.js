const axios = require('axios');
const fs = require('fs');
const {
  client_id,
  client_secret,
  redirect_uri,
  username,
  code,
} = require('./amo-client.json');

const getTokens = async () => {
  const response = await axios.post(
    `https://${username}.amocrm.ru/oauth2/access_token`,
    {
      client_id: client_id,
      client_secret: client_secret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirect_uri,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  console.log(response.data);
  let content = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
  fs.writeFileSync(
    __dirname + '/tokens.json',
    JSON.stringify(content, null, 2),
  );
};

getTokens();
