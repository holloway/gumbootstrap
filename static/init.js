(function($){
	"use strict";

	var error_func = function(data, errortype){
			console.log("error", data, errortype);
		},
		$cache = function(){ //cache
			var cache = {};
			return function(selector){
				if(!cache[selector]) cache[selector] = $(selector);
				return cache[selector];
			};
		}(),
		$document = $(document),
		$window = $(document),
		components_template,
		init = function(){
			$.getJSON('static/components.json').success(function(data){
				window.components = data;
				
				$document.trigger("gbs:init");
			}).error(error_func);
			
		};

	$(document).ready(init);
	
}(jQuery));