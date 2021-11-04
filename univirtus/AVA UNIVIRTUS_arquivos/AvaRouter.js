/* ==========================================================================
 AVA Router
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
            "ava/form-upload": "form-upload",
            "ava/roteiro-de-estudo/:id/:idSalaVirtualOferta/:idTema/:idAtividade/:clean": "roteiro-de-estudo",
            "ava/roteiro-de-estudo/:id/:idSalaVirtualOferta/:idTema/:idAtividade": "roteiro-de-estudo",
            "ava/roteiro-de-estudo/:id/:idSalaVirtualOferta/:idTema": "roteiro-de-estudo",
            "ava/roteiro-de-estudo/:id/:idSalaVirtualOferta": "roteiro-de-estudo",
            "ava/roteiro-de-estudo/:id(/)": "roteiro-de-estudo",
            "ava/roteiro-de-estudo(/)": "roteiro-de-estudo",
            "ava/atividadesteste/:id(/)": "atividadesteste",
            "ava/atividadesteste(/)": "atividadesteste",
            "ava/atividadesteste2(/)": "atividadesteste2",
            "ava/atividadesteste2/:id(/)": "atividadesteste2",
            //"ava/historico": "historico",
            "ava/calendario": "calendario",
            "ava/administracao": "administracao",
            "ava/mensagens": "mensagens",
            //"ava/desempenho": "desempenho",
            "ava/informacoes/:id(/)": "informacoes",
            "ava/informacoes(/)": "informacoes",
            'ava/email?*queryString': 'email',
            "ava(/)": "index",
            "ava/relatorio-trabalho/:idSalaVirtual/:idSalaVirtualOferta/:idInteracaoControle/:idInteracaoEtapa": "relatorio-trabalho",
            'ava/acessoroa/:id/:idUsuario/:token': 'acessoroa',
            'ava/acessoroa/:id/:idUsuario/:token/:metodo': 'acessoroa',
            'ava/acessoroa/:id/:idUsuario/:token/:metodo/:redirecionar': 'acessoroa',
            'ava/acessoroa/:id/:idUsuario/:token/:metodo/:redirecionar/:idSalaVirtualOferta': 'acessoroa',
            'ava/importacao-planilha/:idSalaVirtual/:idSalaVirtualOferta': 'importacao-planilha'
            //'ava/roa/:id/:voltar/:fullscreen': 'roa'
            
        },

        titles: appConfig.documentTitles.ava.titles,

        titleSeparator: appConfig.documentTitles.ava.separator,

        titlePrefix: appConfig.documentTitles.ava.prefix,

        titleSuffix: appConfig.documentTitles.ava.suffix
    });
});