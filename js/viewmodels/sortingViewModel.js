"use strict";

define( ["knockout", "jquery", "sammy", "helper"],
function(ko, $, Sammy, helper) {

	return function SortingViewModel() {

		var self = this;

		// reference to VM for components
		self.parentRef = self;

		// tracks the current sort page. Updated on page swap via Sammy.
		self.currentSort = ko.observable();

		// controls the sort code in view
		self.displaySort = {
			bubbleSort: ko.observable(false),
			selectionSort: ko.observable(false),
			insertionSort: ko.observable(false),
			mergeSort: ko.observable(false),
			shellSort: ko.observable(false),
			quickSort: ko.observable(false)
		};

		// Object containing lowercase URL mappings to camelCased keys used in code.
		self.URLMapper = {};

		// Keep a sorted copy to be used on page swaps
		self.availableSortsList = Object.keys(self.displaySort).sort();

		// Build URL mapper object from "self.availableSortsList"
		self.availableSortsList.forEach(function(sort){
			self.URLMapper[sort.toLowerCase()] = sort; 
		});

		// Linked to Array size user input
		self.randomArraySize = ko.observable();

		// Tracks the sort types user wants to run on the given sample size.
		self.testBenchSorts = ko.observableArray([]);

		//current list used by the "select-list" component
		self.availableSorts = ko.observableArray(self.availableSortsList);

		// Tracks if self.myWebWorker is ready to run code.
		self.webWorkerSynced= ko.observable(false);

		// This observable along with 'webWorkerSynced' obs controls the run button
		self.enableRunButton = ko.observable(true);

		self.koSelectListRef = [];

		// This runs the sort codes of the sortTypes selected by user
		self.runTestBench = function() {
			self.enableRunButton(false);
			self.myWebWorker.postMessage({
				"cmd": "runCode",
				"arraySize": +self.randomArraySize(),
				"sortTypes": self.testBenchSorts()
			});
		};

		self.stopTestBench = function(){
			self.myWebWorker.terminate();
			self.enableRunButton(true);

			// Remove the "synced" flag since the older WW is terminated.
			self.webWorkerSynced(false);

			// Start a new WW to run any future code. This will "sync" accordingly.
			setupWebWorker();
		};

		self.updateSortPage = function(){
			self.stopTestBench();
			var avSort = self.availableSortsList;
			var newSort = self.currentSort();
			var avSortCopy;

			// Remove current sort type from view
			Object.keys(self.displaySort).forEach(function(sortName){
				self.displaySort[sortName](false);
			});

			//turn-on the observable for selected sort type to display
			self.displaySort[newSort](true);

			
			/*  Reset the testBenchSorts observable array. */
			
			// Remove the choosen sort from list of available sorts
			// availableSortsList is already sorted. Use its copy; remove "newSort";
			// and update the "self.availableSorts" obsArr used by "select-list" component
			avSortCopy = avSort.slice();

			// splice works in place and return the removed items instead
			avSortCopy.splice(avSortCopy.indexOf(newSort), 1);
			self.availableSorts(avSortCopy);

			// make it the only item in choosen sort
			self.testBenchSorts([newSort]);
		};

		// Make "self.updateSortPage" subscriber to "currentSort" observable.
		self.currentSort.subscribe(self.updateSortPage);


		// =================================================================== //

		// Add the click event on document to close select-list dropdown on
		// outside clicks.
		$(document).click(function(event){
			
			if (helper.closeKoSelectList($(event.target))){

				// every ko-select-list component add a reference to its VM
				// in parent's(sortingViewModel) self.koSelectListRef property.
				
				// Loop over all VMs and setting "dropdownOpen" property to false
				// will close them.
				self.koSelectListRef.forEach(function(selectListVM){
					selectListVM.dropdownOpen(false);
				});
			}
		});

		// Start the WebWorker
		setupWebWorker();

		function setupWebWorker() {
			// This function is called to start the WebWorker thread.

			// It can be called again after terminating the WebWorker, when
			// user clicks on "STOP" button. Since a terminated WW cannot be
			// used to run the code again.

			// Same properties are used to refernce to the WebWorker
			self.myWebWorker = new Worker("js/code/sortPage.js");
			self.myWebWorker.onmessage = function(e){
				if(e.data.cmd === "randomArray"){
					console.log("randomArray", e.data.value);
				}

				if(e.data.cmd === "sortedArray"){
					console.log("sortedArray", e.data.value);
				}

				if(e.data.cmd === "result"){
					console.log(e.data.value.sortType, ":", e.data.value.timeTaken, "ms");
					self.enableRunButton(true);
				}

				// (self.webWorkerSynced && self.enableRunButton) enables the 'Run' button
				if(e.data.cmd === "synced"){
					self.webWorkerSynced(true);
				}
			};
		}

		Sammy(function() {
			this.get("#:sortSelected", function() {
				var sortSelected = this.params.sortSelected;

				// update the currentSort observable
				self.currentSort(self.URLMapper[sortSelected]);
			});

			this.get("/sorting", function() {
				//show bubblesort by default
				this.app.runRoute("get", "#bubblesort");
			});

		}).run();

	};// End VM

});