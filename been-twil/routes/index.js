var express = require('express');
var router = express.Router();
var sys = require('sys');
var twilio = require('../twilio');
var fizzbuzz = require('../fizzbuzz');

// Twilio Credentials 
var accountSid = 'AC02fa58a5636902dbe34e65a810eb6ca4'; 
var authToken = 'ba71e4e99eb8dfd945d8de5d4e04aaab'; 

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'PhoneBuzz' });
});

router.get('/incoming', function(req, res) {
	var twiml = twilio.twiml.build(function(response) {
		response.gather(function(rez) {
			rez.say("Please enter a number greater than zero followed by the star key.");
		}, {action: '/fizzbuzz', method: 'POST', timeout: 5, finishOnKey: '*'})
	});
	res.send(twiml, {'Content-Type':'text/xml'}, 200);
});

router.post('/fizzbuzz', function(req, res) {
	var value = req.body.Digits;
	var twiml = twilio.twiml.build(function(response) {
		response.say(fizzbuzz.generateResponse(value));
		response.say("Thank you. Goodbye.");
		response.hangup();
	});
	res.send(twiml, {'Content-Type': 'text/xml'}, 200);
});

router.post('/outgoing', function(req, res) {
	if (!req.body.To) req.body.To = '+15165672905';
	client.makeCall({

	    to: req.body.To,
	    from: '+15162523246',
	    url: 'http://phonebuzzz.herokuapp.com/incoming',
	    method: 'GET'

	}, function(err, responseData) {
	    if (!err) {
	        console.log(responseData.from);
	    }
	});
});

module.exports = router;
