(function() {
	$('#number-form').submit(function(evt) {
		evt.preventDefault();
		var phoneNumber = $("#mobile-number").intlTelInput("getNumber"),
			formData = helpers.getFormData(this),
			delay;
		delay = (formData.hours * 3600) + (formData.minutes * 60) + formData.seconds;
		if (delay == 00) {
			makeCall(phoneNumber);
		} else {
			$('.main').countdown({until: delay, description: "Until the call", onExpiry: makeCall});
		}
	});

	makeCall = function(phoneNumber) {
		$.post(
			"/outgoing",
			{ to: phoneNumber }
		).done(function(response) {
			location.reload();
		}).fail(function(responseObject) {

		});
		alert("Call Made");
	}
})();