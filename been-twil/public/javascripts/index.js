(function() {
	$('#number-form').submit(function(evt) {
		evt.preventDefault();
		var number = $("#mobile-number").intlTelInput("getNumber");
		$.post(
			"/outgoing",
			{ To: number }
		).done(function(response) {

		}).fail(function(responseObject) {

		});
	});
})();