/* ==========================================================================
   Sala Virtual Entity
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 22/04/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app');
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var nestCollection = require('libraries/nestCollection');
	var urlBuscarEstrutura;

    

	// Atividades
	var SVAtividadesCollection = Backbone.Collection.extend();

	// Sala Virtual Estrutura 
	var SVEstruturasModel = Backbone.Model.extend({
		initialize: function () {
			var collection = this.get('salaVirtualAtividades');
			this.atividades = nestCollection( this, 'salaVirtualAtividades', new SVAtividadesCollection( collection ) );
		}
	});
	
	var SVEntity = Backbone.Collection.extend({
	    initialize: function (options) {
	        
	        options.idSalaVirtualEstruturaRotuloTipo = (options.idSalaVirtualEstruturaRotuloTipo) ? options.idSalaVirtualEstruturaRotuloTipo : 1;
	        
	        if (!isNaN(options.idSalaVirtual)) {
	            urlBuscarEstrutura = (options.urlBuscarEstrutura) ? (options.urlBuscarEstrutura) : 'ava/SalaVirtualEstrutura/<%= idSalaVirtual %>/TipoOferta/<%= idSalaVirtualEstruturaRotuloTipo %>?idSalaVirtualOferta=<%= idSalaVirtualOferta %>&idSalaVirtualOfertaAproveitamento=<%= idSalaVirtualOfertaAproveitamento %>&idSalaVirtualOfertaPai=<%= idSalaVirtualOfertaPai %>';
	        }
	        else {
	            urlBuscarEstrutura = (options.urlBuscarEstrutura) ? (options.urlBuscarEstrutura) : 'ava/SalaVirtualEstrutura/0/TipoOfertaCriptografado/<%= idSalaVirtualEstruturaRotuloTipo %>?id=' + encodeURIComponent(options.idSalaVirtual) +'&idSalaVirtualOferta=<%= idSalaVirtualOferta %>&idSalaVirtualOfertaAproveitamento=<%= idSalaVirtualOfertaAproveitamento %>&idSalaVirtualOfertaPai=<%= idSalaVirtualOfertaPai %>';
	        }

	        this.contractEstrutura = (options.contractEstrutura) ? options.contractEstrutura : 'salaVirtualEstruturas';
	        

	        var SVUrl = _.template(App.config.baseUrl() + urlBuscarEstrutura);
		    this.url = SVUrl(options);
            
		},
		model: SVEstruturasModel, 
		parse: function (resp) {		    
		    return resp[this.contractEstrutura];
		}
	});

	return SVEntity;
});