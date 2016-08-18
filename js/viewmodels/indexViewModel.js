"use strict";

define( ["knockout","jquery"], function(ko, $) {

	return function IndexViewModel() {

		var self = this;
		self.parentRef = self;

		// Detect animationend event on header and fadeIn content div
		$("#header").on("animationend webkitAnimationEnd oAnimationEnd", function () {
			$("#content").addClass("visible");
		});
	};
});