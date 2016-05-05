
requirejs.config({
	paths: {
		"jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min", "lib/jquery"],
		"knockout":["//cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min", "lib/knockout"]     
	}
});


require(
	["knockout", "viewmodels/indexViewModel", "lib/domReady!"],
	
	function(ko, indexViewModel) {
		ko.applyBindings(new indexViewModel());
	}
);

