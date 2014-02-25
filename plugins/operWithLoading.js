/**
 * Author		jssoscar
 * Date			2014-1-10 15:54:57
 * Version		2.0
 * Description	jQuery plugin for the operation with loading effect
 *
 * Version		2.0.2
 * Date			2014-1-13 11:16:51
 * Changelog	.	Optimize the code
 * 				.	Add showOverlay/showLoading function
 */
/**
 * Define the operation with loading object
 * 
 * @param {Object} container : the overlay element container(parent node)
 * @param {Object} options : the configuration for the loading object
 * 		@param {String} overlayBgColor : background color for the overlay
 * 		@param {Number} speed : show speed
 * 		@param {Number} overlayOpacity : opacity for the overlay
 * 		@param {String} className : class for the loading image
 * 		@param {Number} overlayWidth : the overlay width
 * 		@param {Number} overlayHeight : the overlay height
 * 		@param {String} loadingBgColor : background color for the loading iamge container
 * 		@param {Number} loadingWidth : the loading iamge container width
 * 		@param {Number} loadingHeight : the loading image container height
 * 		@param {Boolean} overlay : whether show the overlay
 * 		@param {Boolean} loading : whether show the loading
 */
function OperWithLoading(container, options) {
	if (this instanceof OperWithLoading) {
		this.container = container;
		this.options = this.extend(options);
		this.loading = $("<div></div>").css(this.dealLoading());
		this.overlay = $('<iframe frameBorder="0"></iframe>').css(this.dealOverlay());
		this.removed = true;
	} else {
		return new OperWithLoading(container, options);
	}
}

/**
 * The prototype for the loading effect
 * 
 * extend : Extend the customer configuration
 * show : show the loading element
 * showOverlay : show the overlay content
 * showLoading : show the loading content
 * remove : remove the loading element
 * removeOverlay : remove the overlay
 * removeLoading : remove the loading image
 */
OperWithLoading.prototype = {
	/**
	 * @param {String} overlayBgColor : background color for the overlay
	 * @param {Number} speed : show speed
	 * @param {Number} overlayOpacity : opacity for the overlay
	 * @param {String} className : class for the loading image
	 * @param {Number} overlayWidth : the overlay width
	 * @param {Number} overlayHeight : the overlay height
	 * @param {String} loadingBgColor : background color for the loading iamge container
	 * @param {Number} loadingWidth : the loading iamge container width
	 * @param {Number} loadingHeight : the loading image container height
	 * @param {Boolean} overlay : whether show the overlay
	 * @param {Boolean} loading : whether show the loading
	 */
	extend : function(options) {
		var defaultCfg = {
			speed : 0,
			overlayOpacity : 0.5,
			className : "",
			overlayBgColor : "#FFF",
			overlayWidth : "auto",
			overlayHeight : "auto",
			loadingBgColor : "",
			loadingWidth : 115,
			loadingHeight : 50,
			overlay : true,
			loading : true
		};

		$.extend(defaultCfg, options);

		/**
		 * Deal with the speed
		 */
		defaultCfg.speed = defaultCfg.speed * 1e3;

		/**
		 * Deal with the opacity
		 */
		if (defaultCfg.overlayOpacity < 0 || defaultCfg.overlayOpacity > 1) {
			defaultCfg.overlayOpacity = 0.5;
		}

		/**
		 * Deal with the overlay width attribute
		 *
		 * If the width equals 0,set the width as the container outer width(Note: Why not width method?)
		 */
		if (defaultCfg.overlayWidth === "auto") {
			defaultCfg.overlayWidth = this.container.outerWidth();
		}
		/**
		 * Deal with the overlay width attribute
		 *
		 * If the height equals 0,set the width as the container outer height(Note: Why not height method?)
		 */
		if (defaultCfg.overlayHeight === "auto") {
			defaultCfg.overlayHeight = this.container.outerHeight();
		}
		return defaultCfg;
	},
	dealOverlay : function(){
		return {
			"background-color" : this.options.overlayBgColor,
			"opacity" : this.options.overlayOpacity,
			"background-image" : "",
			"filter" : "alpha(opacity=" + this.options.overlayOpacity * 100 + ")",
			"position" : "absolute",
			"left" : 0,
			"top" : 0,
			"z-index" : 998,
			"width" : this.options.overlayWidth,
			"height" : this.options.overlayHeight,
			"display" : "none"
		};
	},
	dealLoading : function(){
		return {
			"background" : this.options.loadingBgColor + " url(http://nuomi.xnimg.cn/vone/img/loading/loading.gif?ver) no-repeat center center",
			"position" : "absolute",
			"left" : "50%",
			"top" : "50%",
			"z-index" : 999,
			"margin" : "-" + parseInt(this.options.loadingHeight / 2, 10) + "px 0 0 -" + parseInt(this.options.loadingWidth / 2, 10)+"px",
			"width" : this.options.loadingWidth,
			"height" : this.options.loadingHeight,
			"display" : "none"
		};
	},
	show : function() {
		if (this.removed) {
			this.removed = false;
			if (this.container.css("position") === "static") {
				this.container.css("position", "relative");
			}
			if(this.options.overlay){
				this.showOverlay();
			}
			if(this.options.loading){
				this.showLoading();
			}
		}
	},
	showOverlay : function(){
		this.overlay.appendTo(this.container).show(this.options.speed);
	},
	showLoading : function(){
		this.loading.addClass(this.options.className).appendTo(this.container).show(this.options.speed);
	},
	remove : function() {
		if (!this.removed) {
			if (this.options.overlay) {
				this.removeOverlay();
			}
			if (this.options.loading) {
				this.removeLoading();
			}
		}
	},
	removeOverlay : function(){
		var _this = this;
		_this.overlay.hide(this.options.speed, function() {
			$(this).remove();
			_this.removed = true;
		});
	},
	removeLoading : function(){
		var _this = this;
		_this.loading.hide(this.options.speed, function() {
			$(this).remove();
			_this.removed = true;
		});
	}
};
