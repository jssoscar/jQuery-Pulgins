/**
 * Author		jssoscar
 * Date			2013-10-23 13:00:20
 * Version		1.0
 * Description	jQuery plugin for tabs
 * 
 * Version		1.0.2
 * Date			2013-11-5 14:12:55
 * Note			. Add the current class support for the tab element
 * 				. Optimize the tab display effect code
 * 				. Fixed the bug
 * 				
 */
/**
 * Define the tabs function
 * 
 * @param {Object} config : the tab plugin configuraion
 */
jQuery.fn.tabs = function(config){
	var Tabs = {
		Events : {
			C : "click",
			M : "mouseover"
		},
		Mode : {
			S : "show",
			F : "fade"
		},
		isClick : function (config){
			return config.eventType === this.Events.C;
		},
		isMouseover : function (config){
			return config.eventType === this.Events.M;
		},
		showEffect : function (config){
			return config.mode === this.Mode.S;
		},
		fadeEffect : function (config){
			return config.mode === this.Mode.F;
		}
	},defaultCfg = {
		eventType : Tabs.Events.C, // the tabs event type
		auto : false, // auto switch the tabs
		interval : 5, // the interval time. The value represents seconds
		speed : 0, // the switch speed. The value represents seconds
		tabContent : null,
		currentClass : {
		}
	},$this = $(this);
	
	// Extend the default configuration
	extendCfg(defaultCfg,config);
	
	// Define the tab display effect
	$.fn.tabEffect = !Tabs.showEffect(defaultCfg) ? $.fn.show : $.fn.fadeIn;
	
	// Deal with the tabs element
	$this.each(function(){
		var $tabs = $(this),li = $tabs.find(">li"),tabsController = {
			count : 0,
			li_length : li.length,
			finished : true,
			interval : null,
			currentIndex : 0
		},eventType = defaultCfg.eventType + " mouseout";
		
		// Bind event handler for the tab child node
		$(li).bind(eventType,
			 function(event){
				switch(event.type){
					case Tabs.Events.C : 
					case Tabs.Events.M : {
						if(tabsController.finished){
							if(defaultCfg.auto){
								stop(tabsController);
							}
							tabsController.count = $(this).index();
							switcher($(li),tabsController);
						}
						break;
					}
					case "mouseout" : {
						if(defaultCfg.auto){
							start($(li),tabsController);
						}
						break;
					}
					default : {
						return;
					}
				}
			}
		);
		
		// Start the tab switcher if the configuration parameter 'auto' is true
		if(defaultCfg.auto){
			start($(li),tabsController);
		}
	});
	
	/**
	 * Extend the default configuration 
	 * 
 	 * @param {Object} defaultCfg : default configuration for the tab plugin
 	 * @param {Object} custom : custom configuration for the tab plugin
	 */
	function extendCfg(defaultCfg,custom){
		$.extend(defaultCfg,custom);
		
		// Deal with the tab event
		if(Tabs.isClick(defaultCfg) && Tabs.isMouseover(defaultCfg)){
			defaultCfg.eventType = Tabs.Events.C;
		}
		
		// Deal with the interval
		if(defaultCfg.auto && defaultCfg.interval<=0){
			defaultCfg.interval = 5;
		}
		defaultCfg.interval = defaultCfg.interval * 1e3;
		
		//Deal with the speed
		if(defaultCfg.speed<0){
			defaultCfg.speed = 0;
		}
		defaultCfg.speed = defaultCfg.speed * 1e3;
		
		// Deal with the tab display effect
		if(!Tabs.showEffect(defaultCfg) && !Tabs.fadeEffect(defaultCfg)){
			defaultCfg.mode = Tabs.Mode.S;
		}
		
		// Deal with the current tab class
		if(defaultCfg.currentClass){
			defaultCfg.classIndex = 0;
			defaultCfg.switchClass = true;
		}
	}
	
	/**
	 * Start the tab switcher
	 * 
	 * @param {Object} obj : all the tab li element
 	 * @param {Object} tabsController : the tab controller
	 */
	function start(obj,tabsController){
		tabsController.interval = setInterval(function(){
			tabsController.count++;
			if(tabsController.count === tabsController.li_length){
				tabsController.count = 0;
			}
			switcher(obj,tabsController);
		},defaultCfg.interval);
	}
	
	/**
	 *  Switcher for the tab element
	 * 
	 *  If configed the current class :
	 *  . Add class for the current tab element
	 *  . Remove class from the previous tab element
	 * 
	 *  Hide all the tab content element
	 *  Display the tab content which index equals the tab controller count parameter
	 * 
	 * @param {Object} obj : the tab li element
 	 * @param {Object} tabsController : the tab controller
	 */
	function switcher(obj,tabsController){
		tabsController.finished = false;
		
		if(defaultCfg.switchClass){
			if(defaultCfg.currentClass[tabsController.count]){
				obj.eq(tabsController.count).addClass(defaultCfg.currentClass[tabsController.count]);
			}
			obj.eq(defaultCfg.classIndex).removeClass(defaultCfg.currentClass[defaultCfg.classIndex]);
		}
		
		defaultCfg.tabContent.hide();
		defaultCfg.tabContent.eq(tabsController.count).tabEffect(defaultCfg.speed,function(){
			tabsController.finished = true;
			defaultCfg.classIndex = tabsController.count;
		});
	}
	
	/**
	 * Stop the switcher if tab supported event toggle 
	 * 
 	 * @param {Object} tabsController : the tab controller
	 */
	function stop(tabsController){
		clearInterval(tabsController.interval);
	}
};