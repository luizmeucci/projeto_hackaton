/* ==========================================================================
 Location
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 18/08/2014
 @description: Método para centralizar as funções relacionadas aos parâmetros da URL.
 ========================================================================== */
define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore');

    return function location () {
        var handler = {
            rotina: null,
            metodo: null,
            idUrl: null,
            sistema: null,
            idAcao: null,
            parse: function parse () {
                var href = document.location.href,
                    hasHash = href.indexOf('#')  !== -1,
                    str = [];

                if ( hasHash ) {
                    str = href.split('#/')[1].split('/');
                }

                this.sistema = (str[0]) ? str[0].toLowerCase() : null;
                this.rotina = (str[1]) ? str[1].toLowerCase() : null;
                this.idUrl = str[2];
                this.metodo = (str[3]) ? str[3].toLowerCase() : null;
                this.idAcao = str[4];
            }
        },

        methods;

        handler.parse();

        methods = _.omit(handler, 'parse');

        methods.isPap = function isPap () {
            return handler.sistema === 'pap';
        };

        methods.isAva = function isAva () {
            return handler.sistema === 'ava';
        };

        methods.isEja = function isEja () {
            return handler.sistema === 'eja';
        };

        return methods;
    };
});