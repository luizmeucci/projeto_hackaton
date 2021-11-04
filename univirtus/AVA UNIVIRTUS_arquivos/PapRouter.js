/* ==========================================================================
   Pap Router
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 04/02/2014
   ========================================================================== */
define(function(require) {
    'use strict';

    var BaseRouter = require('routers/BaseRouter'),
        appConfig = require('config/AppConfig');

	// Roteador da Aplicação
	return BaseRouter.extend({
        appRoutes: {
            'pap(/)': 'indexPap',
            'pap/solicitacoes(/)' : 'solicitacoes',
            'pap/solicitacoes/:id' : 'solicitacoes',
            'pap/comunicados' : 'comunicados',
            'pap/relatorios/:type(/)': 'relatorios',
            'pap/email?*queryString': 'email'
        },

        titles: appConfig.documentTitles.pap.titles,

        titleSeparator: appConfig.documentTitles.pap.separator,

        titlePrefix: appConfig.documentTitles.pap.prefix,

        titleSuffix: appConfig.documentTitles.pap.suffix
	});
		
});