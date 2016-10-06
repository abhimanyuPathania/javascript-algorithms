"use strict";


require(["config"], function(){

	var pathname = location.pathname;
	
	var masterViewModelData = {
		"/": {
			title: "JavaScript Algorigthms",
			stylesheets: ["../dist/css/index.css"]
		},

		"/sorting": {
			title: "Sorting",
			stylesheets: ["../dist/css/sorting.css"],
			koComponents: {
				"select-list": true
			}
		}
	};




	if (pathname === "/"){
		require(
			[
				"knockout",
				"viewmodels/masterViewModel",
				"components/page-content/viewmodels/indexViewModel",
				"lib/text!components/page-content/templates/index.html",
				"helper",
				"lib/domReady!"
			],
		
		function(ko, MasterViewModel, IndexViewModel, indexTemplateString, helper) {
			
			ko.components.register("page-content", {	
				viewModel: IndexViewModel,
				template: indexTemplateString
			});

			ko.applyBindings(new MasterViewModel(masterViewModelData[pathname]));
			helper.showPage();
		});
	}

/*	if (pathname === "/primes"){
		require(
			[
				"knockout",
				"viewmodels/masterViewModel",
				"components/page-content/viewmodels/primesViewModel",
				"lib/text!components/page-content/templates/primes.html",
				"helper",
				"lib/domReady!"
			],
		
		function(ko, MasterViewModel, PrimeViewModel, primeTemplateString, helper) {
			
			ko.components.register("page-content", {	
				viewModel: PrimeViewModel,
				template: primeTemplateString
			});

			ko.applyBindings(new MasterViewModel(masterViewModelData[pathname]));
			require(["prism"], function(){
				// show page after running "prism" script
				helper.showPage();
			});	
		});
	}*/

	if (pathname === "/sorting") {
		require([
			"knockout",
			"viewmodels/masterViewModel",
			"components/page-content/viewmodels/sortingViewModel",
			"lib/text!components/page-content/templates/sorting.html",
			"components/select-list/selectListViewModel",
			"helper",
			"lib/domReady!"
		], function(ko, MasterViewModel, SortingViewModel, sortingTemplateString, selectListComponent, helper){

			ko.components.register("page-content", {	
				viewModel: SortingViewModel,
				template: sortingTemplateString
			});

			ko.components.register("select-list", selectListComponent);			
			ko.applyBindings(new MasterViewModel(masterViewModelData[pathname]));
			
			// "prism" must run after the "applyBindings" call. Since it injects the "page-content"
			// component which has the code blocks. Else the script runs before the HTML
			// is inserted into page. 
			require(["prism"], function(){
				// show page after running "prism" script
				helper.showPage();
			});			
		});
	}
});

