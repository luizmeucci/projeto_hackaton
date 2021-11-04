/* ==========================================================================
   Escolas Entity
   @author: Ellen
   @date: 05/05/2016
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
            }
        },
        model: Backbone.Model.extend({}),
        parse: function (resp) {            
            return resp.usuarioHistoricoCursoOfertas;
        }
    });

});