"use strict";

define([
	"knockout",
	"jquery",
	"lib/text!components/sidebar/sidebarTemplate.html"
], function(ko, $, htmlString){

	function SidebarViewModel(params){
		var self = this;
		var parentRef = params.parentRef;
		var urlMapper = {};

		self.subItemIcon = "keyboard_arrow_right";
		self.toggleSubMenu = function(data, event){

			// Look for parent anchor with class "icon-heading"; 
			// Clicks to these should trigger sammy route(return true)
			// If not then close the submenu
			if(!$(event.target).closest("a.icon-heading").length){
				self.menuItems.forEach(function(item){
					// only items with submenus have the observables
					if (!item.subMenu){
						return;
					}

					// use the text property to identify the correct object
					if(item.text === data.text){
						// toggle
						item.open(!item.open());
					} else {
						item.open(false);
					}
				});
			} else {
				// For some reason the clicks from anchors bubble but 
				// the don't trigger sammy route unless the 'click' event handler
				// returns true indicating default action?
				return true;
			}
		};

		self.dummy = function(){
			console.log("dummy!");
			return true;
		};

		// the 'active' observable properties on items with submenus are redundant
		// since submenus can never be in active state. Those observables always 
		// remain false and are present because of the inablility to conditionally use
		// the "css binding".
		self.menuItems = [
			{
				text: "Sorting",
				icon: "sort",
				subMenu: true,
				open: ko.observable(false),
				active: ko.observable(false),

				subMenuItems: [
					{
						text: "Bubble Sort",
						icon: self.subItemIcon,
						href: "/sorting#bubblesort",
						active: ko.observable(false)
					},

					{
						text: "Insertion Sort",
						icon: self.subItemIcon,
						href: "/sorting#insertionsort",
						active: ko.observable(false)
					},

					{
						text: "Selection Sort",
						icon: self.subItemIcon,
						href: "/sorting#selectionsort",
						active: ko.observable(false)
					}
				]
			},
			{
				text: "Some Other Menu Item",
				icon: "sort",
				subMenu: false,
				href: "/",
				active: ko.observable(false)
			}
		];

		self.handleSortingPageSidebar = function(){
			// this function is only handles the sidebar for the "/sorting" page
			// since that uses sammy.js routing.

			// This is subscriber of the "currentSort" observable of "sortingViewModel"
			// and hence is called when user navigates to different sort.
			var sortSelected = parentRef.currentSort();
			var href = "/sorting#" + sortSelected.toLowerCase();

			// remove active class for each sortpage submenuItem
			Object.keys(urlMapper).forEach(function(menuItemHref){
				if (menuItemHref.indexOf("/sorting") !== -1){
					urlMapper[menuItemHref].subItem.active(false);
				}
			});

			// add the "active" class to current one
			urlMapper[href].subItem.active(true);
		};

		setupSidebar();

		function setupSidebar(){

			var pathname = window.location.pathname;
			var hash = window.location.hash;
			var menuItemHref = pathname; // /sorting#insertionsort or /blah/foo
			var submenuPresent = detectSubmenu(); 

			if(hash){
				menuItemHref = pathname + hash;
			}

			// special case to handle "/sorting" URL
			if(!hash && pathname === "/sorting"){
				menuItemHref = "/sorting#bubblesort";
			}

			// build a URL -> menuItem object mapping

			// The keys are 'href' property used on the menu-item or the 
			// sub-menu-item object.

			// If the 'href' points to a sub-menu item then the value of key
			// is an object having the reference to 'subItem' and the 'item' object
			// from the menuItems and subMenuItems array.
			self.menuItems.forEach(function(item){
				if (item.subMenu){

					// iterate over all the subItem objects
					item.subMenuItems.forEach(function(subItem){

						// object having reference to 'subItem' and the 'item' object.
						urlMapper[subItem.href] = {
							subItem: subItem,
							item: item
						};
					});
				} else {
					// reference to the 'item' object
					urlMapper[item.href] = item;
				}
			});


			if(submenuPresent) {
				//add the active class to sub-menu-item
				urlMapper[menuItemHref].subItem.active(true);

				//open the menu-item dropdown menu
				urlMapper[menuItemHref].item.open(true);
			} else {
				// if the is no submenu; 
				// add the active class to menu-item
				urlMapper[menuItemHref].active(true);
			}
			
			// add aditional handler for "sorting" page's internal routing
			if(pathname.indexOf("/sorting") !== -1){
				parentRef.currentSort.subscribe(self.handleSortingPageSidebar);
			}

			function detectSubmenu(){
				// if the URL has a hash component or the pathname has
				// more than one "/" characters; page is part of a submenu

				// also add special case to handle "/sorting" URL
				if (hash || pathname.split("/").length - 1 > 1 || pathname === "/sorting") {
					return true;
				}

				return false;
			}
		}
	} // end VM

	return {
		viewModel: SidebarViewModel,
		template: htmlString
	};
});