"use strict";

define([
	"knockout",
	"jquery",
	"helper",
	"lib/text!components/select-list/selectListTemplate.html"
], function(ko, $, helper, htmlString){

	function SelectListViewModel(params){
		var self = this;

		self.masterViewModel = params.masterViewModel;

		// references to two observable arrays tracking
		// selected/available options in the parent viewmodel(sortingViewModel)
		self.options = params.options; 
		self.selectedOptions = params.selectedOptions;

		// multiple/single select list
		self.multiple = params.multiple;

		// Reference to parent VM
		self.parentRef = params.parentRef;

		// observable to add/remove the "open" class on select-list
		// false = closed
		self.dropdownOpen = ko.observable(false);

		self.toggleDropdown = function(){
			// Only those click events reach the ".ko-select-list" wrapper div
			// which need to triggle the toggle. Rest are stopped from bubbling.
			self.dropdownOpen(!self.dropdownOpen()); //toggle
		};

		self.removeItem = function(data){
			// since applied on individual ui elements rendered from
			// self.selectedOptions; data = sort

			// Does not bubble

			self.selectedOptions.remove(data);
			self.options.push(data);
			self.options.sort();
		};

		self.addItem = function(data){
			// Does not bubble

			self.options.remove(data);
			self.selectedOptions.push(data);
		};

		self.getListText = function(s){
			
			// if function is required to get text to display
			if (params.listTextFunction){
				return params.listTextFunction(s);
			} else {
				// else use the key's strings
				return s;
			}
		};

		// =================================================================== //

		// Add reference to VM of select-list to master's "koSelectListRef" property
		self.masterViewModel.koSelectListRef.push(self);
	}

	return {
		viewModel: SelectListViewModel,
		template: htmlString
	};
});