/* ==========================================================================
   Main Layout
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/02/2014
   ========================================================================== */

define(function(require) {
	'use strict';
	var App = require('app');
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var template = require('text!templates/common/main-layout-template.html');
	require('livicons');

	return Marionette.Layout.extend({
		initialize: function() {},
		id: 'mid',
		// className: 'content-holder undocked',
		// className: 'content-holder',
		template: _.template(template),
		regions: {
			siteSearch: '#siteSearch',
			leftSidebar: 'aside',
			sidebarContent: '#sidebarContent',
			breadcrumb: '#breadcrumb',
			actions: '#actions',
			tabbedNavigation: '#tabbedNavigation',
			content: '#main-holder'
		},
		onShow: function () {
			$('#dock i').addLivicon({ size: 26, color: '#4270a1' });
		}
	});
});
