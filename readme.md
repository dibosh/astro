#### Setup
   - `npm install -g gulp bower pm2`
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

##### API for Frontend
   - `/api/channels` - get all the channels with necessary info (paginated)
   - `/api/channels/all` - get all the channels at once
   - `/api/channels/:channelId` - get single channel info
   - `/api/channels/:channelId/events` - get single channel events
   - `/auth/facebook` - facebook login
   - `/auth/logout` - logs out and deletes an existing user
   - `/user/me` - `GET` to get user profile, `PUT` to update
   - `/events/all` - get all events for all channels within time specified
   by `startDate` & `endDate`

#### Run both Frontend and Backend
   - `npm start`

#### Build and Run for Production Environment
   - `gulp`
   - `npm install pm2 -g`
   - `pm2 start server/index.js -i 4` (spin up 4 instances and let pm2 load
   balance)

Check out the [live](http://ec2-18-217-186-253.us-east-2.compute.amazonaws.com:8080) site.
