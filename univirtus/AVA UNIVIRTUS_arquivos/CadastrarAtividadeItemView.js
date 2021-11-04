/* ==========================================================================
   Cadastrar Atividades Item View
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 28/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app');
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Marionette = require('marionette');

//	var tpl = '<div class="dropdown">'+
//		'<a class="atv-cadastrar dropdown-toggle"><i class="icon-plus-circle"></i> Atividade</a>'+
//		'<ul class="cadastrar-atividade-tipos dropdown-menu pull-right" role="menu" aria-labelledby="dLabel"></ul>'+
//	'</div>';

    var tpl = '<ul class="cadastrar-atividade-tipos list-group" aria-labelledby="dLabel"></ul>';

	var itemTpl = '<a><i class="<%= icone %>"></i> <span><%= nome %></span></a>';
	
	var AtividadeTiposCollection = Backbone.Collection.extend({
	    initialize: function (options) {	        
            this.idSalaVirtualEstruturaRotuloTipo = options.idSalaVirtualEstruturaRotuloTipo;
        },
		model: Backbone.Model.extend({}),
		parse: function (resp) {		    
			return resp.atividadeTipos;
		},
		url: function () {
		    
		    
            return App.config.UrlWs('atv')+'AtividadeTipo/'+this.idSalaVirtualEstruturaRotuloTipo+'/Estrutura';
        }
	});

	var idSalaVirtual;

	var DropdownItem = Backbone.View.extend({
		template: _.template(itemTpl),
		tagName: 'li',
        className: 'list-group-item',
		render: function(model) {
			var renderedTemplate = this.template( model.toJSON() );
			this.$el
				.data({ 'idAtividadeTipo': model.id, 'idSalaVirtual': idSalaVirtual })
				.append(renderedTemplate); 
			return this;
		}
	});

	var dataHandler = function (response, view) {
		_.each( response.models, function (model) {
			var dropdownItem = new DropdownItem();
			view.$el.find('.cadastrar-atividade-tipos').append( dropdownItem.render(model).$el );
		});
        view.trigger('rendered');
	};
	
	return Backbone.View.extend({
	    initialize: function (options) {
	        
	        this.idSalaVirtualEstruturaRotuloTipo = options.idSalaVirtualEstruturaRotuloTipo;
		            
	        this.collection = new AtividadeTiposCollection({ idSalaVirtualEstruturaRotuloTipo: this.idSalaVirtualEstruturaRotuloTipo });
	           

			this.idSalaVirtualEstrutura = options.idSalaVirtualEstrutura;
			idSalaVirtual = options.idSalaVirtual;
			this.idCurso = options.idCurso;
			//this.urlEstrutura = (options.urlEstrutura) ? options.urlEstrutura : "salaVirtualEstrutura";
			this.rotinaAtividade = (options.rotinaAtividade) ? options.rotinaAtividade : "salaVirtualAtividade";			
			this.urlEditarAtividade = (options.urlEditarAtividade) ? options.urlEditarAtividade : '#/ava/salaVirtualAtividade/<%= id %>/editar';
		},
		template: _.template(tpl),
		events: {
			'click li': 'handleListItemClick'
		},
		handleListItemClick: function (e) {
			var $el = $(e.currentTarget),
                svEstruturaId = $('#slidingBlocksHolder').data('active-item');
			this.cadastrarAtividade($el.data('idAtividadeTipo'), svEstruturaId);
			
		},
		cadastrarAtividade: function (idAtividadeTipo, svEstruturaId) {
		    var idSalaVirtual = 0;
		    var self = this;
		    var idSalaVirtualOferta = 0,
                idSalaVirtualOfertaPai = null;

		    try {
		        idSalaVirtual = App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtual;
		    }
		    catch (e) { console.error(e) };
		    try {
		        idSalaVirtualOferta = App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOferta;
		    }
		    catch (e) {console.error(e)};
		    try {
		        idSalaVirtualOfertaPai = App.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOfertaPai;
		    }
		    catch (e) { console.error(e) };

		    App.Helpers.ajaxRequest({
		        url: App.config.UrlWs('ava') + self.rotinaAtividade,
		        type: 'POST',
		        async: true,
		        data: {
		            'idAtividadeTipo': idAtividadeTipo,
		            'idSalaVirtual': idSalaVirtual,
		            'idSalaVirtualEstrutura': svEstruturaId,
		            'idCursoEstrutura': svEstruturaId,
		            'idSalaVirtualOferta': idSalaVirtualOferta,
		            'idSalaVirtualOfertaPai': idSalaVirtualOfertaPai,
		            'idCurso': self.idCurso
		        },
		        successCallback: function (response) {
		    
		            var tpl = _.template(self.urlEditarAtividade);
		            var link = tpl({ id: response.id, cId:response.cId });
		            var redirectUrl = link;
		            $('html').trigger('click.popover');
		            document.location = redirectUrl;
		        }
		    });
		},
		setIdSalaVirtualEstrutura: function () {
            this.$el.find('li').data('idSalaVirtualEstrutura', this.idSalaVirtualEstrutura);
            return this;
        },
        render: function () {
			var self = this;
			this.$el.append(self.template());
			this.setIdSalaVirtualEstrutura();
			


			if (self.atividadeTiposCollection) {
			    dataHandler(self.atividadeTiposCollection, self);
			}
			else {
			    this.collection.fetch({
			        success: function (response) {
			            dataHandler(response, self);
			        }
			    });
			}
		}
	});
});