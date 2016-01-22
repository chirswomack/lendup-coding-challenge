var express = require('express');
var router = express.Router();
var sys = require('sys');
var twilio = require('../twilio');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res) {
	var twiml = twilio.twiml.build(function(rez) {
		rez.say("Holy shit, batman!", { loop: 10, voice: 'woman', language: 'en-gb' });
		rez.hangup();
	});
	res.send(twiml, {'Content-Type':'text/xml'}, 200);
});

module.exports = router;
