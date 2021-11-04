/* ==========================================================================
   Gera a Versão de um elemento para impressão
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 07/08/2014
   ========================================================================== */
define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        LazyLoader = require('libraries/LazyLoader'),
        Backbone = require('backbone');

    return function printable (options) {
        var defaults = {
                'content': null
            },

            i18nDefaults = {
                'header': 'Versão para impressão',
                'title': null,
                'tooltip': 'Imprimir'
            },

            opts = _.defaults(_.pick(options, 'content'), defaults),

            i18n = _.defaults(options.i18n, i18nDefaults);

        if ( !opts.content ) { throw new Error('Conteúdo para impressão vazio.'); }

        var init = function init() {
                var templateLoader = new LazyLoader('text!templates/common/printable'),
                    libraryLoader = new LazyLoader('libraries');

                $.when(
                    templateLoader.get('printable-template.html'),
                    libraryLoader.get('overlayDialog')
                ).done(function (tpl, ov) {
                    template = _.template(tpl);

                    overlay = ov;

                    populateContainer();

                    initOverlay();

                    bindEvents();
                });
            },

            template = null,

            overlay = null,

            $container = $('<div>', { 'class': 'un-printable', 'id': 'unPrintable' }),

            populateContainer = function populateContainer() {
                if(i18n.class)
                {
                    $container.addClass(i18n.class);
                }

                $container
                    .html(template({ 'header': i18n.header, 'title': i18n.title, 'tooltip': i18n.tooltip }))
                    .find('.un-printable-content')
                    .html(opts.content);
            },


            bindEvents = function bindEvents () {
                var printIcon = $container.find('.un-printable-print');
                printIcon.on('click', function print () {
                    window.print();
                });
            },

            initOverlay = function initOverlay () {
                overlay = overlay({'content': $container});
                overlay.open();
            };

        init();
    };
});