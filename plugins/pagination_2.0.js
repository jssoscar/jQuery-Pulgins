/**
 * Author		jssoscar
 * Date			2014-7-29 10:09:18
 * Version		1.0
 * Description	jQuery plugin for Pagination
 * Usage		$(function(){
				 	$(".pager").pagination(7);
				});
 *
 * Version		2.0
 * Date			2014-7-30 12:09:33
 * Changelog	. Fixed the bug when num_edge_entry equal 0
 * 				. Optimize the code
 * 
 */

/**
 * The Pagination model
 * 
 * @param {Integer} totalEntries : total entries
 * @param {Object} options : the configuration for the pagination plugin
 * @param {Object} container : the container for the pagination
 */
function Pagination(totalEntries, options, container){
	if(this instanceof Pagination){
		this.totalEntries = totalEntries;
		this.options = options;
		this.container = container;
		this.totalPage = Math.ceil(this.totalEntries / this.options.pageSize);
		this.currentPage = options.currentPage;
		this.init();
	}else{
		return new Pagination(totalEntries, options, container);
	}
}

/**
 * The prototype for the Pagination model
 * 
 * init : initialize the pagination
 * _render : the render for the pagination
 * _bind : bind event handler for the page link
 * _pageRange : calculate the start and end point for the pagination
 */
Pagination.prototype = {
	init : function(){
		this._render();
		this._bind();
	},
	_render : function(){
		var pageRange = this._pageRange(),
			paginationContent = [],
			halfPage = Math.ceil(this.options.num_displays / 2),
			start = pageRange.start,
			end = pageRange.end,
			index = 1,
			num_edge_entry = this.options.num_edge_entry,
			currentPage = this.currentPage,
			totalPage = this.totalPage,
			ellipse_text = this.options.ellipse_text;
			
		//Generate "First" and "Previous" link
		if(currentPage > 1){
			if(this.options.alwaysShowFirst && this.options.first){
				paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="1">' + this.options.first + '</a>');
			}
			if(this.options.alwaysShowPrev && this.options.prev){
				paginationContent.push('<a href="javascript:void(0)" class="prev" data-pager-pageno="' + (currentPage -1) + '">' + this.options.prev + '</a>');
			}
		}
		
		// Genereate the start link
		if(start > num_edge_entry){
			for(;index <= num_edge_entry;index++){
				paginationContent.push('<a href="javascript:void(0)" class="prev" data-pager-pageno="' + index + '">' + index + '</a>');
			}
			if( (start - num_edge_entry > 1) && ellipse_text && num_edge_entry > 0){
				paginationContent.push('<span>' + ellipse_text + '</span>');
			}
		}else{
			for(;index < start;index++){
				paginationContent.push('<a href="javascript:void(0)" class="prev" data-pager-pageno="' + index + '">' + index + '</a>');
			}
		}
		
		// Generate the pagination link
		for(var index = start;index <= end;index ++){
			if(index === this.currentPage){
				paginationContent.push("<em>" + index + "</em>");
			}else{
				paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
			}
		}
		
		// Generate the end link
		if(end < totalPage - num_edge_entry){
			if( (totalPage - num_edge_entry - end >= 1) && ellipse_text && num_edge_entry > 0){
				paginationContent.push('<span>' + ellipse_text + '</span>');
			}
			for(index = totalPage - num_edge_entry + 1;index <= this.totalPage;index++){
				paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
			}
		}else{
			for(index = end + 1;index <= this.totalPage;index++){
				paginationContent.push('<a href="javascript:void(0)" data-pager-pageno="' + index + '">' + index + '</a>');
			}
		}
		
		//Generate "First" and "Previous" link
		if(currentPage < this.totalPage){
			if(this.options.alwaysShowNext && this.options.next){
				paginationContent.push('<a href="javascript:void(0)" class="next" data-pager-pageno="' + (this.currentPage + 1) + '">' + this.options.next + '</a>');
			}
			if(this.options.alwaysShowLast&& this.options.last){
				paginationContent.push('<a href="javascript:void(0)" class="last" data-pager-pageno="' + this.currentPage + '">' + this.options.last + '</a>');
			}
		}
		
		// Generate the content
		$(this.container).html(paginationContent.join(""));
	},
	_bind : function(){
		var $this = this;
		$($this.container).delegate("a","click",function(){
			$this.currentPage = parseInt($(this).attr("data-pager-pageno"),10);
			$this._render();
			$this.options.callback && $this.options.callback($this.currentPage);
		});
	},
	_pageRange : function(){
		var start, end, 
			halfPage = Math.ceil(this.options.num_displays / 2), 
			upperLimit = this.totalPage - this.options.num_displays,
			currentPage = this.currentPage;
		start = currentPage > halfPage ? Math.max(Math.min(upperLimit, currentPage - halfPage), 1) : 1;
		end = currentPage > halfPage ? Math.min(currentPage + halfPage, this.totalPage) - 1 : Math.min(this.options.num_displays, this.totalPage);
		return {
			start : start,
			end : end
		};
	}
};

/**
 * 
 * @param {Integer} totalEntries : the total entries
 * @param {Object} options : the configuration for the Pagination
 * 		@param {Integer} pageSize : the pageSize
 * 		@param {String} first : the text for the first page button
 * 		@param {String} last : the text for the last page button
 * 		@param {String} prev : the text for the previous button
 * 		@param {String} next : the next for the next button
 * 		@param {Integer} currentPage : current page index
 * 		@param {Boolean} alwaysShowFirst : whether always show the first page button
 * 		@param {Boolean} alwaysShowLast : whether always show the last page button
 * 		@param {Boolean} alwaysShowPrev : whether always show the previous page button
 * 		@param {Boolean} alwaysShowNext : whether always show the next page button
 * 		@param {Integer} num_displays : Number of pages to show
 * 		@param {Integer} num_edge_entry : side to display for the Pagination
 * 		@param {String} ellipse_text : the ellipse text
 * 		@param {Function} callback : the callback
 */
jQuery.fn.pagination = function(totalEntries,options){
	options = $.extend({
		pageSize : 10,
		first : "First",
		last : "Last",
		prev : "Prev",
		next : "Next",
		currentPage : 1,
		alwaysShowFirst : true,
		alwaysShowLast : true,
		alwaysShowPrev : true,
		alwaysShowNext : true,
		num_displays : 6,
		num_edge_entry : 1,
		ellipse_text : "...",
		callback : function() {
		}
	}, options || {});

	if (totalEntries && totalEntries > options.pageSize) {
		this.each(function() {
			Pagination(totalEntries, options, $(this));
		});
	}
};
