"use strict";


require(["config"], function(){

	require([
		"knockout",
		"viewmodels/sortingViewModel",
		"components/sidebar/sidebarViewModel",
		"components/select_list/selectListViewModel",
		"helper",
		"prism",
		"lib/domReady!"
	], function(ko, SortingViewModel, sidebarComponent, selectListComponent, helper) {
		ko.components.register("sidebar", sidebarComponent);
		ko.components.register("select-list", selectListComponent);
		ko.applyBindings(new SortingViewModel());
		helper.showPage();
	});

});

