const lit = require('lit-illumination-technology');
const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth')
const ConfigParser = require('configparser');

const app = express();

const config = new ConfigParser();
config.read('/home/pi/.lit/ai/config.ini');

const port = config.getInt('General', 'port');
let users = {};
users[config.get('General', 'username')] = config.get('General', 'password');

app.use(bodyParser.json());
app.use(basicAuth({
    users: users,
    unauthorizedResponse: getUnauthorizedResponse
}))
function getUnauthorizedResponse(req) {
        return req.auth
            ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
            : 'No credentials provided'
}
app.listen(port, () => console.log(`LIT AI listening on port ${port}!`));;

app.get('/', (req, res) =>  res.send("HI"));
app.post('/ai_action', function (req, res) {
    json = req.body;
    action = json['queryResult']['action'];
    data = json['queryResult']['parameters'];
    if (action == 'Lights') {
        effect = data['effect'];
        args = data;
        delete args.effect;
        if(args.range) {
            args['ranges'] = [args.range];
            delete args.range;
        }
        let i = 1
        while(('range'+i) in args) {
            let range = args['range'+i];
            if(range)
                args['ranges'] = [range];
            delete args['range'+i];
            i++;
        }
        console.log("Starting " + effect + " ("+JSON.stringify(args)+")");
        lit.start(effect, args, function(data, error) {
            if(error) {
                console.log("Error starting " + effect + " ("+JSON.stringify(args)+"): " + error);
                return res.status(500).send(error);
            }
            response = JSON.stringify({speech: data['result'], displayText: data['result']});
            res.send(response);
        })
    }
});
