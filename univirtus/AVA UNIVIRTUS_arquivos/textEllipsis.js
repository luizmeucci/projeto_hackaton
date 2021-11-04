/* ==========================================================================
 TextEllipsis
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 28/07/2014

 @description: Limita o texto existente em um elemento com 'text-overflow: ellipsis', de modo a caber em uma única linha.
               Devido as limitações com textos dentro de de células de tabelas, o script precisa definir um tamanho
               máximo para o elemento TD a fim de forçar o corte do texto. O tamanho deve ser fornecido no momento
               da chamada da função.

 @param options.selector object Seletor. Pode ser uma string ou Objeto jQuery.
 @param options.tdMaxWidth int O max-width que será atribuído ao elemento caso ele esteja dentro de uma tabela.

 Exemplo:
 // O texto a ser cortado está dentro de uma TD:
 textEllipsis({ 'selector':'.table td', 'tdMaxWidth': 200 });

 // O texto a ser cortado está dentro de uma DIV:
 textEllipsis({ 'selector':'.foo div' });
 ========================================================================== */
define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore');

    return function textEllipsis(options) {
        options = options || {};
        var defaults = {
                'selector': '',
                'tdMaxWidth': null
            },

            opts = _.defaults(options, defaults),

            makeEl = function makeEl(selector) {
                var $el = selector;

                if ( !(selector instanceof $) ) { $el = $($el); }

                if ( !$el.length ) { throw new Error('O elemento não foi encontrado. Verifique o seletor.'); }

                return $el;
            },

            set = function set(text) {
                var holder = $('<span>', {'class': 'text-ellipsis'}),

                    textHolder = $('<span>', {'class': 'text-ellipsis-text'});

                textHolder.html(text);

                holder.html(textHolder);

                return holder;
            },

            checkEl = function checkEl($el) {
                var isInsideTable = !!($el.parents('td').length || $el.is('td'));
                return isInsideTable;
            },

            setStyleIfTable = function($el) {
                var isInsideTable = checkEl($el),
                    isTd = $el.is('td');

                if ( isTd && options.tdMaxWidth ) {
                    $el.css('max-width', options.tdMaxWidth + 'px');
                }
                else if ( isInsideTable && options.tdMaxWidth ) {
                    $el.parents('td').css('max-width', options.tdMaxWidth + 'px');
                }

                return $el;
            },

            init = function init(options) {

                var $el;

                if ( !options.selector ) { throw new Error('Parâmetro "selector" nulo ou indefinido.'); }

                $el = makeEl(options.selector);

                $el.html( set( $el.text() ) );

                setStyleIfTable($el);
            };

        init(opts);
    };
});