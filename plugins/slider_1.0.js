/**
 * Author		jssoscar
 * Date			2013-10-15 14:30:26
 * Version		1.0
 * Description	jQuery plugin for slider
 * Since		1.0
 */
$.fn.slider = function(config) {
	// Slider configuration
	var Slider = {
		DIRECTIONS : {
			"L" : "left",
			"T" : "top"
		},
		EVENTS : {
			"C" : "click",
			"M" : "mouseover",
			"O" : "mouseout"
		}
	}, defaultCfg = {
		direction : Slider.DIRECTIONS.L,
		auto : true,
		interval : 5,
		speed : 1,
		cycle : true,
		callback : null,
		rollMult : 1,
		nav : false,
		navContainer : null,
		eventType : Slider.EVENTS.C,
		currentNavClass : null
	};
	var options = extendConfig(defaultCfg, config);

	// Slider handler
	this.each(function() {
		var _this = $(this), li = _this.find("li"), sliderController = {
			count : 0,
			li_length : li.length,
			li_width : li.width(),
			li_height : li.height(),
			slider : null,
			sliderFinished : true
		};

		// If the slider only has one "li" slider node , do nothing
		if (sliderController.li_length <= 1) {
			return;
		}

		// Rolling cycle
		if (options.cycle) {
			// sliderController.li_length++;
			_this.find("ul").append($("ul li:first-child").clone());
		}

		// Calculate the slider parent node width and height attribute
		if (slide2Left(options)) {
			_this.find("ul").width((sliderController.li_length + 1) * sliderController.li_width).height(sliderController.li_height);
		} else if (slide2Top(options)) {
			_this.find("ul").width(sliderController.li_width).height((sliderController.li_length + 1) * sliderController.li_height);
		}

		// Generate navigator content
		if (options.nav) {
			if (options.navContainer && options.navContainer[0]) {
				var navContent = [];
				for (var i = 0; i < sliderController.li_length; i++) {
					if (i === 0 && options.currentNavClass != null) {
						navContent[i] = "<a href='javascprit:void(0);' class='" + options.currentNavClass + "'>" + (i + 1) + "</a>";
						continue;
					}
					navContent[i] = "<a href='javascprit:void(0);'>" + (i + 1) + "</a>";
				}
				options.navContainer.html(navContent.join(""));
				if (mouseoverEvent(options)) {
					options.navContainer.find("a").bind("mouseover", function() {
						stopSlider(sliderController);
						if(sliderController.sliderFinished){
							sliderController.count = $(this).index();
							autoSlide(_this, sliderController);
						}
					});
					options.navContainer.find("a").bind(Slider.EVENTS.O, function(event) {
						if(sliderController.sliderFinished){
						  startSlider(_this, sliderController);
						}
					});
				}else if (clickEvent(options)) {
					options.navContainer.find("a").bind(options.eventType, function() {
						updateNavButton($(this),_this,sliderController);
					});
				}
			}
		}
		startSlider(_this, sliderController);
	});

	/**
	 * Extend the config information.Mainly contains the following:
	 * .	Deal with the animate interval
	 * .	Deal with the slider direction
	 * .	Deal with the slider navigator button event handler
	 * 
	 * @param {Object} defaultCfg : slider default config
	 * @param {Object} config : customer config
	 */
	function extendConfig(defaultCfg, config) {
		var options = $.extend(defaultCfg, config);
		
		// Deal with the animate interval
		options.interval = options.interval * 1e3;
		options.speed = options.speed * 1e3;
		
		// Deal with the slider direction
		if (!slide2Left(options) && !slide2Top(options)) {
			options.direction = Slider.DIRECTIONS.L;
		}
		
		// Deal with the slider navigator button event handler
		if(clickEvent(options) && !mouseoverEvent(options)){
			options.eventType = Slider.EVENTS.C;
		}
		return options;
	}

	/**
	 * Start the slider : start to animate the DOM element
	 * 
	 * @param {Object} obj : the DOM element for slide
	 * @param {Object} sliderController : the slider controller
	 */
	function startSlider(obj, sliderController) {
		sliderController.slider = setInterval(function() {
			sliderController.count++;
			/*
			if (sliderController.count === sliderController.li_length) {
							sliderController.count = 0;
						}*/
			
			autoSlide(obj, sliderController);
		}, options.interval);
	}

	/**
	 * Slide automatically
	 * .	Animate the slider block
	 * .	Switch the navigator button if it exists
	 * 
	 * @param {Object} obj : the slider object
	 * @param {Object} sliderController : the slider controller
	 */
	function autoSlide(obj, sliderController) {
		
			
				console.log(sliderController.count + '| b');
		sliderController.sliderFinished = false;
		var autoCss = {}, direction = 'margin-' + options.direction;
		autoCss[direction] = getMarginPosition(sliderController);
		obj.find("ul").animate(autoCss, options.speed, function() {
			sliderController.sliderFinished = true;
			if (options.cycle && sliderController.count === sliderController.li_length) {
				sliderController.count = 0;
				$(this).css(direction, "0px");
			}
			if(options.nav){
				console.log(sliderController.count + '| c');
				options.navContainer.find("a:eq("+sliderController.count+")").addClass(options.currentNavClass).siblings().removeClass(options.currentNavClass);
			}
		});
		
		
	}

	/**
	 * Stop slider : clear the slider interval
	 * 
	 * @param {Object} sliderController : the slider controller
	 */
	function stopSlider(sliderController) {
		clearInterval(sliderController.slider);
	}

	/**
	 * Judgement for whether the slider is scroll to left
	 * 
	 * @param {Object} options : the slider parameter configuration
	 */
	function slide2Left(options) {
		return options.direction === Slider.DIRECTIONS.L;
	}

	/**
	 * Judgement for whether the slider is scroll to top
	 * 
	 * @param {Object} options : the slider parameter configuration
	 */
	function slide2Top(options) {
		return options.direction === Slider.DIRECTIONS.T;
	}

	/**
	 * Navigator button click event handler
	 */
	function clickEvent(options) {
		return options.eventType === Slider.EVENTS.C;
	}

	/**
	 * Navigator button mouseover event handler
	 */
	function mouseoverEvent(options) {
		return options.eventType === Slider.EVENTS.M;
	}
	
	/**
	 * Update the navigator buton status
	 * 
	 * @param {Object} currentNavBtn : current navigator button
	 * @param {Object} root : the root DOM element.Here,it's the caller element.
	 * @@param {Object} sliderController : the slider controller
	 */
	function updateNavButton(currentNavBtn,root,sliderController){
		if(clickEvent(options)){
			sliderController.count = currentNavBtn.index();
			autoSlide(root, sliderController);
			currentNavBtn.addClass(options.currentNavClass).siblings().removeClass(options.currentNavClass);
		}
	}

	/**
	 * Get slider margin position : acoording to the slider direction , get margin-left value or margin-top value
	 * 
	 * @param {Object} options : the slider config options
	 * @param {Object} sliderController : slider controller
	 */
	function getMarginPosition(sliderController) {
		if (slide2Left(options)) {
			return -sliderController.li_width * options.rollMult * sliderController.count;
		} else if (slide2Top(options)) {
			return -sliderController.li_height * options.rollMult * sliderController.count;
		}
	}
}; 