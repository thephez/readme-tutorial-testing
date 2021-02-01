const Dash = require('dash');
const tutorials = require('./tutorials');

const client = new Dash.Client();
tutorials.checkNetworkConnection(client).then((x) => (console.log(x)));
