/* ==========================================================================
   Bootstrap Popover
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 03/03/2014

   @description: Utilidade para gerenciar as popovers do Bootstrap.
                 Adiciona funcionalidade para fechar a popover ao clicar
                 no corpo da página.
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery');
	var _ = require('underscore');
	require('bootstrap');

	return function (options) {
		var defaults = {
			html: true,
			placement: 'bottom',
			content: null,
			container: 'body',
			trigger: 'click', 
			target: null
		},
		opts = _.defaults(options, defaults),
        el;

		if ( !opts.target ) { throw new Error('Parâmetro TARGET indefinido ou nulo'); }

		el = $(opts.target);

		// Inicia o Popover		
		function init () { 
			el.popover(opts); 
			setTimeout(function () {
				$('.popover').on('click', function (e) {
					e.stopImmediatePropagation();
				});
			}, 200);

			//// Remove o namespace do listener para evitar enfileiramento de eventos
			$('html').off('click.popover');

            //// Some com o Popover ao clicar fora dela
            $('html').on('click.popover', function(e) {
                if (typeof $(el.target).data('original-title') === 'undefined' && !$(e.target).parents().is('.popover.in')) {
                    //Verificamos se o usuario não quer que feche o popover:
                    if ($(el).data('preventhide') == 'true' || $(el).data('preventhide') == true) {
                        return;
                    } else {
                        el.removeClass('active');
                        hide();
                    }
                }
            });
		} 

		function hide () {
            $('[data-original-title]').popover('hide');
        }

		function show() { el.popover('show'); }

		function destroy() {el.popover("destroy") }

		init();

		return {
			'show': show,
			'hide': hide,
            'destroy': destroy
		};
	};
});