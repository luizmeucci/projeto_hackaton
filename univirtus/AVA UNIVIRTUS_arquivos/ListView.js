/* ==========================================================================
   ListView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 03/03/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app');
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var AnexosView = require('views/common/AnexosView');

	var GenericModel = Backbone.Model.extend({});
	var GenericCollection = Backbone.Collection.extend({
		model: GenericModel
	});

	var ListItemView = Backbone.View.extend({
		initialize: function (options) {
			if (options) {
				this.colspan = options.colspan;
				if ( options.className ) {
					this.className = options.className;
				}
			}
		},
		tagName: 'td',
		render: function (item) {
			this.$el.append(item);
			if ( this.colspan ) {
				this.$el.prop('colspan', this.colspan);
			}
			return this;
		}
	});

	// View para um único item da lista
	var ListItemRow = Backbone.View.extend({
		// Constructor
		initialize: function () {
			var self = this;
			if ( this.model ) {
				this.model.on('add', function () {
					self.trigger('listitemrow:changed');
				});
			}
		},

		id: function () {
			var cid = (this.model !== void(0)) ? this.model.cid : 'emptyRow';
			return cid;
		},

		tagName: 'tbody',

		renderEmpty: function (options) {
			var message = 'Nada a listar.';
			var icon = '<i class=\'icon-warning-sign\'></i> ';
			var cellsLength = options.list.properties.length;
			var row = $('<tr>');
			var cell = $('<td>', {colspan: cellsLength}).html(icon+message);
			row.html(cell);
			row.addClass('warning');
			this.$el.html(row);
			return this;
		},

		// Renderizer
		render: function (options) {
			var c = 0;
			var properties = _.pick( this.model.toJSON(), options.list.properties );
			var tr = $('<tr>', {'class': 'main-row'});

			if ( options.list.trackClickState && this.model.toJSON().dataVisualizacao === null ) {
				this.$el.addClass('unread');
			} else {
				this.$el.addClass('read');
			}

			_.each(properties, function (value, key, obj) {
			    var klass = null;
			    if (options.list.rowHandler && options.list.rowHandler.addClass[c]) {
			    	klass = options.list.rowHandler.addClass[c];
			    }
			    var itemView = new ListItemView({className: klass});
				var cellContent = null;

				if ( typeof value === 'object' && value !== null ) {
					cellContent = value.nome;
				}
				else {
					cellContent = value;
				}

				if ( options.list.propertiesTypes[c] === 'dateTime' ) {
					cellContent = App.Helpers.date(value, true);
				}
                
				// Criando o data-title, que é utilizado pelo Breadcrumb para informar o que está sendo visualizado.
				if ( key === options.list.titleProperty ) { this.$el.data('title', value); }
				tr.append(itemView.render(cellContent).$el);
				c++;
			}, this);

			this.$el.append(tr);
			return this;
		}

	});

	var ListItemHidden = Backbone.View.extend({
		initialize: function (options) {
			this.urlAnexos = options.urlAnexos;
		},
		template: _.template('<h3 class="row-title"><%= title %></h3><article class="row-description"><%= description %></article><div class="show-anexos-placeholder"></div>'),
		tagName: 'tr',
		className: 'hidden-row hide',
		fetchAnexos : function(id) {
			var anexosCollection = new GenericCollection();
			anexosCollection.parse = function (resp) {
				return resp["comunicadoAnexos"];
			};
			var defer = $.Deferred();
			anexosCollection.url = _.template(this.urlAnexos, {'id': id});
			anexosCollection.fetch({
				success: function(response) {
					defer.resolve(response);
				}, 
				error: function (response) {
					defer.reject(response);
				}
			});

			return defer.promise();
		},
		render: function (data) {
			var self = this;
			var itemContent = $('<div>', {'class': 'row-content'});
			var compiledTemplate = this.template(data.properties);
			var colspan = data.options.list.properties.length;
			var cell = new ListItemView({'colspan': colspan});

			itemContent.append(compiledTemplate);
			this.$el.append(cell.render(itemContent).$el);

			if ( data.options.list.rowHandler.properties.attachments ) {
				
				var anexos = data.options.collection.get(data.id);
				var totalAnexos = anexos.toJSON().totalAnexos;

				if ( totalAnexos > 0 ) {
					$.when( self.fetchAnexos( anexos.get('id') ) ).done(function (collection) {
						var AnexosCollection = Backbone.Collection.extend({
							model: Backbone.Model.extend()
						});
						
						var aCollection = new AnexosCollection();
						_.each(collection.models, function (model) {
							var m = model.toJSON();
                            m.sistemaRepositorio.isRepo = true;
							aCollection.add(m.sistemaRepositorio);
						});
						var anexosView = new AnexosView({ 'collection': aCollection, 'totalAnexos': totalAnexos });
						self.$el.find(".show-anexos-placeholder").append(anexosView.render().$el).removeClass("hide");
					});
				}
			}
			return this;
		}
	});

	// View da Lista
	return Marionette.ItemView.extend({
		initialize: function (options) {
			this.options = options;
			this.options.list.clickable = options.list.clickable || false;
			var self = this;

			// EVENT LISTENERS
			// Ouvindo o SORT da lista
			this.listenTo(this.collection, 'sort', function() {
				self.$el.empty();
				self.render();
			});

			if ( this.options.list.trackClickState ) {
				this.comunicadoDestinatario = new GenericModel();
			}
		},

		template: _.template('<table id="list" class="list"></table>'),

		// @TODO: Implementar SORT
		events: {
			'click thead th' : function(e) {
				var $el = $(e.currentTarget),
					operator = null,
					property = $el.data('property');

				if ( !this.collection._sortingOrder || this.collection._sortingOrder === 'asc' ) {
					this.collection._sortingOrder = 'desc';
					operator = '-';
				}
				else {
					this.collection._sortingOrder = 'asc';
					operator = '';
				}
				this.collection.comparator = function (M) {
					var str = M.get(property);
					str = str.split('');
					str = _.map(str, function(letter) {
						var l = operator + letter.charCodeAt(0);
						return String.fromCharCode(l);
					});
					return str;
				};
				this.collection.sort();
			},

			'click tr.main-row': 'showItem',

			// 'click tr.hidden-row .showAnexos': 'showAnexosLinks',

			'click tr.hidden-row': function (e) {
				e.stopImmediatePropagation();
			}
		},
		showAnexosLinks: function (e) {
			// Fetch anexos
			var self = this;
			var $el = $(e.currentTarget);
			var rowId = $el.parents('tbody').prop('id');
			var model = this.collection.get(rowId);
			var anexosCollection = this.fetchAnexos(model.get("id"));

			$.when(anexosCollection).done(function(collection) {
				var anexosLinksContainer = $('#'+rowId).find('.anexos-links-container');
				anexosLinksContainer.empty();
				collection.each(function (anexo) {
					var linkTag = $("<a>", {href: anexo.get('url'), target: "_blank"}).html(anexo.get('vSistemaRepositorio').nome);
					anexosLinksContainer.append(linkTag);
				}, this);
				anexosLinksContainer.removeClass("hide");
			});
		},
		// Cabeçalhos das Colunas
		// A ordem das colunas deve coincidir com a ordem dos campos do formulário
		renderThead: function (options) {
			var thContent,
				thead = $('<thead></thead>'),
				tr = $('<tr></tr>'),
				counter = 0;

			// Iterar entre cada item do array de colunas e criar uma th com o valor
			_.each(options.list.columns, function(c, i) {
			    var th = $('<th></th>'), nTh = null, klass = null;
				if ( options.list.rowHandler && options.list.rowHandler.addClass ) {
					klass = options.list.rowHandler.addClass[counter]
				}
			    th.data('property', c.property);

                // Classe para a coluna
                if ( klass ) { th.prop('class', klass) }
				tr.append( th.html(c.title) );
				counter++;
			});

			// Inserindo as trs populadas numa thead
			thead.append(tr);

			// Adicionando a thead ao elemento da view
			this.$el.find('table').append(thead);
		},

		addOne: function (view) {
			var element = view.render(this.options).$el;
			this.$el.find('table').append(element);
		},

		setAsClicked: function (cid) {
			var id = this.collection.get(cid).toJSON().id;
			this.comunicadoDestinatario.url = this.options.urlLidas;
			this.comunicadoDestinatario.id = id;
			this.comunicadoDestinatario.set({'dataVisualizacao': 'newDate', 'id': id});
			this.comunicadoDestinatario.save();

			// Mudar classe do item
			this.$el.find('#'+cid).removeClass('unread').addClass('read');
		},

		// Mostra um item logo abaixo da linha principal (main-row)
		showItem: function (e) {
			var $el = $(e.currentTarget).parent();
			var cid = $el.prop('id');
			var title = $el.data('title');
			var self = this;
			var modelProperties = this.collection.get(cid).toJSON();

			// Highlight no item
			e.stopImmediatePropagation();
			// Verificando linha vazia
			if ( cid === 'emptyRow' ) { return false; }

			if ( this.options.list.trackClickState && modelProperties.dataVisualizacao === null ) {
				this.setAsClicked(cid);
			}

			// URL anexos
			if ( this.options.list.rowHandler && this.options.list.rowHandler.properties.attachments ) {
				this.urlAnexos = this.options.urlAnexos;
			}

			// Verifica se existe mais de uma linha renderizada.
			// Caso não, significa que não foi populado até o momento.
			// Se sim, o comportamento deve ser semelhante a um accordion, escondendo e mostrando itens no click.
			var hasChildRow = $('#'+cid+' tr').length > 1;

			if ( hasChildRow ) {
				this.toggleVisibility(cid);
				if ( $('#'+cid).hasClass('active') ) {
					this.trigger('itemshow', title);
				} else {
					this.trigger('itemhide');
				}
				return false;
			}

			// Remove a classe 'active'
			this.$el.parents('#page').on('click', function () {
				self.$el.find('tbody').removeClass('active');
				self.trigger('pageclicked');
			});

			var properties = (this.options.list.rowHandler) ? this.options.list.rowHandler.properties : null;
			var allowedProperties = {};
			var data = {};
			data.id = cid; // O id da linha
			data.options = this.options;

			if ( properties ) {
				_.each(properties, function (value, key) {
					allowedProperties[key] = modelProperties[value];
				});
				data.properties = allowedProperties; // As propriedades a renderizar
				var listItemHidden = new ListItemHidden({'urlAnexos': this.urlAnexos});
				var $el = this.$el.find('tbody#'+data.id +' tr.main-row');
				$el.after(listItemHidden.render(data).$el);
				$el.siblings('tr').removeClass('hide');
				this.trigger('itemshow', title);
				$('#'+data.id).toggleClass('active');
			}


		},

		toggleVisibility: function (tbodyId) {
			var $el = $('#'+tbodyId);
			$el.toggleClass('active');
		},

		onRender: function () {
			var self = this;
			var listItemRow;
			var collectionModels = this.collection.length;
			this.renderThead(this.options);

		    // Table ID
			this.$el.find('table').prop('id', this.options.list.id);

			if ( collectionModels > 0 ) {
				this.collection.each(function (model) {
					listItemRow = new ListItemRow({'model': model});
					this.addOne(listItemRow);
				}, this);
			}
			else {
				var item = new ListItemRow();
				this.$el.find('table').append(item.renderEmpty(this.options).$el);
			}
			if ( this.options.list.clickable ) {
				this.$el.find('table').addClass('clickable');	
			}
			this.trigger('listview:rendered');

			return this;
		}
	});

});