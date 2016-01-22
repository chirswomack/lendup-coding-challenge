var fizzbuzz = (function() {
	var _fizzbuzz = {};

	_fizzbuzz.generateResponse = function(upTo) {
		var output = "";
		for (var i = 1; i <= upTo; i++) {
			var item = "";
			item += (i % 3) === 0 ? "Fizz" : "";
			item += (i % 5) === 0 ? "Buzz" : "";
			output += item ? item: i.toString();
			if (i < upTo) output += ", ";
		}
		return output;
	}

	Object.freeze(_fizzbuzz);
	return _fizzbuzz;

})();

module.exports = fizzbuzz;