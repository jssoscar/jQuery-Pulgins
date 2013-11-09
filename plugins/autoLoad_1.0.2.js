/**
 * Author		jssoscar
 * Date			2013-11-5 18:34:24
 * Version		1.0
 * Description	jQuery plugin for auto load : For the request to load content,generally use the GET to query data.
 * 				Here, the first version only Support the GET to query the content.
 * Note			. Only support GET to load content
 * 				. Cross domain load data not support
 * 				. The request count name has been fixed.If want to use this plugin,the configuration 'ajaxData' must has the attribute 'counter'
 * 
 * Version		1.0.2
 * Date			2013-11-8 15:02:43
 * Note			. Add the cross domain configruation to Support cross domain request data
 */

$(function() {
	/**
	 * Constants for the auto load plugin
	 *
	 * MODE : the loaded content display mode,support 'show' and 'fadeIn' mode
	 * REQUEST : the request type,current support GET and REQUEST. But query data asynchronous,general use the GET method to query.
	 * showEffect : judge whether the display mode is 'show' mode
	 * fadeEffect : judge whether the display mdoe is 'fade' mode
	 */
	var AUTO_LOAD_CONSTANTS = {
		MODE : {
			S : "show",
			F : "fade"
		},
		REQUEST : {
			G : "GET",
			P : "POST"
		},
		showEffect : function(config) {
			return config.mode === this.MODE.S;
		},
		fadeEffect : function(config) {
			return config.mode === this.MODE.F;
		},
		templatePattern : /\$\{[_a-zA-Z$][_a-zA-Z0-9]*\}/g
	};

	/**
	 * Define the auto load object
	 * 
	 * @param {Object} config : the auto load plugin configuration
	 * @param {Object} container : the loaded content container whic is the parent node of the loaded content.
	 *
	 * The meaning of the parameter :
	 * offsetBottom : the offset for the bottom
	 * maxLoad : the maximum auto load times
	 * mode : the loaded content display mode,support 'show' and 'fadeIn' mode
	 * speed : the loaded content display speed. The unit is second.
	 * url : the url for load the source data
	 * error : the error event handler for fail to load the data
	 * template : the loaded content template. The data to be replaced format must be ${attribute}.
	 * 			. Such as you want show the 'title' attribute, the format must be ${title}.
	 * dataAttribute : the loaded data attribute which contains the loaded content
	 * ajaxData : the ajax data for request
	 * crossDomain : whether cross domain request data
	 */
	function autoLoad(config,container) {
		if (this instanceof autoLoad) {
			this.options = {
				offsetBottom : 100,
				maxLoad : 0,
				mode : AUTO_LOAD_CONSTANTS.MODE.F,
				speed : 1,
				url : "",
				error : function() {
				},
				dataAttribute : "content",
				ajaxData : {
					counter : 0
				},
				crossDomain : false
			};
			this.extend(config,container);
			return this;
		} else {
			return new autoLoad(config,container);
		}
	}

	/**
	 * The auto load object prototype
	 *
	 * extend : .	extend the configuration
	 * 			.	data validation
	 * 			.	call the init method to initialize the plugin
	 * 
	 * init : 	.	initialize the auto load object
	 * 			.	bind scroll event handler for the window
	 * 
	 * load : load the content
	 * 
	 * ajaxSuccess : success to load the content asynchronous
	 * 
	 * ajaxError : fail to load content asynchronous
	 * 
	 * validateInt : validate the integer
	 */
	autoLoad.prototype = {
		extend : function(config,container) {
			// Extend the custom configuration
			$.extend(this.options, config);

			// Deal with the offset bottom
			if (this.validateInt(this.options.offsetBottom)) {
				this.options.offsetBottom = 100;
			}

			// Deal withe the maxLoad
			if (this.validateInt(this.options.maxLoad)) {
				this.options.maxLoad = 0;
			}

			// Deal with the loaded content display mode
			if (!AUTO_LOAD_CONSTANTS.showEffect(this.options.mode) && !AUTO_LOAD_CONSTANTS.fadeEffect(this.options.mode)) {
				this.options.mode = AUTO_LOAD_CONSTANTS.MODE.F;
			}

			// Deal with the display speed
			if (this.validateInt(this.options.speed)) {
				this.options.speed = 1;
			}
			this.options.speed = this.options.speed * 1e3;
			
			// Define the load finish flag to judge
			this.options.loadFinished = true;
			
			/**
			 * Validate the content container
			 * 
			 * If the container is null or container not exist,set the document.body as the container
			 */  
			if(!container || !container[0]){
				container = $(document.body);
			}
			
			// Definte the effect for the auto load plugin
			$.fn.autoLoadEffect = AUTO_LOAD_CONSTANTS.showEffect(this.options.mode) ? $.fn.show : $.fn.fadeIn;
			
			// Initialize the auto load plugin
			this.init(container);
		},
		init : function(container) {
			var _autoLoad = this;
			// Bind scroll event handler for the window object
			$(window).bind("scroll", function() {
				if(_autoLoad.options.ajaxData.counter >= _autoLoad.options.maxLoad){
					return;
				}
				
				// Scroll to bottom distance less than the plugin configuration,load the content
				if($(document).height() - $(this).scrollTop() - $(this).height() <= _autoLoad.options.offsetBottom){
					if(_autoLoad.options.loadFinished){
						_autoLoad.load(container);
					}
				}
			});
		},
		load : function(container) {
			// Update the ajax data counter
			this.options.ajaxData.counter++;
			this.options.loadFinished = false;
			
			// Load the content asynchronous
			if(!this.options.crossDomain){
				$.ajax({
					type : "GET",
					url : this.options.url,
					data : this.options.ajaxData,
					dataType : "json",
					success : function(data){
						//Deal with the data
						this.ajaxSuccess(data,container);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						this.ajaxError();
					}
				});
			}else{
				$.ajax({
					type : "GET",
					url : this.options.url,
					data : this.options.ajaxData,
					dataType : "jsonp",
					jsonpCallback : "callback",
					success : function(data){
						//Deal with the data
						this.ajaxSuccess(data,container);
					},
					error : function(XMLHttpRequest, textStatus, errorThrown){
						this.ajaxError();
					}
				});
			}
		},
		ajaxSuccess : function(data,container){
			// Validate the data
			if(data || data.length<=0){
				return;
			}
			
			// Append the loaded content to the content container
			$(data[this.options.dataAttribute]).hide().appendTo(container).autoLoadEffect(this.options.speed);
			
			// finish to load the content
			this.options.loadFinished = true;
		},
		ajaxError : function(){
			// Update the ajax counter
			this.options.ajaxData.counter--;
			
			// finish to load the content
			this.options.loadFinished = true;
		},
		validateInt : function(value) {
			return value < 0 || isNaN(value);
		}
	};
	
	// Define the global auto load function
	$.autoLoad = autoLoad;
}); 
