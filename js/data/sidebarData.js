"use strict";

define(["knockout"], function(ko){

	// sidebar menuItems data array used in ko foreach
	var subItemIcon = "keyboard_arrow_right";

	// the 'active' observable properties on items 'with' submenus are redundant.
	// Since items with submenus can never be in active state. Those observables always 
	// remain false and are present because of the inablility to conditionally use
	// the "css" ko binding.

	var sectionData = {
		"/": {
			sections: false,
			sammy: false, 
			defaultSection: null,
			urlHashMap: null
		},

		"/sorting": {
			sections: true,
			sammy: true, // if sammyjs routing is to be used

			// default section displayed. User coming to "/sorting"
			// will be redirected to "/sorting#bubblesort"
			defaultSection: "bubblesort",

			urlHashMap: {
				bubblesort: "bubbleSort",
				insertionsort: "insertionSort",
				mergesort: "mergeSort",
				quicksort: "quickSort",
				selectionsort: "selectionSort",
				shellsort: "shellSort"
			}
		}
	};


	var sidebarArrayData = [
		{
			text: "Sorting",
			icon: "sort",
			subMenu: true,
			open: ko.observable(false),
			active: ko.observable(false),

			subMenuItems: [
				{
					text: "Bubble Sort",
					icon: subItemIcon,
					href: "/sorting#bubblesort",
					active: ko.observable(false)
				},

				{
					text: "Insertion Sort",
					icon: subItemIcon,
					href: "/sorting#insertionsort",
					active: ko.observable(false)
				},

				{
					text: "Merge Sort",
					icon: subItemIcon,
					href: "/sorting#mergesort",
					active: ko.observable(false)
				},

				{
					text: "Quick Sort",
					icon: subItemIcon,
					href: "/sorting#quicksort",
					active: ko.observable(false)
				},

				{
					text: "Selection Sort",
					icon: subItemIcon,
					href: "/sorting#selectionsort",
					active: ko.observable(false)
				},

				{
					text: "Shell Sort",
					icon: subItemIcon,
					href: "/sorting#shellsort",
					active: ko.observable(false)
				}
			]
		}
	]; // end data object


	// resulting object of the module import
	var sidebarData = {

		data: sidebarArrayData,

		getSectionData: function(pathname){

			var sectionObj = sectionData[pathname];
			var urlHashMap = sectionObj.urlHashMap;

			// create an "observables" obejct on to be returned section datab oject;
			// this object contains the camel-cased section names to their corresponding
			// observables. Ex, the "sectionObj.observables" obj for "/soritng" would look like
				
				/*
					{
						bubbleSort: ko.observable(false),
						selectionSort: ko.observable(false),
						insertionSort: ko.observable(false),
						mergeSort: ko.observable(false),
						shellSort: ko.observable(false),
						quickSort: ko.observable(false)
					}
				*/

			// only add the "observables" object when the page is going to use
			// sammyjs for front-end routing
			if (sectionObj.sammy){
				sectionObj.observables = {};

				Object.keys(urlHashMap).forEach(function(urlHash){
					// create properties with the preferred camelcase names
					sectionObj.observables[urlHashMap[urlHash]] = ko.observable(false);
				});
			}


			// return the complete section data object
			return sectionObj;
		},

		getSidebarKoUrlViewsMap: function(){

			// The "sidebarArrayData" array is used to generate HTML for "sidebar".
			// This is mapping from complete url(ex. "/sorting#quicksort") to the 
			// object used to generate HTML/ and Views for that part of sidebar.
			// This is used in "setupSidebar" to apply correct classes.

			//Ex.
				/*
				{
					"/sorting#quicksort": {
						text: "Quick Sort",
						icon: subItemIcon,
						href: "/sorting#quicksort",
						active: ko.observable(false)
					}
				}
				*/

			var result = {};

			// build a URL -> menuItem object mapping

			// The keys are 'href' property used on the menu-item or the 
			// sub-menu-item object.

			// If the 'href' points to a sub-menu item then the value of key
			// is an object having the reference to 'subItem' and the 'item' object
			// from the menuItems and subMenuItems array.
			sidebarArrayData.forEach(function(item){
				if (item.subMenu){

					// If item has submenu result is an object containing
					// references to the encompassing item obj and the 
					// sub-item oject.
					// Though this leads to thereferences to such "item obj"(/sorting) 
					// to be with every sub-item object's href.

					// The above example for "quicksort" sub menu item becomes:
					/*
					{ ...

						"/sorting#quicksort": {
							subItem: {
								text: "Quick Sort",
								icon: subItemIcon,
								href: "/sorting#quicksort",
								active: ko.observable(false)
							},

							item: {
								text: "Sorting",
								icon: "sort",
								subMenu: true,
								open: ko.observable(false),
								active: ko.observable(false),

								subMenuItems: [
									{
										text: "Bubble Sort",
										icon: subItemIcon,
										href: "/sorting#bubblesort",
										active: ko.observable(false)
									},
									...
								]
							}
						}
						...
					}
					*/

					// iterate over all the subItem objects
					item.subMenuItems.forEach(function(subItem){

						// object having reference to 'subItem' and the 'item' object.
						result[subItem.href] = {
							subItem: subItem,
							item: item
						};
					});
				} else {
					// reference to the 'item' object
					result[item.href] = item;
				}
			});

			return result;
		}
	};

	return sidebarData;
});