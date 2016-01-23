(function() {
	$('#number-form').submit(function(evt) {
		evt.preventDefault();
		var phoneNumber = $("#mobile-number").intlTelInput("getNumber"),
			formData = helpers.getFormData(this),
			delay;
		delay = (formData.hours * 3600) + (formData.minutes * 60) + formData.seconds;
		$.post(
			"/outgoing",
			{ to: phoneNumber,
			  delay: delay }
		).done(function(response) {

		}).fail(function(responseObject) {

		});
	});
})();