/**
 * Author		jssoscar
 * Date			2013-10-29 17:26:34
 * Description		jQuery plugin for go bottom
 * Version		2.0
 */
$(function() {
	/**
	 * Constant for go bottom plugin
	 */
	var goBottomConstant = {
		Mode : {
			"S" : "show",
			"F" : "fade"
		}
	};

	/**
	 * Define the go bottom object
	 *
	 * @param {Object} config : the configuration
	 */
	function goBottom(config) {
		var defaultCfg = {
			animateSpeed : 0, // body && html animate speed
			showSpeed : 0, // show or fadeIn speed
			className : "", // go bottom element class name
			title : "Bottom", // go bottom element title attribute
			controlHTML : "Bottom", // the go bottom control html
			showMode : goBottomConstant.Mode.F, // the go bottom show mode
			offsetRight : 30, // go bottom element offset right distance
			offsetBottom : 30, // go bottom element offset bottom distance,
			hoverClass : "" // go bottom element hover class
		};
		if (this instanceof goBottom) {
			// Extend the default configuration
			$.extend(defaultCfg, config);

			// Deal with the animate speed for the body,html
			if (isNaN(defaultCfg.animateSpeed) || defaultCfg.animateSpeed < 0) {
				defaultCfg.animateSpeed = 0;
			}
			defaultCfg.animateSpeed = defaultCfg.animateSpeed * 1e3;

			// Deal with the show speed for the go bottom element
			if (isNaN(defaultCfg.showSpeed) || defaultCfg.showSpeed < 0) {
				defaultCfg.showSpeed = 0;
			}
			defaultCfg.showSpeed = defaultCfg.showSpeed * 1e3;

			// Deal with the go bottom show mode
			if (!this.showEffect(defaultCfg) && !this.fadeEffect(defaultCfg)) {
				defaultCfg.mode = goBottomConstant.Mode.F;
			}

			// Deal with the go bottom control HTML
			if (defaultCfg.controlHTML == null) {
				defaultCfg.controlHTML = "Bottom";
			}

			this.config = defaultCfg;
			this.init();
			return this;
		} else {
			return new goBottom(config);
		}
	}

	/**
	 * Prototype for the go bottom object
	 */
	goBottom.prototype = {
		/**
		 * Initialize the go bottom object
		 *
		 * . Generate the go bottom content
		 * . Deal with the go bottom element style
		 * . Deal with the go bottom element attribute
		 * . Deal with the go bottom element event handler : click event and hover event
		 * . Append the go bottom element to body node
		 * . Bind scroll event handler for the window
		 */
		init : function() {
			var goBottom = this, goBottomHTML = $("<div id='goBottom' class='" + goBottom.config.className + "'></div>");
			goBottomHTML.css({
				position : goBottom.fixed() ? "absolute" : "fixed",
				right : goBottom.config.offsetRight,
				bottom : goBottom.config.offsetBottom,
				cursor : "pointer"
			}).attr({
				title : goBottom.config.title
			}).click(function() {
				$("body,html").animate({
					scrollTop : $(document.body).height() - $(window).height()
				}, goBottom.config.animateSpeed,function(){
					goBottom.showEffect(goBottom.config) ? goBottomHTML.hide(goBottom.config.showSpeed) : goBottomHTML.fadeOut(goBottom.config.showSpeed);
				});
			}).hover(function() {
				if (goBottom.config.hoverClass) {
					goBottomHTML.addClass(goBottom.config.hoverClass);
				}
			}, function() {
				if (goBottom.config.hoverClass) {
					goBottomHTML.removeClass(goBottom.config.hoverClass);
				}
			}).html(goBottom.config.controlHTML).appendTo($(document.body));
			
			$(window).bind("scroll", function() {
				var $win = $(this);
				// Deal with current scroll top distance
				if ($win.scrollTop() < $(document.body).height() - $win.height()) {
					goBottom.showEffect(goBottom.config) ? goBottomHTML.show(goBottom.config.showSpeed) : goBottomHTML.fadeIn(goBottom.config.showSpeed);
				} else {
					goBottom.showEffect(goBottom.config) ? goBottomHTML.hide(goBottom.config.showSpeed) : goBottomHTML.fadeOut(goBottom.config.showSpeed);
				}

				// Deal with the IE6
				if (goBottom.fixed()) {
					goBottomHTML.css({
						top : $win.scrollTop() + $win.height() - goBottomHTML.height() - goBottom.config.offsetBottom
					});
				}
			});
		},
		/**
		 * Judge the browser type : Current, only IE6 not support fixed position.
		 */
		fixed : function() {
			/**
			 * Support by the jQuery less than 1.9
			 *
			 * If want to use the jQuery over 1.9,use the $.support
			 */
			return $.browser.msie && $.browser.version == "6.0";
		},
		/**
		 * Deal with the go bottom element show effect
		 *
		 * @param {Object} options : the configuration for the go bottom plugin
		 */
		showEffect : function(options) {
			return options.mode === goBottomConstant.Mode.S;
		},
		/**
		 * Deal with the go bottom element fade effect
		 *
		 * @param {Object} options : the configuration for the go bottom plugin
		 */
		fadeEffect : function(options) {
			return options.mode === goBottomConstant.Mode.F;
		}
	};

	// Define the global go bottom plugin
	$.goBottom = goBottom;
}); 
