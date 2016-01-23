var express = require('express');
var router = express.Router();
var sys = require('sys');
var twimlGen = require('../twilio');
var fizzbuzz = require('../fizzbuzz');
var twilio = require('twilio');

// Twilio Credentials 
var accountSid = 'AC02fa58a5636902dbe34e65a810eb6ca4'; 
var authToken = 'ba71e4e99eb8dfd945d8de5d4e04aaab'; 

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PhoneBuzz' });
});

router.post('/handleCall', function(req, res) {
	var twiml = twimlGen.twiml.build(function(response) {
		response.gather(function(rez) {
			rez.say("Please enter a number greater than zero and the star key.", { voice: 'woman', language: 'en-gb' });
		}, {action: '/fizzbuzz', method: 'POST', timeout: 5, finishOnKey: '*'})
	});
	if (twilio.validateRequest(authToken, req.headers['x-twilio-signature'], 'http://phonebuzzz.herokuapp.com/handleCall', req.body)){
		res.send(twiml, {'Content-Type': 'text/xml'}, 200);
	} else {
        res.writeHead(403, { 'Content-Type':'text/plain' });
    }
});

router.post('/fizzbuzz', function(req, res) {
	var value = req.body.Digits;
	var twiml = twimlGen.twiml.build(function(response) {
		response.say(fizzbuzz.generateResponse(value), { voice: 'woman', language: 'en-gb' });
		response.say("Thank you, goodbye.", { voice: 'woman', language: 'en-gb' });
		response.hangup();
	});
	if (twilio.validateRequest(authToken, req.headers['x-twilio-signature'], 'http://phonebuzzz.herokuapp.com/fizzbuzz', req.body)){
		res.send(twiml, {'Content-Type': 'text/xml'}, 200);
	} else {
        res.writeHead(403, { 'Content-Type':'text/plain' });
        res.end('you are not twilio - take a hike.');
    }
});

router.post('/outgoing', function(req, res) {
	if (!req.body.to) req.body.to = '+15165672905';
	client.makeCall({
	    to: req.body.to,
	    from: '+15162523246',
	    url: 'http://phonebuzzz.herokuapp.com/handleCall',
	    method: 'POST'
	}, function(err, responseData) {
	    if (!err) {
	        console.log(responseData.from);
	    }
	    res.end();
	});
});

module.exports = router;
