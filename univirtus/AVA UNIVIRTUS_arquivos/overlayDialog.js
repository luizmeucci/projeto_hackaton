/* ==========================================================================
   Overlay Dialog
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 27/05/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery'),
        _ = require('underscore'),
        LazyLoader = require('libraries/LazyLoader'),
        Backbone = require('backbone');

	return function ( options ) {
        var defaults = {
                'delay': 600,
                'content': null,
                'i18n': {
                    'backText': 'Voltar'
                }
            },

            opts = _.defaults(options, defaults),

            i18n = _.defaults(options.i18n, defaults.i18n),

            overlay = $('#dialogOverlay'),

            overlayIsOpen = false,

            open = function open () {
                overlay.removeClass('hide');
                setTimeout(function () {
                    overlay.addClass('in');
                }, opts.delay);

                overlayIsOpen = true;
                $('html').addClass('overlay-open');
            },

            close = function close () {
                overlay.removeClass('in');
                setTimeout(function () {
                    overlay.addClass('hide');
                    overlay.find('.overlay-dialog-body').empty();
                }, opts.delay);
                $('html').removeClass('overlay-open');
            },

            templateLoader = new LazyLoader('text!templates/common/overlaydialog'),

            bindEvents = function bindEvents() {
                overlay.on('click', '.overlay-dialog-back-button a.lnk-arrow-left', close);

                Backbone.history.unbind('all');
                if ( overlayIsOpen ) {
                    Backbone.history.bind('all', function closeOverlay() {
                        close();
                        overlayIsOpen = false;

                        Backbone.history.unbind('all');
                    });
                }
            },

            init = function init () {
                var self = this;

                if ( !opts.content ) { throw new Error('O conteúdo para o overlay não foi informado'); }

                $.when(templateLoader.get('overlay-dialog-template.html')).done(function (template) {
                    var tpl = _.template(template);

                    $('#dialogOverlay').html(tpl({ 'backText': i18n.backText }));

                    try {
                        overlay.find('.overlay-dialog-body').empty().html(opts.content);
                    } catch (e) { }

                    bindEvents();
                });
            };

        init();

		return {
			open: open,
			close: close
		};

	};
});