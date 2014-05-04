/**
 * Author		jssoscar
 * Date			2014-1-10 15:54:57
 * Version		2.0
 * Description	jQuery plugin for the operation with loading effect
 *
 * Version		2.0.2
 * Date			2014-1-13 11:16:51
 * Changelog	.	Optimize the code
 * 				.	Add showOverlay/showLoading method
 * 
 * Version		2.0.3
 * Date			2014-5-4 17:18:09
 * Changelog	.	Optimize the code
 * 				.	Remove the showOverlay/showLoading method
 * 				.	Add hide method to hide the loading element
 * 
 * Version		2.0.3.1
 * Date			2014-5-4 18:04:52
 * Changelog	.	Fixed the bug when append the overlay/loading element
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
		this.options = this._extend(options);
		this.loading = $("<div></div>");
		this.overlay = $('<iframe frameBorder="0"></iframe>');
		this.hideable = true;
		this.removed = false;
		this.overlay.css("display","none").appendTo(this.container);
		this.loading.css("display","none").appendTo(this.container);
		return this;
	} else {
		return new OperWithLoading(container, options);
	}
}

/**
 * The prototype for the loading effect
 * 
 * _extend : Extend the customer configuration
 * _calculate4Overlay : calculate the overlay style.Why? If the container DOM changed or the style changed,should recalculate the overlay style
 * _dealOverlay : deal with the overlay element style
 * _dealLoading : deal with the loading element style
 * show : show the loading element
 * hide : hide the loading element
 * remove : remove the loading element
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
	_extend : function(options) {
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
		 */
		if (defaultCfg.overlayWidth === "auto") {
			defaultCfg.autoWidth = true;
		}
		/**
		 * Deal with the overlay width attribute
		 */
		if (defaultCfg.overlayHeight === "auto") {
			defaultCfg.autoHeight = true;
		}
		return defaultCfg;
	},
	_calculate4Overlay : function(){
		if(this.options.autoWidth){
			this.options.overlayWidth = this.container.outerWidth();
		}
		if(this.options.autoHeight){
			this.options.overlayHeight = this.container.outerHeight();
		}
	},
	_dealOverlay : function(){
		this._calculate4Overlay();
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
			"height" : this.options.overlayHeight
		};
	},
	_dealLoading : function(){
		return {
			"background" : this.options.loadingBgColor + " url(http://nuomi.xnimg.cn/vone/img/loading/loading.gif?ver) no-repeat center center",
			"position" : "absolute",
			"left" : "50%",
			"top" : "50%",
			"z-index" : 999,
			"margin" : "-" + parseInt(this.options.loadingHeight / 2, 10) + "px 0 0 -" + parseInt(this.options.loadingWidth / 2, 10)+"px",
			"width" : this.options.loadingWidth,
			"height" : this.options.loadingHeight
		};
	},
	show : function() {
		if(this.removed){
			return;
		}
		if(this.hideable){
			this.hideable = false;
			if (this.container.css("position") === "static") {
				this.container.css("position", "relative");
			}
			if(this.options.overlay){
				this.overlay.css(this._dealOverlay()).show(this.options.speed);
			}
			if(this.options.loading){
				this.loading.css(this._dealLoading()).addClass(this.options.className).show(this.options.speed);
			}
		}
	},
	hide : function(){
		if (!this.hideable) {
			var _this = this;
			if(this.options.overlay){
				_this.overlay.hide(this.options.speed, function() {
					_this.hideable = true;
				});
			}
			if(this.options.loading){
				_this.loading.hide(this.options.speed, function() {
					_this.hideable = true;
				});
			}
		}
	},
	remove : function() {
		if (!this.removed) {
			var _this = this;
			if(this.options.overlay){
				_this.overlay.hide(this.options.speed, function() {
					$(this).remove();
					_this.removed = true;
				});
			}
			if(this.options.loading){
				_this.loading.hide(this.options.speed, function() {
					$(this).remove();
					_this.removed = true;
				});
			}
		}
	}
};
