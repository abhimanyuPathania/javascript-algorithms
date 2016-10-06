"use strict";

define( ["knockout", "jquery", "sammy", "helper"],

function(ko, $, Sammy, helper) {

	return function PrimesViewModel(params) {

		var self = this;

		// reference for sub components
		self.pageContentViewModel = self;

		// reference to the MasterViewModel
		self.masterViewModel = params.masterViewModel;

		self.currentActiveSection = self.masterViewModel.currentActiveSection;

		self.displaySection = self.masterViewModel.sectionData.observables;
	};// End VM

});