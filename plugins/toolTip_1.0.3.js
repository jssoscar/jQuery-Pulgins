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
 * Changelog	.	Add the display effect,default is show function. Support show and fadeIn.
 * Usage		$(function(){
					 $(".tip").toolTip({
						 direction : "bottom",
						 content : $(".test").clone(),
						 effect : "fade"
					 });
			 	});
 * 
 * Version		1.0.4
 * Date			2014-4-9 18:00:59
 * Changelog	.	Support cache the tooltip.Default is false.
 * Usage		$(function(){
					 $(".tip").toolTip({
						 direction : "bottom",
						 cache : true
					 });
			 	});
 *
 * Version		1.0.5
 * Date			2014-4-10 09:17:50
 * Changelog	. Fixed the bug
 * 
 * Version		1.0.6
 * Date			2014-4-10 10:08:00
 * Changelog	. Fixed the bug when parameter "cache" is "true"
 * 
 * Version		1.1
 * Date			2014-4-15 13:36:23
 * Changelog	. Add parameter "effectSpeed" to controll the show effect speed
 * 				. Fixed the bug when tooltip is not visible
 */

/**
 * Define the tooltip cache controller object 
 */
var toolTipCacheController = {
	cacheCount : 0
};

/**
 * Define the tooltip function
 *
 * @param {Object} options : the toolitip configuration
 * 		@param {String} trigger : the tooltip trigger event,support hover,focus,click.Default is "hover".
 * 		@param {String} direction : the tooltip direction,support left,right,top,bottom.Default is "top".
 * 		@param {String} content : the tooltip content.Here,support two type : the "data-tooltip" and HTML content.
 * 		@param {Number} offset : the tooltip offset.Default is 10.
 * 		@param {String} style : the customer style for the tooltip
 * 		@param {String} effect : the effect for the tooltip.Default is "show".
 * 		@param {Number} effectSpeed : the effect speed
 * 		@param {Boolean} cache : whether cache the tooltip.Default is "false".
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
		},
		triangleStyle : {
			left : "horizontal",
			right : "horizontal",
			top : "vertical",
			bottom : "vertical"
		}
	};

	// Deal with the configuration
	(function() {
		var defaultCfg = {
			trigger : toolTipController.eventType.hover, 
			direction : "top", 
			content : null, 
			offset : 12, 
			style : "default", 
			effect : "show", 
			effectSpeed : 0,
			cache : false
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
		
		defaultCfg.effectSpeed = defaultCfg.effectSpeed * 1e3;

		options = defaultCfg;
	})();

	// Handler for the tooltip content
	$(this).each(function() {
		var _this = this,index = -1;
		
		if(options.cache){
			index = toolTipCacheController.cacheCount++;
		}

		// Bind event handler
		if (options.trigger === "hover") {
			$(_this).hover(function() {
				generateToolTip($(this),index);
			}, function() {
				hideToolTip(index);
			});
		} else if(options.trigger === "focus"){
			$(this).focusin(function(){
				generateToolTip($(this),index);
			}).focusout(function() {
				hideToolTip(index);
			});
		}else{
			$(_this).bind("mouseout " + options.trigger, function(event) {
				switch(event.type) {
					case options.trigger : {
						generateToolTip($(this),index);
						break;
					}
					case "mouseout" : {
						hideToolTip(index);
						break;
					}
				}
			});
		}
	});

	/**
	 * Calculate the direction for the tooltip
	 * 
	 * @param {Object} toolTipObj : the tooltip object
	 * @param {Object} toolTip : the tooltip
	 */
	function calculateDirection(toolTipObj, toolTip) {
		var directionInfo = {
			direction : options.direction,
			position : {}
		},top, left,winWidth = $(window).width();
		switch(options.direction) {
			case "left" : {
				top = $(toolTipObj).offset().top - $(toolTip).outerHeight() / 2 + $(toolTipObj).outerHeight() / 2;
				left = $(toolTipObj).offset().left - toolTip.outerWidth() - options.offset;
				if(left < 0){
					left = $(toolTipObj).offset().left + $(toolTipObj).outerWidth() + options.offset;
					directionInfo.direction = "right";
				}
				break;
			}
			case "right" : {
				top = $(toolTipObj).offset().top - $(toolTip).outerHeight() / 2 + $(toolTipObj).outerHeight() / 2;
				left = $(toolTipObj).offset().left + $(toolTipObj).outerWidth() + options.offset;
				if(left > winWidth){
					left = $(toolTipObj).offset().left - toolTip.outerWidth() - options.offset;
					directionInfo.direction = "left";
				}
				break;
			}
			case "top" : {
				top = $(toolTipObj).offset().top - options.offset - $(toolTip).outerHeight();
				left = $(toolTipObj).offset().left - toolTip.outerWidth() / 2 + $(toolTipObj).outerWidth() / 2;
				if(top < 0){
					top = $(toolTipObj).offset().top + options.offset + toolTip.outerHeight();
					directionInfo.direction = "bottom";
				}
				break;
			}
			case "bottom" : {
				top = $(toolTipObj).offset().top + options.offset + toolTip.outerHeight();
				left = $(toolTipObj).offset().left - toolTip.outerWidth() / 2 + $(toolTipObj).outerWidth() / 2;
				if(top > winWidth){
					top = $(toolTipObj).offset().top - options.offset - $(toolTip).outerHeight();
					directionInfo.direction = "top";
				}
				break;
			}
		}
		directionInfo.position = {
			top : top < 0 ? 0 : top,
			left : left < 0 ? 0 : left
		};
		return directionInfo;
	}

	/**
	 * Generate the tooltip
	 * 
	 * @param {Object} obj : the tooltip object
	 * @param {Integer} index : current tooltip index
	 */
	function generateToolTip(obj,index) {
		var title = $.trim($(obj).attr("data-tooltip")), 
			toolTipContent = null, toolTipPlugin = $(".tooltip-plugin_"+index),
			toolTip = $('<div class="tooltip-plugin">' +
							'<div class="tooltip-plugin-content"></div>' + 
							'<div class="tooltip-outer-triangle">' + 
								'<div class="tooltip-inner-triangle"></div>' + 
								'</div>' + 
						'</div>');

		if (toolTipPlugin[0] && options.cache) {
			showToolTip(true,toolTipPlugin);
			return;
		}

		if (title) {
			toolTipContent = title;
		} else if (options.content) {
			toolTipContent = options.content;
		} else {
			return;
		}

		toolTip.find(".tooltip-plugin-content").html(toolTipContent);
		toolTip.appendTo($("body"));
		toolTipPlugin = $("tooltip-plugin_"+options.index);
		
		var directionInfo = calculateDirection(obj, toolTip);
		toolTip.addClass("tooltip-plugin_"+index + " tooltip-plugin-" + directionInfo.direction + " tooltip-plugin-style-" + options.style).hide();
		toolTip.find(".tooltip-outer-triangle").addClass("tooltip-outer-triangle-" + toolTipController.triangleStyle[directionInfo.direction]);
		toolTip.css(directionInfo.position)[options.effect]();
	}
	
	/**
	 * Show the tooltip
	 * 
	 * @param {Boolean} toolTipExist : whether the tooltip exist
	 * @param {Object} toolTipObj : the node for tooltip
	 * @param {Object} toolTip : the tool tip object 
	 */
	function showToolTip(toolTipExist,toolTipObj,toolTip){
		if(toolTipExist){
			$(toolTipObj)[options.effect](options.effectSpeed);
		}else{
			var directionInfo = calculateDirection(toolTipObj, toolTip);
			$(toolTip).addClass("tooltip-plugin_"+index + " tooltip-plugin-" + directionInfo.direction + " tooltip-plugin-style-" + options.style).hide();
			$(toolTip).find(".tooltip-outer-triangle").addClass("tooltip-outer-triangle-" + toolTipController.triangleStyle[directionInfo.direction]);
			$(toolTip).css(directionInfo.position)[options.effect](options.effectSpeed);
		}
	}

	/**
	 * Hide the tooltip
	 * 
	 * @param {Integer} index : current tooltip index. If cache,hide the tooltip else remove the tooltip.
	 */
	function hideToolTip(index) {
		if(options.cache){
			$(".tooltip-plugin_"+index).hide();
		}else{
			$(".tooltip-plugin_"+index).remove();
		}
	}
};
