var express = require('express');
var router = express.Router();
var sys = require('sys');
var twilio = require('../twilio');
var fizzbuzz = require('../fizzbuzz');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res) {
	var twiml = twilio.twiml.build(function(response) {
		response.gather(function(rez) {
			rez.say("Please enter a number greater than zero followed by the star key.", { voice: 'man', language: 'en-gb' });
		}, {action: '/fizzbuzz', method: 'POST', timeout: 10, finishOnKey: '*'})
	});
	res.send(twiml, {'Content-Type':'text/xml'}, 200);
});

router.post('/fizzbuzz', function(req, res) {
	var value = req.body.Digits;
	var twiml = twilio.twiml.build(function(response) {
		response.say(fizzbuzz.generateResponse(value), { voice: 'man', language: 'en-gb' });
		response.say("Goodbye", { voice: 'woman', language: 'en-gb' });
		response.hangup();
	});
	res.send(twiml, {'Content-Type': 'text/xml'}, 200);
});

module.exports = router;
