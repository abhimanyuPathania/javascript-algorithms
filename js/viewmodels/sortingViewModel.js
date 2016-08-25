"use strict";

define( ["knockout", "jquery", "sammy", "helper"],
function(ko, $, Sammy, helper) {

	return function SortingViewModel() {

		var self = this;

		// reference to VM for components
		self.parentRef = self;

		// Use helper function in bindings 
		self.helper = helper;

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

		// Tracks the sort types user wants to run on the set array size.
		self.testBenchSorts = ko.observableArray([]);

		//current list used by the "select-list" component
		self.availableSorts = ko.observableArray(self.availableSortsList);

		// Tracks if self.myWebWorker is ready to run code.
		self.webWorkerSynced= ko.observable(false);
		// This observable along with 'webWorkerSynced' obs controls the run button.
		// The "run" button is only enabled when both are true.
		self.enableRunButton = ko.observable(true);

		// List of VMs of "ko-select-list" components on the page
		self.koSelectListRef = [];

		// Observable controlling "show" class on "#sorting-test-bench-error"
		self.showTestBenchError = ko.observable(false);

		// Text content of error
		self.testBenchError = ko.observable();

		// Sort currently being run by WW. Updated via message from the WW which is sent
		// before the code is run.
		self.currentWebWorkerSort = ko.observable();

		// ObsArr of result objects for sorts run by the WebWorker.
		self.testBenchResults = ko.observableArray();

		// This controls the "afterRender" function passed to foreach data binding for the
		// "testBenchResults" obsArr; which is only called if this flag is true.
		self.animateSortBarFlag = false;

		// Controls the "show" class on "#sorting-test-bench-status" div
		self.showTestBenchStatus = ko.observable(false);



		// This runs the sort codes of the sortTypes selected by user
		self.runTestBench = function() {

			var arraySize = $.trim(self.randomArraySize());// entered by user in text input
			var checkInput = true;

			// If user does not enter a valid positive integer; show error.
			if (!helper.isPositiveInteger(arraySize)){
				self.testBenchError("Please enter a valid value for array size");
				checkInput = false;
			}

			// If user selects no sorting algoritm; show error.
			if (!self.testBenchSorts().length){
				self.testBenchError("Please select atleast one sorting algorithm");
				checkInput = false;
			}

			// show the error and return
			if (!checkInput) {
				self.showTestBenchError(true);
				helper.scrollToBottom();
				return;
			}

			// remove error div if there
			self.showTestBenchError(false);

			// remove previous results
			self.currentWebWorkerSort(null);
			self.testBenchResults([]);

			// Reset the animate flag
			self.animateSortBarFlag = false;

			// Disable the "run" button while the sort code runs.
			self.enableRunButton(false);

			// Message the WebWorker to run the code.
			self.myWebWorker.postMessage({
				"cmd": "runCode",
				"arraySize": +arraySize, // convert to number
				"sortTypes": self.testBenchSorts()
			});

			// Show the test bench status
			self.showTestBenchStatus(true);
		};

		self.stopTestBench = function(){
			self.myWebWorker.terminate();
			self.enableRunButton(true);

			// Remove test bench status
			self.showTestBenchStatus(false);

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

			// scroll to top of the page
			helper.scrollToTop();
		};

		self.animateSortBar = function(domArr, dataItem){
			if(!self.animateSortBarFlag){
				return;
			}

			// Filter ".sort-stat" from the domArr supplied be KO and use it as
			// a context to select the ".sort-stat-bar"
			var bar = $(".sort-stat-bar", $(domArr).filter(".sort-stat"));

			// Transition width only seems to work with a slight delay.
			// Still looks better than  $.animate.
			setTimeout(function(){
				bar.css("width", dataItem.width);
			}, 100);
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


		function setupWebWorker() {
			// This function is called to start the WebWorker thread.

			// It can be called again after terminating the WebWorker, when
			// user clicks on "STOP" button. Since a terminated WW cannot be
			// used to run the code again.

			// Same properties are used to refernce to the WebWorker.
			self.myWebWorker = new Worker("dist/js/code/sortPage.js");

			self.myWebWorker.onmessage = function(e){

				// if(e.data.cmd === "randomArray" || e.data.cmd === "sortedArray"){
				// 	console.log(e.data.value);
				// }


				if(e.data.cmd === "currentSortStatus"){
					self.currentWebWorkerSort(e.data.value);
				}

				if(e.data.cmd === "result"){
					self.testBenchResults.push(e.data.value);
				}

				// Enable the "run" button when all selected sorts end running
				if(e.data.cmd === "complete"){
					self.enableRunButton(true);
					giveWidthTestBenchResults(e.data.value.max, e.data.value.min);
				}

				// (self.webWorkerSynced && self.enableRunButton) enables the 'Run' button
				if(e.data.cmd === "synced"){
					self.webWorkerSynced(true);
				}
			};
		}


		function giveWidthTestBenchResults(max, min){

			// Called by myWebWorker on the "complete" command by WW.

			var testBenchResultsArr = self.testBenchResults();

			// These variables track if the "fastest/slowest" classes have been applied
			// so that they are applied only once.
			var fastestApplied = false;
			var slowestApplied = false;

			testBenchResultsArr.forEach(function(resultObj){
				resultObj.width = Math.ceil((resultObj.time/max) * 100) + "%";
				
				// Don't apply "fastest/slowest" classes if min/max times are equal;
				if (min !== max){
					if(resultObj.time === min && testBenchResultsArr.length > 1 && !fastestApplied){
						resultObj.fastest = true;
						fastestApplied = true;
					}

					// Don't apply slowest styles unless user runs atleast 3 sorts
					if(resultObj.time === max && testBenchResultsArr.length > 2 && !slowestApplied){
						resultObj.slowest = true;
						slowestApplied = true;
					}
				}

			});

			// Reset the observable array render views again
			self.testBenchResults([]);

			// Set the animate flag to animate sort bars this time
			// sot that self.animateSortBar function can animate sort bars.
			self.animateSortBarFlag = true;

			// hide test bench status div
			self.showTestBenchStatus(false);

			// Bind new values. This will trigger the binded "afterRender" function,
			// self.animateSortBar
			self.testBenchResults(testBenchResultsArr);

			// scroll to bottom to show results
			helper.scrollToBottom();
		}




		// Start the WebWorker
		setupWebWorker();

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