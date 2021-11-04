/* ==========================================================================
   Atividades Layout
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 01/04/2014
   ========================================================================== */

define(function (require) {
	'use strict';
	var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette');

	return Marionette.Layout.extend({
		initialize: function (options) {
			this.areaPerms = options.areaPerms;
		},

		id: 'slidingBlocksHolder',

		className: 'block-container',

		regions: {
			slidingBlocksContainer: '#slidingBlocksContainer'
		}
	});
});
