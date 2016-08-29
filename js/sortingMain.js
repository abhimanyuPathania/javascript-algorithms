"use strict";

requirejs.config({
	paths: {
		"jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min", "lib/jquery"],
		"knockout":["//cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min", "lib/knockout"],
		"sammy": ["//cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.6/sammy.min", "lib/sammy"],
		"prism": "lib/prism"    
	}
});


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