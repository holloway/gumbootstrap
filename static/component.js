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
				if(!components_template) components_template = Handlebars.compile($("#components-template").html());
				var $components = $cache("#components");
				$components.html( components_template(components));
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
				console.log("DROP!")
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