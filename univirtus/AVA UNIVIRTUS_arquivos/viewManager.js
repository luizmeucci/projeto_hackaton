/* ==========================================================================
   View Manager
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 03/03/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var LazyLoader = require('libraries/LazyLoader');
	var SlidingBlockBaseLayout = require('views/common/SlidingBlockBaseLayout');
	var slidingBlockLayoutTemplate = '<div id="slidingBlocksContainer"></div>';
	var slidingView = require('libraries/slidingView');
	var slider = null;
	var Events = _.extend({}, Backbone.Events);

	// Layout
	var SlidingBlockLayout = SlidingBlockBaseLayout.extend({
		events: {
			'click #slidingBlocksContainer .goBack': 'goBackClick'
		},
		goBackClick: function () {
			var activeItem = this.slider.getActiveItem(),
			activeItemName = this.slider.getSliderInfo().blockItemIncrementPrefix;
			this.slider.setActiveItem(activeItem-1);
		},
		template: _.template(slidingBlockLayoutTemplate)
	});

	// Collection para armazenar as views abertas	
	var Model = Backbone.Model.extend({
		'defaults': {
			'viewName': null,
			'viewInstance': null,
			'layoutInstance': null
		}
	}),

	Collection = Backbone.Collection.extend({
		'model': Model,
		'getByViewName': function (viewName) {
			var filtered = this.filter(function (model) {
				return model.get('viewName') === viewName;
			});
			// return new Collection(filtered);
			return filtered[0];
		},
		'getLastAdded': function () {
			var model = this.at(this.length-1);
			return model;
		}
	}),

	viewCollection,

	// Adiciona uma view à pilha 
	addToCollection = function (data) {
		var model = viewCollection.getByViewName( data.viewName );
		// Se a view já não constar da pilha, adiciona-a
		if ( !model ) { 
			viewCollection.add(data); 
			model = viewCollection.getLastAdded();
		}

		Events.trigger('collection:add', {'model': model, 'options': data});
	},

	slidingBlockLayout = new SlidingBlockLayout(),

	init = function () {
		viewCollection = new Collection();
	},

	// Adiciona um novo bloco a SlidingBlocksItemView
	addBlockItem = function (options) {
		var blockNumber;

		// Adiciona novo bloco
		slider.addItem({'blockId': options.blockViewId});

		// Recuperar o número do bloco recém criado
		blockNumber = $( '#'+options.blockViewId ).data('block-number');

		// Tornar bloco ativo
		slider.setActiveItem(blockNumber);
	},

	viewTypesHandler = {
		// View Type: Slide - SlidingBlocksItemView
		'slider': function (options) {
			var viewName = options.model.toJSON().viewName+'View';

			// @TODO: Se houver view ativa, esconde-a

			slidingBlockLayout.on('show', function () {
				slider = slidingView();
				slider.init();
			});

			// Se o slider não tiver sido inicializado
			if ( !slider ) {
				// Aplica o SlidingBlockLayout ao MainLayout
				options.layoutInstance.content.show( slidingBlockLayout );
			}

			// Insere novo bloco
			addBlockItem({ 'blockViewId': viewName, 'viewInstance': options.viewInstance });

			// Insere o conteúdo da view no novo bloco gerado
			$( '#'+viewName ).html( options.viewInstance.$el );
		},

		// View Type: Static
		'static': function (options) {
			var viewName = options.viewName,
			layoutInstance = options.layoutInstance,
			viewInstance = options.viewInstance,
			currentView;

			try {
				currentView = layoutInstance[viewName].currentView;
			} catch(e) {
				throw new Error('Um erro ocorreu ao tentar obter a region "'+ viewName +'" do layout: A região não existe.');
			}

			if ( currentView !== viewInstance ) {
				layoutInstance[viewName].show(viewInstance);
			}

		}
	},

	set = function (options) {
	/**
	 * - Adiciona a instância da view e do layout (parent view) numa coleção para utilização posterior
	 * - Tipos de view: slider e static
	 * - Dependendo do tipo de view, escolhe um lugar para a renderização.
	 */
		var defaults = {
			'viewName': null,       // Nome único para a view. O script manterá apenas a última view adicionada
			'viewInstance': null,   // Instância da view
			'layoutInstance': null, // Instância do layout
			'type': 'slider'        // Tipo de view
		},

		opts = _.defaults(options, defaults),

		allowedTypes = ['slider', 'static'];

		if ( !opts.viewName ) { throw new Error('Parâmetro options.viewName nulo ou indefinido.'); }
		if ( !opts.type ) { throw new Error('Parâmetro options.type nulo ou indefinido.'); }
		if ( !_.contains(allowedTypes, opts.type) ) { throw new Error('Parâmetro options.type inválido. Esperado: "slider" ou "static". Fornecido: "'+opts.type+'"'); }

		Events.off('collection:add');
		Events.on('collection:add', function collectionAddEventHandler(data) {
			var handlerOptions = {};
			handlerOptions.model = data.model;
			_.extend(handlerOptions, data.options);

			// Montar container
			viewTypesHandler[handlerOptions.type]( handlerOptions );
		});

		// Adiciona a view a collection
		addToCollection(opts);
	},

	// Acessa o conteúdo de uma view armazenada
	get = function (options) {
		options = options || {};
		var defaults = { 'viewName': null },
		opts = _.defaults(options, defaults),
		view, element;

		if ( !opts.viewName ) { throw new Error('Parâmetro options.viewName NULO ou INDEFINIDO.'); }

		view = viewCollection.getByViewName(opts.viewName);

		if ( view ) {
			element = view.toJSON().viewInstance.$el;			
		} else {
			element = 'vazio';
		}

		return element;
	},

	// Retorna todas as views armazenadas na pilha
	getAll = function () {
		var views = [];
		viewCollection.each(function(model) {
			views.push(model.toJSON().viewInstance.$el);
		});

		return views;
	};

	init();

	return function () {
		return {
			'set': set,
			'get': get,
			'getAll': getAll
		};
	};
		
	
});