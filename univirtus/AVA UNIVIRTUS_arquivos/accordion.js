/* ==========================================================================
 Função para accordion
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 24/06/2014

 @param option.element string ou jQuery Object: Id ou objeto o qual terá a funcionalidade de accordion.
 @param option.closeInactive boolean: Define se os outros itens do accordion deverão ser recolhidos ao clicar em um novo item.
 @param option.onToggle function: Callback que roda a cada mudança de visibilidade do item.
 Exemplo de utilização: accordion({'id': '#acco', 'closeInactive': false}).init();
 ========================================================================== */
define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore');

    return function accordion(options) {
        options = options || {};
        var defaults = {
                'element': '#accordion', // Id do elemento já existente na tela ou objeto jQuery;
                'closeInactive': true,   // Fechar os outros itens ao abrir o atual
                'onToggle': null         // Callback que roda a cada mudança de visibilidade do item
            },

            opts = _.defaults(options, defaults),

        // Certifica-se de que o id informado contém '#'
            makeId = function (id) {
                if (id.indexOf('#') === -1) { elementId = '#' + id; }
                return id;
            },

        // Checagem do elemento:verifica se é um seletor de um item
        // já renderizado ou um objeto jQuery que ainda está na memória.
            checkElement = function (element) {
                if (!(element instanceof $)) {
                    element = makeId(element);
                }
                return element;
            },

            elementId = checkElement(opts.element),

            $el = $(elementId),

        // Evento de click do item do accordion
            registerMainClickEvent = function () {
                $('html')
                    .off('click.unAccordion')
                    .on('click.unAccordion', '.un-accordion-header', function (event) {
                        // Callback ao abrir
                        if ( opts.onToggle && typeof opts.onToggle === 'function') {
                            opts.onToggle(event);
                        }

                        // Fecha todos os itens abertos.
                        if (opts.closeInactive) {
                            $(this).closest('.un-accordion-item').siblings().removeClass('active');
                        }
                        // Abre/Fecha o item clicado
                        $(this).closest('.un-accordion-item').toggleClass('active');
                    });
            },

        // Impede a propagação do evento de click para os elementos sinalizados com data-bubble='false'
            preventBubbleUp = function () {
                $el.find('[data-bubble=false]').on('click', function (e) {
                    e.stopImmediatePropagation();
                });
            },

            closeAll = function () {
                $el.find('.un-accordion-item').removeClass('active');
            };

        return {
            'init': function accordionInitializer () {
                registerMainClickEvent();
                preventBubbleUp();
            },
            'closeAll': closeAll
        };
    };
});