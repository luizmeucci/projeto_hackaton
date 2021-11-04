/* ==========================================================================
   Main Layout Home
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/05/2014
   ========================================================================== */

define(function(require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        template = require('text!templates/ava/three-columns-home-template.html');


     
    return Marionette.Layout.extend({
		template: _.template(template),
		regions: {
			sidebarContent: '#sidebarContent',
			homeHeader: '#home-header',
			actions: '#actions',
			svList: '#sv-list',
			content: '#main-holder'
		},
		initialize: function initialize() {
		    $("#infobarItemView").html("");
		}
    });

    
});

