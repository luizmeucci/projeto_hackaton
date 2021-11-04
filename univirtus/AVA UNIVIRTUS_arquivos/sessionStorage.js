/* ==========================================================================
   Session Storage Wrapper
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date:06/08/2014
   ========================================================================== */
define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        storage = require('libraries/storageWrap');

    return Backbone.Model.extend({
        initialize: function initialize () {
            storage.setAdaptor(sessionStorage);

            this
                ._setStorage()
                ._bindEvents();
        },

        storageItemName: 'storage',

        // Monitora as mudanças no model e armazena uma nova Sessão no sessionStorage
        _bindEvents: function bindEvents () {
            this.on('change', function (model) {
                this._updateSessionItem();

                if ( _.isEmpty(this.attributes) ) {
                    this._unsetStorage();
                }
            });
            return this;
        },

        // Cria uma sessão
        _updateSessionItem : function create () {
            storage.setItem(this.storageItemName, this.attributes);
            return this;
        },

        _unsetStorage: function unsetStorage () {
            storage.removeItem(this.storageItemName);
            return this;
        },

        // Tenta pegar os itens armazenados no sob o item da sessionStorage e adiciona ao model
        _setStorage: function setStorage () {
            var sStorage = storage.getItem(this.storageItemName);
            if ( sStorage ) { this.set(sStorage); }
            return this;
        }
    });
});