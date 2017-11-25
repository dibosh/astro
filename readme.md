#### Setup
   - `npm install -g gulp`
   - `npm install`
   - `bower install`

#### Frontend
   - `gulp serve`

##### Building for deployment
   - `gulp`

##### Running from built distro
   - `gulp serve:dist`

#### Backend for Frontend(*[BFF](http://samnewman.io/patterns/architectural/bff/)*)

##### Run server
   - `node server/index.js`

##### API
   - `/api/channels` - get all the channels with necessary info
   - `/api/channels/:channelId` - get single channel info

#### Run altogether
   - `npm start`
