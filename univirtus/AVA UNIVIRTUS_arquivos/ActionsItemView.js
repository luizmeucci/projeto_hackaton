/* ==========================================================================
   Actions ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 06/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';

	var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette');

	require('bootstrap');

	var SVListTPL = '<% if (cadastrar)  { %>' +
			'<a title="cadastrar" href="#/ava/<%= areaName %>/0/novo" class="Cadastrar<%= areaName %>"><i class="icon-plus-circle"></i></a>' +
            '<% } %>' +
            '<% if (buscar && areaName != "curso")  { %>' +
			'<a title="pesquisar" class="sv-adm-action-search" href="javascript: void(0)"><i class="icon-search"></i></a>'+
		    '<% } %>';


	return Marionette.ItemView.extend({
	    initialize: function (options) {
	        this.areaPerms = options.areaPerms;
	        this.areaName = options.areaName;
	        this.salaVirtualId = options.salaVirtualId;
	    },	    
		className: 'actions',

		template: _.template(SVListTPL),

		serializeData: function () {

		    return {
		        cadastrar: App.auth.viewCheckPerms('cadastrar', this.areaPerms),
		        buscar: App.auth.viewCheckPerms('visualizarTodos', this.areaPerms),
				areaName: this.areaName, 
				salaVirtualId: this.salaVirtualId
			};
		}
	});
});