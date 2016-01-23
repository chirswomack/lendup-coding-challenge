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

router.post('/handleCall', function(req, res) {
	var twiml = twilio.twiml.build(function(response) {
		response.gather(function(rez) {
			rez.say("Please enter a number greater than zero and the star key.", { voice: 'woman', language: 'en-gb' });
		}, {action: '/fizzbuzz', method: 'POST', timeout: 5, finishOnKey: '*'})
	});
	res.send(twiml, {'Content-Type':'text/xml'}, 200);
});

router.post('/fizzbuzz', function(req, res) {
	var value = req.body.Digits;
	var twiml = twilio.twiml.build(function(response) {
		response.say(fizzbuzz.generateResponse(value), { voice: 'woman', language: 'en-gb' });
		response.say("Thank you, goodbye.", { voice: 'woman', language: 'en-gb' });
		response.hangup();
	});
	res.send(twiml, {'Content-Type': 'text/xml'}, 200);
});

router.post('/outgoing', function(req, res) {
	if (!req.body.to) req.body.to = '+15165672905';
	setTimeout(function(){
		client.makeCall({

	    to: req.body.to,
	    from: '+15162523246',
	    url: 'http://phonebuzzz.herokuapp.com/handleCall',
	    method: 'POST'

		}, function(err, responseData) {
		    if (!err) {
		        console.log(responseData.from);
		    }
		});
	}, req.body.delay*1000)

});

module.exports = router;
