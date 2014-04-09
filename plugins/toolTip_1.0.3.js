/**
 * Author		jssoscar
 * Date			2014-4-8 11:18:39
 * Version		1.0
 * Description	jQuery plugin for tool tip
 * Usage		$(function(){
				 	$(".tip").toolTip({
				 		direction : "bottom",
				 		content : $(".test").clone()
				 	});
				 });
 *
 * Version		1.0.2
 * Date			2014-4-9 09:53:55
 * Changelog	.	Fixed the bug
 * 				.	Support cache the tooltip
 * 				.	Support the customer style for the tool tip
 * Usage		$(function(){
					 $(".tip").toolTip({
						 direction : "bottom",
						 content : $(".test").clone(),
						 style : "gray"
					 });
				 });
				 
 * Version		1.0.3
 * Date			2014-4-9 10:37:17
 * Changelog	. Add the display effect,default is show function. Support show and fadeIn.
 * Usage		$(function(){
					 $(".tip").toolTip({
						 direction : "bottom",
						 content : $(".test").clone(),
						 effect : "fade"
					 });
			 	});
 * 
 */

/**
 * Define the tooltip function
 *
 * @param {Object} options : the toolitip configuration
 * 		@param {String} trigger : the tooltip trigger event,support hover,focus,click.Default is hover.
 * 		@param {String} direction : the tooltip direction,support left,right,top,bottom.Default is top.
 * 		@param {String} content : the tooltip content.Here,support two type : the "data-tooltip-title" and HTML content.
 * 		@param {Number} offset : the tooltip offset
 * 		@param {String} style : the customer style for the tooltip
 * 		@param {String} effect : the effect for the tooltip
 * 		@param {Boolean} cache : whether cache the tooltip
 */
$.fn.toolTip = function(options) {
	// Define the tooltip controller
	var toolTipController = {
		eventType : {
			click : "click",
			hover : "hover",
			focus : "focus"
		},
		direction : {
			left : "left",
			right : "right",
			top : "top",
			bottom : "bottom"
		},
		effect : {
			show : "show",
			fade : "fadeIn"
		}
	};

	// Deal with the configuration
	(function() {
		var defaultCfg = {
			trigger : toolTipController.eventType.hover, // hover,focus,click
			direction : "top", // left,right,top,bottom
			content : null, // tooltip content
			offset : 10, // the tooltip offset
			style : "default", // the default style
			effect : "show"
		};
		$.extend(defaultCfg, options);

		// Deal with the event type
		if (!toolTipController.eventType[defaultCfg.trigger]) {
			defaultCfg.trigger = toolTipController.eventType.hover;
		}

		// Deal with the direction
		if (!toolTipController.direction[defaultCfg.direction]) {
			defaultCfg.direction = toolTipController.direction.top;
		}
		
		// Deal with the tooltip effect
		if(!toolTipController.effect[defaultCfg.effect]){
			defaultCfg.effect = toolTipController.effect.show;
		}else if(defaultCfg.effect === "fade"){
			defaultCfg.effect = toolTipController.effect.fade;
		}

		options = defaultCfg;
	})();

	// Handler for the tooltip content
	$(this).each(function(index) {
		var _this = this;

		// Bind event handler
		if (options.trigger === "hover") {
			$(_this).hover(function() {
				generateToolTip($(this));
			}, function() {
				removeToolTip();
			});
		} else {
			$(_this).bind("mouseout " + options.trigger, function(event) {
				switch(event.type) {
					case options.trigger : {
						generateToolTip($(this));
						break;
					}
					case "mouseout" : {
						removeToolTip();
						break;
					}
				}
			});
		}
	});

	/**
	 * Calculate the direction for the tooltip
	 * @param {Object} options : the tooltip configuration
	 * @param {Object} toolTipObj : the tooltip object
	 * @param {Object} toolTip : the tooltip
	 */
	function calculateDirection(toolTipObj, toolTip) {
		switch(options.direction) {
			case "left" : {
				return {
					"top" : $(toolTipObj).offset().top - $(toolTip).outerHeight() / 2 + $(toolTipObj).outerHeight() / 2,
					"left" : $(toolTipObj).offset().left - toolTip.outerWidth() - options.offset
				};
			}
			case "right" : {
				return {
					"top" : $(toolTipObj).offset().top - $(toolTip).outerHeight() / 2 + $(toolTipObj).outerHeight() / 2,
					"left" : $(toolTipObj).offset().left + $(toolTipObj).outerWidth() + options.offset
				};
			}
			case "top" : {
				return {
					"top" : $(toolTipObj).offset().top - options.offset - $(toolTip).outerHeight(),
					"left" : $(toolTipObj).offset().left - toolTip.outerWidth() / 2 + $(toolTipObj).outerWidth() / 2
				};
			}
			case "bottom" : {
				return {
					"top" : $(toolTipObj).offset().top + options.offset + toolTip.outerHeight(),
					"left" : $(toolTipObj).offset().left - toolTip.outerWidth() / 2 + $(toolTipObj).outerWidth() / 2
				};
			}
		}
	}

	/**
	 * Generate the tooltip
	 * @param {Object} obj : the tooltip object
	 */
	function generateToolTip(obj) {
		var title = $.trim($(obj).attr("data-tooltip-title")), 
			toolTipContent = null, toolTipPlugin = $(".tooltip-plugin"),
			toolTip = $('<div class="tooltip-plugin">' +
							'<div class="tooltip-plugin-content"></div>' + 
							'<div class="tooltip-outer-triangle">' + 
								'<div class="tooltip-inner-triangle"></div>' + 
								'</div>' + 
						'</div>');

		if (toolTipPlugin[0]) {
			return;
		}

		if (title) {
			toolTipContent = title;
		} else if (options.content) {
			toolTipContent = options.content;
		} else {
			return;
		}

		toolTip.addClass("tooltip-plugin-" + options.direction + " tooltip-plugin-style-" + options.style).hide();
		toolTip.find(".tooltip-plugin-content").html(toolTipContent);
		if(options.direction === "top" || options.direction === "bottom"){
			toolTip.find(".tooltip-outer-triangle").addClass("tooltip-outer-triangle-vertical");
		}else{
			toolTip.find(".tooltip-outer-triangle").addClass("tooltip-outer-triangle-horizontal");
		}
		toolTip.appendTo($("body"));
		toolTipPlugin = $(".tooltip-plugin");
		toolTip.css(calculateDirection(obj, toolTip));
		toolTip[options.effect]();
	}

	/**
	 * Remove the tooltip
	 */
	function removeToolTip() {
		$(".tooltip-plugin").remove();
	}
};
