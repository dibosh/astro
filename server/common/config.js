var config = {
  API_URL: 'http://ams-api.astro.com.my/',
  CHANNELS_ENDPOINT: 'ams/v3/getChannels',
  EVENTS_ENDPOINT: 'ams/v3/getEvents',
  MONGO_HOST: 'localhost',
  MONGO_DB: 'astro',
  TOKEN_SECRET: process.env.TOKEN_SECRET || '063HJODV3EPNEOG4B0WMEMSZ66XGKP71',
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'f982e481eae63b867e84f0915e9ef59e'
};

module.exports = config;
