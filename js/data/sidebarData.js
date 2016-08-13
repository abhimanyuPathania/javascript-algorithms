"use strict";

define(["knockout"], function(ko){

	// sidebar menuItems data array used in ko foreach
	var subItemIcon = "keyboard_arrow_right";

	// the 'active' observable properties on items with submenus are redundant
	// since submenus can never be in active state. Those observables always 
	// remain false and are present because of the inablility to conditionally use
	// the "css binding".
	return [
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
});