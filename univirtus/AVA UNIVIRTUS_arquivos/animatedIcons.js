/* ==========================================================================
 Boilerplate ItemView
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 10/07/2014
 ========================================================================== */
define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore');

    require('livicons');

    return function (options) {
        var defaults = {
                selector: null,
                iconOptions: {
                    size: 32,
                    color: '#4270a1',
                    loop: null
                }
            },
            opts = _.defaults(options, defaults),
            selector;

        if ( !opts.selector ) { throw new Error('Parâmetro options.selector nulo ou indefinido.'); }

        // Adiciona um ícone animado
        function animatedIconsLoaderAdd () {
            try {
                // O seletor do elemento
                selector = $(opts.selector);
                selector.addLivicon(opts.iconOptions);
            } catch (e) {
                //console.error('Erro ao criar ícone animado: %o', e);
                //console.trace();

                    //@TODO: nem sempre os icones são carregados e as vezes ocorrem erros. POr isso, chamamos outra vez no document ready
                    try {
                        $(document).ready(function () {
                            selector = $(opts.selector);
                            selector.addLivicon(opts.iconOptions);
                        });
                    } catch (e) {
                        console.error('Erro ao criar ícone animado: %o', e);
                        console.trace();
                    }
            }
        }

        // Remove um ícone animado
        function animatedIconsLoaderRemove () {
            if ( !selector ) { throw new Error('Não inicializado.'); }
            try {
                selector.removeLivicon(opts.iconOptions);
            } catch (e) {
                console.error('Erro ao remover ícone animado: %o', e);
                console.trace();
            }
        }

        return {
            add: animatedIconsLoaderAdd,
            remove: animatedIconsLoaderRemove,
            update: function animatedIconsLoaderUpdate () {
                throw 'Não implementado';
            }
        }
    };
});