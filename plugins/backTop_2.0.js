/**
 * Author		jssoscar
 * Date			2013-10-29 10:24:16
 * Description	jQuery plugin for back to top
 * Note			Support jQuery version : less than 1.9. From 1.9,jQuery remove the jQuery.browser() method.
 * Version		2.0
 * Added		. And hover class
 * 				. Bind hover event handler for the back top element
 */
$(function() {
	/**
	 * Back top plugin constant
	 */
	var backTopConstant = {
		Mode : {
			"S" : "show",
			"F" : "fade"
		}
	};

	/**
	 *  Define the back top object
	 *
	 * @param {Object} config : the back top configuration
	 */
	function backTop(config) {
		var defaultCfg = {
			animateSpeed : 0, // body && html animate speed
			showSpeed : 0, // show or fadeIn speed
			className : "", // back top element class name
			showHeight : 0, // show height
			title : "Top", // back top element title attribute
			controlHTML : "Top", // the back top control html
			showMode : backTopConstant.Mode.F, // the back top show mode
			offsetRight : 30, // back top element offset right distance
			offsetBottom : 30, // back top element offset bottom distance,
			hoverClass : ""  // back top element hover class
		};

		/**
		 * Scope safe constructor protection
		 */
		if (this instanceof backTop) {
			
			// Extend the default configuration
			$.extend(defaultCfg, config);

			// Deal with the animate speed for the body,html
			if (isNaN(defaultCfg.animateSpeed) || defaultCfg.animateSpeed < 0) {
				defaultCfg.animateSpeed = 0;
			}
			defaultCfg.animateSpeed = defaultCfg.animateSpeed * 1e3;

			// Deal with the show speed for the back top element
			if (isNaN(defaultCfg.showSpeed) || defaultCfg.showSpeed < 0) {
				defaultCfg.showSpeed = 0;
			}
			defaultCfg.showSpeed = defaultCfg.showSpeed * 1e3;

			// Deal with the show height
			if (isNaN(defaultCfg.showHeight) || defaultCfg.showHeight < 0) {
				defaultCfg.showHeight = 0;
			}

			// Deal with the back top show mode
			if (!this.showEffect(defaultCfg) && !this.fadeEffect(defaultCfg)) {
				defaultCfg.mode = backTopConstant.Mode.F;
			}
			
			// Deal with the back top control HTML
			if(defaultCfg.controlHTML == null){
				defaultCfg.controlHTML = "Top";
			}
			
			this.config = defaultCfg;
			this.init();
			return this;
		} else {
			return new backTop(config);
		}
	}

	/**
	 * Prototype for the back top object
	 */
	backTop.prototype = {
		init : function() {
			var backTop = this, backTopHTML = $("<div id='backTop' class='" + backTop.config.className + "'></div>");
			// Generate the back top content : append to back top HTML to the body
			backTopHTML.css({
				position : backTop.fixed() ? "absolute" : "fixed",
				right : backTop.config.offsetRight,
				bottom : backTop.config.offsetBottom,
				cursor : "pointer"
			}).attr({
				title : backTop.config.title
			}).click(function() {
				$("body,html").animate({
					scrollTop : 0
				}, backTop.config.animateSpeed);
			}).hover(function(){
				if(backTop.config.hoverClass){
					backTopHTML.addClass(backTop.config.hoverClass);
				}
			},function(){
				if(backTop.config.hoverClass){
					backTopHTML.removeClass(backTop.config.hoverClass);
				}
			}).html(backTop.config.controlHTML).appendTo($(document.body)).hide();

			// Bind scroll event for the window
			$(window).bind("scroll", function() {
				var $win = $(this);
				// Deal with current scroll top distance
				if ($win.scrollTop() > backTop.config.showHeight) {
					backTop.showEffect(backTop.config) ? backTopHTML.show(backTop.config.showSpeed) : backTopHTML.fadeIn(backTop.config.showSpeed);
				} else {
					backTop.showEffect(backTop.config) ? backTopHTML.hide(backTop.config.showSpeed) : backTopHTML.fadeOut(backTop.config.showSpeed);
				}

				// Deal with the IE6
				if (backTop.fixed()) {
					backTopHTML.css({
						top : $win.scrollTop() + $win.height() - backTopHTML.height() - backTop.config.offsetBottom
					});
				}
			});
		},
		fixed : function() {
			/**
			 * Support by the jQuery less than 1.9
			 *
			 * If want to use the jQuery over 1.9,use the $.support
			 */
			return $.browser.msie && $.browser.version == "6.0";
		},
		showEffect : function(options) {
			return options.mode === backTopConstant.Mode.S;
		},
		fadeEffect : function(options) {
			return options.mode === backTopConstant.Mode.F;
		}
	};
	
	// Define the global back top plugin
	$.backTop = backTop;
});