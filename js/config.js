"use strict";

// Config for requireJS

requirejs.config({
	paths: {
		"jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min", "lib/jquery"],
		"knockout":["//cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min", "lib/knockout"],
		"sammy": ["//cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.6/sammy.min", "lib/sammy"],
		"prism": "lib/prism"    
	}
});