"use strict";

require(["config"], function(){
	
	require(
		[
			"knockout",
			"viewmodels/indexViewModel",
			"components/sidebar/sidebarViewModel",
			"helper",
			"lib/domReady!"
		],
		
		function(ko, IndexViewModel, sidebarComponent, helper) {
			ko.components.register("sidebar", sidebarComponent);
			ko.applyBindings(new IndexViewModel());
			helper.showPage();
		});
});



