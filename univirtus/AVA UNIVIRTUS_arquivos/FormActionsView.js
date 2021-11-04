/* ==========================================================================
	FormActions ItemView
	@author: Thyago Weber (thyago.weber@gmail.com)
	@date: 05/03/2014
	========================================================================== */
define(function (require) {
	'use strict';
	var App = require('app');
	var $ = require('jquery');
	var _ = require('underscore');
	var Backbone = require('backbone');

	var FormActionsItemView = Backbone.View.extend({
		tagName: 'i',
		render: function (attrs) {
			this.$el.prop('class', 'icon-'+attrs.icon)
				.prop('id', attrs.id)
				.prop('title', attrs.title);
			return this;
		}
	});

	var FormActionsView = Backbone.View.extend({
		initialize: function (options) {
            if ( options && options.actions ) {
                this.actions = options.actions;
            }
		},
		events: {
			'click i' : function(e) {
				e.preventDefault();
				var $el = $(e.currentTarget);
				var id = $el.prop('id');
				// create, edit, remove
				this.trigger(id);
			}				
		},
		className: 'actions',
		render: function () {
			var viewOptions = null;
			var self = this;

			var callbackObject = {
				cadastrar: function () {
					return { id: 'cadastrar', title: 'Cadastrar', icon: 'plus-circle' };
				},
				editar: function () {
					return { id: 'editar', title: 'Editar', icon: 'pencil' };
				},
				'default': function () {
					return { id: 'remover', title: 'Remover', icon: 'trash' };
				}
			};

			var appendToEl = function(el) {
				var itemView = new FormActionsItemView(),
					link = $('<a>');
				link.append(itemView.render(el).$el);
				self.$el.append(link);
			};

            if ( this.actions ) {
                App.handleActions(this.actions, callbackObject, appendToEl);
            }

			return this;
		}

	});
	
	return FormActionsView;
});