/* ==========================================================================
   Left Sidebar ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/02/2014
   ========================================================================== */

define([
	'app',
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/common/left-sidebar-template.html'
], function (App, $, _, Backbone, Marionette, template) {
    'use strict';

    // Estrutura do Menu
    var menuStructure = [
		{
			'areaLabel': 'Comunicados', // Rótulo para a área 
			'sectionLabel': 'comunicados', // Rótulo da área livre de acentos. Deve coincidir com o nome registrado no Router
			'url': '#/pap/comunicados', // Url do link
			'actions': [{ 'label': 'Criar Comunicado', 'icon': 'icon-plus-circle', 'action': 'cadastrar' }], // Ações possíveis para a área atual
			'subAreas': null // Informações das subáreas
		},
		{
			'areaLabel': 'Solicitações', 
			'sectionLabel': 'solicitacoes',
			'url': '#/pap/solicitacoes',
			'actions': [{ 'label': 'Criar Solicitação', 'icon': 'icon-plus-circle', 'action': 'cadastrar' }],
			'subAreas': null
		},
		{
		    'areaLabel': 'Relatório Situação acadêmica',
			'sectionLabel': 'relatorios',
            'actions': null,
			'url': '#/pap/relatorios/relatorio-periculosidade',
			'subAreas':null
            //    [
			//	{
			//		'areaLabel': 'Relatório Periculosidade',
			//		'sectionLabel': 'relatoriopericulosidade',
			//		'url': '#/pap/relatorios/relatorio-periculosidade',
			//		'actions': null
			//	}, {
			//		'areaLabel': 'Relatório Usuários',
			//		'sectionLabel': 'relatoriousuariospolo',
			//		'url': '#/pap/relatorios/relatorio-usuarios',
			//		'actions': null
			//	}
			//]
		}, {
		    'areaLabel': 'Relatório Usuários',
		    'sectionLabel': 'relatoriousuariospolo',
		    'url': '#/pap/relatorios/relatorio-usuarios',
		    'actions': null,
            'subAreas':null
		}
	];

	var Collection = Backbone.Collection.extend({
		model: Backbone.Model.extend({})
	});

	var fetchCollection = function() {
		var collection = new Collection(menuStructure);
		return collection;
	};

    // Tenta determinar qual o router ativo: main, pap ou ava
    // Tenta determinar qual a página atual.
    function getCurrentPage () {
        var url = document.location.hash,
            arr = url.split('/'),
            page = (arr[2]) ? arr[2].toLowerCase() : '';

        return page;
    }

	var router;

	var menuItemTemplate = '<h3><a href="<%= url %>"><%= areaLabel %></a></h3>' +
		'<% if (subAreas && subAreas.length) { %>' +
			'<ul class="actions">' +
				'<% _.each( subAreas, function (subArea) { %>' +
					'<li><a data-section="<%= subArea.sectionLabel %>" href="<%= subArea.url %>"><%= subArea.areaLabel %></a></li>' +
				'<% }); %>' +
			'</ul>' +
		'<% } %>' +
		'<% if ( actions && actions.length) { %>' +
			'<ul class="actions">' +
				'<% _.each( actions, function (action) { %>' +
					'<li><a data-action="<%= action.action %>" href="#"> <i class="<%= action.icon %>"></i> <%= action.label %></a></li>' +
				'<% }); %>' +
			'</ul>' +
		'<% } %>';

	var MenuItemView = Marionette.ItemView.extend({
		tagName: 'header',
		template: _.template( menuItemTemplate ),
		serializeData: function () {
			var model = this.model.toJSON();
			this.$el.data('section', model.sectionLabel);
			return model;
		}
	});

	return Marionette.CollectionView.extend({
        initialize: function (options) {
            var self = this;

            if ( options && options.actions ) { this.actions = options.actions; }
			this.collection = fetchCollection();

            // Define o item ativo sempre que a aplicação anuncia a mudança de rota
            App.vent.off('route:before:leftsidebar');
            App.vent.on('route:before:leftsidebar', function () {
                self.setActiveItem();
            });
		},

		itemView: MenuItemView,

		events: {
            'click a': 'handleLinkClick'
		},

		handleLinkClick: function (e) {
			var actions = ['cadastrar', 'editar', 'remover'],
				$el = $(e.currentTarget),
				href = $el.prop('href'),
				hasHash = href.split('/').reverse()[0] === '#',

				itemAction = $el.data('action'),
				siteSection = $el.parents('header').data('section');

			// Click nos sublinks
			if ( hasHash ) {
				e.preventDefault();
				if ( itemAction && _.contains(actions, itemAction) ) { $('#' + itemAction).trigger('click'); }
			}
		},

        // Define o status de ativo no item do menu, de acordo com a url
        setActiveItem: function () {
            var page = getCurrentPage();
            this.$el.find('header')
                .removeClass('active')
                .each(function () {
                    var section = $(this).data('section');
                    section = section.split(',');
                    if (_.contains(section, page)) { $(this).addClass('active'); }
                });
        },

		onShow: function () {
            this.setActiveItem();
			// @TODO: Descobrir como delegar os eventos sem utilizar o método delegateEvents
			// Esta é uma solução temporária.
			// Re-delegando os eventos:
			this.delegateEvents();
		}
	});

});
