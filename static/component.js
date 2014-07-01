(function($){
	"use strict";
	
	var $document = $(document),
		components_template,
		$cache = function(){ //cache
			var cache = {};
			return function(selector){
				if(!cache[selector]) cache[selector] = $(selector);
				return cache[selector];
			};
		}();

	window.component = {
			refresh_list: function(){
				if(!components_template) {
					components_template = Handlebars.compile($("#components-template").html());
					Handlebars.registerHelper('nestedMenu', function(info) {
						var template = Handlebars.compile($('#nested-menu').html());
						console.log("info", info, arguments);
						return template({options: info});
					});
				}
				console.log(components);
				if(!components.groups){
					components.groups = window.component.descend_menu(components.menu);
				}
				var $components = $cache("#components");
				$components.html( components_template(components));
			},
			descend_menu: function(options){
				var response = [],
					option,
					i;

				for(i = 0; i < options.length; i++){
					option = options[i];
					if(option.name){
						response.push({
							"branch": option.name,
							"options": component.descend_menu(option.options)
						});
					} else {
						components.components[option].id = option;
						response.push(components.components[option]);
					}
				}
				return response;
			},
			drag_start: function(event){
				event.originalEvent.dataTransfer.setData("Text", event.target.getAttribute("data-id"));
			},
			allow_drop: function(event){
				event.preventDefault();
				console.log(event.dataTransfer);
			},
			drop: function(event){
				var $target = $(event.target);
				event.preventDefault();
				var component_id = event.originalEvent.dataTransfer.getData("Text");

				$target.replaceWith(components.components[component_id].html + '<div class="dropable">Drop here</div>');
			}
		};

	$document.on("gbs:init", function(){
		var $components = $cache("#components");
		$document.on("dragstart", ".draggable", window.component.drag_start);
		$document.on("dragover",  ".dropable", window.component.allow_drop);
		$document.on("drop",      ".dropable", window.component.drop);
		//ev.target.appendChild(document.getElementById(data));

		component.refresh_list();
	});

}(jQuery));