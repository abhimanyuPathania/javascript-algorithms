"use strict";

define(
	[
		"knockout",
		"jquery",
		"data/sidebarData",
		"sammy",
		"helper"
	], function(ko, $, sidebarData, Sammy, helper) {

	return function MasterViewModel(pageData) {

		var self = this;

		var pathname = location.pathname;

		// reference for "page-content" component
		self.masterRef = self;

		// set title
		document.title = pageData.title;

		// reference to ViewModel for the "page-content" component
		self.pageContentViewModel = ko.observable();

		// Tracks current section on sammy pages
		// This observable can be subscribed by the "methods" of the pageContentViewModel
		// to run extra code on swithching sections
		self.currentActiveSection = ko.observable();

		// This array is used to generate Views for the "sidebar"
		self.sidebarArrayData = sidebarData.data;

		// this url-views map is used in "setupSidebar" to apply "open"/"active"
		// classes to the sidebar items
		self.sidebarUrlViewsMap = sidebarData.getSidebarKoUrlViewsMap();

		// page relevant key for "sidebarUrlViewsMap"
		self.sidebarUrlViewsMapKey;

		// if the "pathname" address has sections, uses sammy, the observables
		// to switch section being viewed, url "hash" location to the section observables map
		self.sectionData = sidebarData.getSectionData(pathname);

		// if page uses sammyjs for front-end routing
		self.sammyRouter = false;

		// List of ViewModels of "ko-select-list" components on the page
		self.koSelectListRef = [];

		// Takes "text" from urlMapper's item. Updated on reload
		self.navbarText = ko.observable();

		// Tracks "show-sidebar" class on "#sidebar" div
		self.showSidebar = ko.observable(false);

		// Material icon used for "sub-menu-items"
		self.subItemIcon = "keyboard_arrow_right";

		// add sammy routing only if required
		if (self.sectionData.sammy) {

			// Single sammyjs configuration for entire app
			// "run" is not called here
			self.sammyRouter = Sammy(function() {
				
				var sammyExp = pathname + "#:sectionSelected";
				var sammyDefaultRoute = pathname + "#" + self.sectionData.defaultSection;

				this.get(sammyExp, function() {
					var sectionSelected = this.params.sectionSelected;
					var sectionObservables = self.sectionData.observables;
					var sectionObsKey = self.sectionData.urlHashMap[sectionSelected];
					
					// remove all sections from views
					Object.keys(sectionObservables).forEach(function(key){
						sectionObservables[key](false);
					});

					// update show the selected section
					sectionObservables[sectionObsKey](true);

					// update the currentActiveSection observable
					self.currentActiveSection(sectionObsKey);
				});

				this.get(pathname, function() {
					//show "defaultSection" by default
					this.app.runRoute("get", sammyDefaultRoute);
				});
			});
		}
	

		self.toggleSidebar = function(){
			// toggle observable tracking class "show-sidebar"
			self.showSidebar(!self.showSidebar());
		};

		self.toggleSubMenu = function(data, event){

			// Look for parent anchor with class "icon-heading"; 
			// Clicks to these should trigger sammy route(return true)
			// If not then close the submenu
			
			if(!$(event.target).closest("a.icon-heading").length){
				self.sidebarArrayData.forEach(function(item){
					// only items with submenus have the observables
					if (!item.subMenu){
						return;
					}

					// use the text property to identify the correct object
					if(item.text === data.text){
						// toggle
						item.open(!item.open());
					} else {
						// close the rest
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

		self.updateSidebarOnSammyPage = function(){
			
			// this method handles the sidebar views pages using sammyjs

			// This is subscriber of the "currentActiveSection" observable
			// and hence is called when user navigates to different section.

			var viewsMap = self.sidebarUrlViewsMap;

			if (!self.sectionData.sammy){
				return;
			}

			// This subscriber function is called when
			//		> url changes when user visits or changes section
			//		> That causes sammy router to update currentActiveSection obs
			//		> which on updating calls this function

			// The url is always updated before this subscriber is called

			// update the side "self.sidebarUrlViewsMapKey" property to reflect the
			// updated URL
			setSidebarUrlViewsMapKey();

			// remove active class for each sub menu item
			Object.keys(self.sidebarUrlViewsMap).forEach(function(key){

				// remove all "active" subitems
				if (viewsMap[key].subItem){
					viewsMap[key].subItem.active(false);
				}
			});

			// add the "active" class to current one
			viewsMap[self.sidebarUrlViewsMapKey].subItem.active(true);
		};

		self.runMasterViewModel = function(){
			//This method kicks off the functionality for the "MasterViewModel"

			// add page specific stylesheets
			addStylesheets();

			// set urlKey for "sidebarUrlViews" object
			setSidebarUrlViewsMapKey();

			// initial setup for sidebar
			setupSidebar();

			// if page  has a "select-list" KO component; add event handler
			if (pageData.koComponents && pageData.koComponents["select-list"]){
				setCloseKoSelectListEventHandler();
			}

			// run the sammy router if present
			if (self.sammyRouter){
				
				// add extra subsriber to handle sidebar view when sammyjs is used
				self.currentActiveSection.subscribe(self.updateSidebarOnSammyPage);
				
				// run sammy
				self.sammyRouter.run();
			}
			
		};

		// Run VM
		self.runMasterViewModel();




		function setupSidebar(){
			
			if (pathname === "/") {
				// no initial classes on "sidebar" for index page
				return;
			}
			
			var urlKey = self.sidebarUrlViewsMapKey;

			if(self.sectionData.sections) {
				//add the active class to sub-menu-item
				self.sidebarUrlViewsMap[urlKey].subItem.active(true);

				//open the menu-item dropdown menu
				self.sidebarUrlViewsMap[urlKey].item.open(true);

				// set the text on NavBar
				self.navbarText(self.sidebarUrlViewsMap[urlKey].item.text);
			} else {
				// if the is no submenu; 
				// add the active class to menu-item
				self.sidebarUrlViewsMap[urlKey].active(true);

				// set the text on NavBar
				self.navbarText(self.sidebarUrlViewsMap[urlKey].text);
			}
		}

		function setSidebarUrlViewsMapKey(){

			// key for the "sidebarUrlViewsMap"
			var urlKey = pathname;

			var hash = window.location.hash;

			// if the page is using sammy routing
			if(self.sectionData.sammy) {

				// add hash to construct the urlKey 
				if (hash){
					urlKey += hash;
				} else {

					// use the default section to build the key
					urlKey += ("#" + self.sectionData.defaultSection);
				}
			}

			// set the key
			self.sidebarUrlViewsMapKey = urlKey;
		}

		function addStylesheets(){

			pageData.stylesheets.forEach(function(href){
				$("<link/>", {rel: "stylesheet", href: href}).appendTo("head");
			});
			
		}


		function setCloseKoSelectListEventHandler(){
			// Add the click event on document to close select-list dropdown on
			// outside clicks.

			$(document).click(function(event){
				
				if (helper.closeKoSelectList($(event.target))){

					// every ko-select-list component add a reference to its VM
					// in MasterViewModel's self.koSelectListRef property.
					
					// Loop over all VMs and setting "dropdownOpen" property to false
					// will close them.
					self.koSelectListRef.forEach(function(selectListVM){
						selectListVM.dropdownOpen(false);
					});
				}
			});
		}
		
	};// End VM
});