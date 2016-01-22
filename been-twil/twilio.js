twilio = Object.create({})
twilio.twiml = {
  build: function(fn) {
    var prolog = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    var Buffer = function(level) {
      var buffer = "";
      var indent = function(i) { return new Array((i * 2) + 1).join(" ") }
      var level  = level || 1;
      var append = function(str) {
        buffer += indent(++level) + str + "\n";
        level--;
      }

      var toAttributes = function(obj) {
        var string = "";
        for (key in obj) { string += " " + key + "=" + "\"" + obj[key] + "\"" }
        return string;
      }

      var commonElement = function(verb) {
        return function(str, attributes) {
          append("<" + verb + toAttributes(attributes) + ">" + str + "</" + verb + ">")
        }
      }

      var emptyElement = function(verb) {
        return function(attributes) { append("<" + verb + toAttributes(attributes) + " />") }
      }

      var containerElement = function(verb) {
        return function(fn, attributes) {
          var buffer = new Buffer(level + 2);
          append('<'+ verb + toAttributes(attributes) + '>');
          fn(buffer);
          level -= 2;
          append(buffer.emit().replace(/\n$/, ''));
          level += 2;
          append('</' + verb + '>');
        }
      }

      this.dial = function(arg, attributes) {
        switch(typeof arg) {
          case 'function':
            return containerElement('Dial')(arg, attributes);
            break;
          case 'string':
            return commonElement('Dial')(arg, attributes);
            break;
        }
      }

      this.say        = commonElement('Say');
      this.play       = commonElement('Play');
      this.redirect   = commonElement('Redirect');
      this.number     = commonElement('Number');
      this.client     = commonElement('Client');
      this.conference = commonElement('Conference');
      this.sms        = commonElement('Sms');

      this.hangup     = emptyElement('Hangup');
      this.reject     = emptyElement('Reject');
      this.record     = emptyElement('Record');
      this.pause      = emptyElement('Pause');

      this.gather     = containerElement('Gather');

      this.emit       = function() { return buffer }
    }

    var buffer = new Buffer;

    fn(buffer);

    return prolog + "<Response>\n" + buffer.emit() + "</Response>";
  }
}

module.exports = twilio;