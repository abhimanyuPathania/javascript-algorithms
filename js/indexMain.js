"use strict";

requirejs.config({
	paths: {
		"jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min", "lib/jquery"],
		"knockout":["//cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min", "lib/knockout"]     
	}
});


require(
	["knockout", "viewmodels/indexViewModel", "components/sidebar/sidebarViewModel", "lib/domReady!"],
	
	function(ko, IndexViewModel, sidebarComponent) {
		ko.components.register("sidebar", sidebarComponent);
		ko.applyBindings(new IndexViewModel());
	}
);

