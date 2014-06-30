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
			$target: undefined,
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
					console.log(components.groups)
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
						response.push(components.components[option])
					}
					

				}
				return response;
			},
			drag: function(event){
				var _this = component,
					$target = $(this);

				_this.$target = $target;
				event.preventDefault();
			},
			move: function(event){
				var _this = component;
				event.preventDefault();
				if(!_this.$target) return;
				console.log(event, event.target);
			},
			drop: function(event){
				var _this = component;
				if(!_this.$target) return;
				_this.$target = undefined;
				event.preventDefault();
			}
		};

	$document.on("gbs:init", function(){
		$cache("#components").on("mousedown", ".dragable", window.component.drag);
		$document.on("mousemove",                          window.component.move);
		$document.on("mouseup",                            window.component.drop);
		component.refresh_list();
	});

}(jQuery));