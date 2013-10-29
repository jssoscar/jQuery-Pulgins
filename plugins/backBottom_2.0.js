/**
 * Author		jssoscar
 * Date			2013-10-29 17:26:34
 * Description	jQuery plugin for back to bottom
 * Version		1.0
 */
$(function() {
	/**
	 * Constant for back bottom plugin
	 */
	var backBottomConstant = {
		Mode : {
			"S" : "show",
			"F" : "fade"
		}
	};

	/**
	 * Define the back bottom object
	 *
	 * @param {Object} config : the back top configuration
	 */
	function backBottom(config) {
		var defaultCfg = {
			animateSpeed : 0, // body && html animate speed
			showSpeed : 0, // show or fadeIn speed
			className : "", // back bottom element class name
			title : "Bottom", // back bottom element title attribute
			controlHTML : "Bottom", // the back bottom control html
			showMode : backBottomConstant.Mode.F, // the back bottom show mode
			offsetRight : 30, // back bottom element offset right distance
			offsetBottom : 30, // back bottom element offset bottom distance,
			hoverClass : "" // back bottom element hover class
		};
		if (this instanceof backBottom) {
			// Extend the default configuration
			$.extend(defaultCfg, config);

			// Deal with the animate speed for the body,html
			if (isNaN(defaultCfg.animateSpeed) || defaultCfg.animateSpeed < 0) {
				defaultCfg.animateSpeed = 0;
			}
			defaultCfg.animateSpeed = defaultCfg.animateSpeed * 1e3;

			// Deal with the show speed for the back bottom element
			if (isNaN(defaultCfg.showSpeed) || defaultCfg.showSpeed < 0) {
				defaultCfg.showSpeed = 0;
			}
			defaultCfg.showSpeed = defaultCfg.showSpeed * 1e3;

			// Deal with the back bottom show mode
			if (!this.showEffect(defaultCfg) && !this.fadeEffect(defaultCfg)) {
				defaultCfg.mode = backBottomConstant.Mode.F;
			}

			// Deal with the back bottom control HTML
			if (defaultCfg.controlHTML == null) {
				defaultCfg.controlHTML = "Bottom";
			}

			this.config = defaultCfg;
			this.init();
			return this;
		} else {
			return new backBottom(config);
		}
	}

	/**
	 * Prototype for the back bottom object
	 */
	backBottom.prototype = {
		/**
		 * Initialize the back top object
		 *
		 * . Generate the back bottom content
		 * . Deal with the back bottom element style
		 * . Deal with the back bottom element attribute
		 * . Deal with the back bottom element event handler : click event and hover event
		 * . Append the back bottom element to body node
		 * . Bind scroll event handler for the window
		 */
		init : function() {
			var backBottom = this, backBottomHTML = $("<div id='backBottom' class='" + backBottom.config.className + "'></div>");
			backBottomHTML.css({
				position : backBottom.fixed() ? "absolute" : "fixed",
				right : backBottom.config.offsetRight,
				bottom : backBottom.config.offsetBottom,
				cursor : "pointer"
			}).attr({
				title : backBottom.config.title
			}).click(function() {
				$("body,html").animate({
					scrollTop : $(document.body).height() - $(window).height()
				}, backBottom.config.animateSpeed,function(){
					backBottom.showEffect(backBottom.config) ? backBottomHTML.hide(backBottom.config.showSpeed) : backBottomHTML.fadeOut(backBottom.config.showSpeed);
				});
			}).hover(function() {
				if (backBottom.config.hoverClass) {
					backBottomHTML.addClass(backBottom.config.hoverClass);
				}
			}, function() {
				if (backBottom.config.hoverClass) {
					backBottomHTML.removeClass(backBottom.config.hoverClass);
				}
			}).html(backBottom.config.controlHTML).appendTo($(document.body));
			
			$(window).bind("scroll", function() {
				var $win = $(this);
				// Deal with current scroll top distance
				if ($win.scrollTop() < $(document.body).height() - $(window).height()) {
					backBottom.showEffect(backBottom.config) ? backBottomHTML.show(backBottom.config.showSpeed) : backBottomHTML.fadeIn(backBottom.config.showSpeed);
				} else {
					backBottom.showEffect(backBottom.config) ? backBottomHTML.hide(backBottom.config.showSpeed) : backBottomHTML.fadeOut(backBottom.config.showSpeed);
				}

				// Deal with the IE6
				if (backBottom.fixed()) {
					backBottomHTML.css({
						top : $win.scrollTop() + $win.height() - backBottomHTML.height() - backBottom.config.offsetBottom
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
		 * Deal with the back bottom element show effect
		 *
		 * @param {Object} options : the configuration for the back bottom plugin
		 */
		showEffect : function(options) {
			return options.mode === backBottomConstant.Mode.S;
		},
		/**
		 * Deal with the back bottom element fade effect
		 *
		 * @param {Object} options : the configuration for the back bottom plugin
		 */
		fadeEffect : function(options) {
			return options.mode === backBottomConstant.Mode.F;
		}
	};

	$.backBottom = backBottom;
}); 