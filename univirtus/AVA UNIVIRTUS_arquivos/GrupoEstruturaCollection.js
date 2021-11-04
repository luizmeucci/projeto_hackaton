/* ==========================================================================
   Idioma Collection
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 03/03/2014
   ========================================================================== */
define(function (require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var ModelGrupoEstrutura = Backbone.Model.extend({});

    return Backbone.Collection.extend({
        parse: function (response) {
            if (response !== null && response !== null) {
                return response;
            } else {
                return null;
            }
        },
        model: ModelGrupoEstrutura
    });
});