/**
 * Author		jssoscar
 * Date			2013-10-23 13:00:20
 * Version		1.0
 * Description	jQuery plugin for tabs
 */

/**
 * Define the tabs function 
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
		}
	},defaultCfg = {
		eventType : Tabs.Events.C, // the tabs event type
		auto : false, // auto switch the tabs
		interval : 5, // the interval time. The value represents seconds
		speed : 0, // the switch speed. The value represents seconds
		tabContent : null
	},$this = $(this);
	
	// Extend the default configuration
	extendCfg(defaultCfg,config);
	
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
							switcher(tabsController);
						}
						break;
					}
					case "mouseout" : {
						if(defaultCfg.auto){
							start(tabsController);
						}
						break;
					}
					default : {
						return;
					}
				}
			}
		);
		
		// Switch the tab automatically if the configuration parameter 'auto' is true
		if(defaultCfg.auto){
			start(tabsController);
		}
	});
	
	/**
	 * Switch the tab automatically
	 * 
 	 * @param {Object} tabsController : the tab controller
	 */
	function start(tabsController){
		tabsController.interval = setInterval(function(){
			tabsController.count++;
			if(tabsController.count === tabsController.li_length){
				tabsController.count = 0;
			}
			switcher(tabsController);
		},defaultCfg.interval);
	}
	
	/**
	 *  Switcher for the tab element
	 * 
 	 * @param {Object} tabsController : the tab controller
	 */
	function switcher(tabsController){
		tabsController.finished = false;
		if(showEffect(defaultCfg)){
			defaultCfg.tabContent.hide();
			$(defaultCfg.tabContent.get(tabsController.count)).show(defaultCfg.speed,function(){
				tabsController.finished = true;
			});
		}else{
			defaultCfg.tabContent.hide();
			$(defaultCfg.tabContent.get(tabsController.count)).fadeIn(defaultCfg.speed,function(){
				tabsController.finished = true;
			});
		}
	}
	
	/**
	 * Stop the switcher if tab supported event toggle 
	 * 
 	 * @param {Object} tabsController : the tab controller
	 */
	function stop(tabsController){
		clearInterval(tabsController.interval);
	}
	
	/**
	 * Extend the default configuration 
	 * 
 	 * @param {Object} defaultCfg : default configuration for the tab plugin
 	 * @param {Object} custom : custom configuration for the tab plugin
	 */
	function extendCfg(defaultCfg,custom){
		$.extend(defaultCfg,custom);
		
		// Deal with the tab event
		if(isClick(defaultCfg) && isMouseover(defaultCfg)){
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
		
		if(!showEffect(defaultCfg) && !fadeEffect(defaultCfg)){
			defaultCfg.mode = Tabs.Mode.S;
		}
	}
	
	/**
	 * Click event 
 	 * @param {Object} config : configuration for the tab plugin
	 */
	function isClick(config){
		return config.eventType === Tabs.Events.C;
	}
	
	/**
	 * Mouseover event
	 * 
 	 * @param {Object} config : configuration for the tab plugin
	 */
	function isMouseover(config){
		return config.eventType === Tabs.Events.M;
	}
	
	/**
	 * Show mode
	 * 
 	 * @param {Object} config : configuration for the tab plugin
	 */
	function showEffect(config){
		return config.mode === Tabs.Mode.S;
	}
	
	/**
	 * Fadein mode 
 	 * @param {Object} config : configuration for the tab plugin
	 */
	function fadeEffect(config){
		return config.mode === Tabs.Mode.F;
	}
};