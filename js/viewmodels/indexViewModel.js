"use strict";

define( ["knockout","jquery"], function(ko, $) {

	return function IndexViewModel() {

		var self = this;
		self.parentRef = self;

		var banner = $("#banner");

		// Detect animationend event on header and fadeIn content div
		banner.on("animationend webkitAnimationEnd oAnimationEnd", function () {
			$("#caption-footer-wrapper").addClass("visible");
		});

		// show header when the script has been loaded and the "animationend" event has
		// been attached
		banner.css("display", "flex");
	};
});