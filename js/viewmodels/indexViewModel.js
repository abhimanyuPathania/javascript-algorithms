"use strict";

define( ["knockout","jquery"], function(ko, $) {

	return function IndexViewModel() {

		var self = this;
		self.parentRef = self;

		var header = $("#header");

		// Detect animationend event on header and fadeIn content div
		header.on("animationend webkitAnimationEnd oAnimationEnd", function () {
			$("#content").addClass("visible");
		});

		// show header when the script has been loaded and the "animationend" event has
		// been attached
		header.css("display", "block");
	};
});