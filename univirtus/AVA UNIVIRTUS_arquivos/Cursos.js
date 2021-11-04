/* ==========================================================================
   Salas Virtuais Entity
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app');
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	return Backbone.Collection.extend({
	    initialize: function (options) {
	        if (options && options.url) {
	            this.url = options.url;
	        } else {
	            this.url = App.config.UrlWs('sistema') + 'curso/0/Usuario';
	        }
            
		},
		model: Backbone.Model.extend({}), 
		parse: function (resp) {
			return resp.cursos;
		}
	});

});