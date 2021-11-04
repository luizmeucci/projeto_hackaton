/* ==========================================================================
   Main Layout
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/02/2014
   ========================================================================== */

define(function (require) {

	'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        template = require('text!templates/ava/three-columns-template.html');

	var MainLayout = Marionette.Layout.extend({
		template: _.template(template),
		regions: {
			breadcrumb: '#breadcrumb',
			actions: '#actions',
			content: '#main-holder',
            flashMessageInner: '#flashMessageInner'
		}/*,
		initialize: function initialize() {
		    $("#infobarItemView").html("");
		}*/
		
	});

    return MainLayout;
});
