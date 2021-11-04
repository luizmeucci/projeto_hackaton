/* ==========================================================================
 Main Router
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 04/02/2014
 ========================================================================== */
define(function(require) {
    'use strict';

    var BaseRouter = require('routers/BaseRouter'),
        appConfig = require('config/AppConfig');

    // Roteador da Aplicação
    return BaseRouter.extend({
        //"index" deve ser um método em LoginController
        appRoutes: {
            // Área pública
            'login/(:hash)': 'loginPersonalizado',
            'esquecisenha': 'login',
            'esquecisenhasms': 'login',
            ":sistema(/)(:rotina)(/)(:id)(/)(:metodo)(/)(:idAcao)(/)(:idAux)": "index",    // Os parametros estão entre parenteses para torná-los opcionais.
            'eja':'login',
            "central-de-ajuda": "centralDeAjuda",
            "perguntas-frequentes": "perguntasFrequentes",
            'atividades': 'atividades',
            '': 'login',
            '*actions': 'notFound' // Default
        },

        titles: appConfig.documentTitles.forms.titles,

        titleSeparator: appConfig.documentTitles.forms.separator,

        titlePrefix: appConfig.documentTitles.forms.prefix,

        titleSuffix: appConfig.documentTitles.forms.suffix
    });
});