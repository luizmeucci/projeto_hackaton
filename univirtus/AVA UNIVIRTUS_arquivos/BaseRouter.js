/* ==========================================================================
 Main Router
 @author: Thyago Weber (thyago.weber@gmail.com)
 @date: 04/02/2014
 ========================================================================== */
define(function(require) {
    'use strict';
    var _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        App = require('app'),
        Storage = require('libraries/storageWrap'),
        HeaderItemView = require('views/common/HeaderItemView'),
        FooterItemView = require('views/common/FooterItemView'),
        headerItemView,
        footerItemView;

    require('backbone.routefilter');
    require('backbone.router.title.helper');

    // Roteador Base da Aplicação
    return Backbone.Marionette.AppRouter.extend({
        initialize: function initialize () {
            headerItemView = headerItemView || new HeaderItemView();
            footerItemView = footerItemView || new FooterItemView();
        },
        before: function before(path, args) {

            var route = this.appRoutes[path], isEja = ( args[0] && args[0].toLowerCase() ) === 'eja' ;

            //Guarda a ultima url executada:
            if (args != void (0) && args.length > 0) {
                sessionStorage.setItem('avalogin', _.filter(args, function (a) { return a != void (0) }).join('/'));
                //UNINTER.StorageWrap.setItem('avalogin', _.filter(args, function (a) { return a != void (0) }).join('/'))
            }

            // Não validar credenciais para as rotas abaixo
            if ( _.contains( App.config.publicRoutes, route ) || isEja ) { return; }

            // Checa credentiais
            App.session.checkCreds();

            // Verifica as permissões do usuário
            App.auth.checkCredentials();

            // Click no botão de menu responsivo
            App.responsiveMenuHandler();

            // Faz o scroll para o topo da página
            App.Helpers.animatedScrollTop();

            // Define a localidade atual: PAP ou AVA
            App.headerItemView.on('show', function () {
                App.setCurrentLocation();
            });

            // Mostra Header e footer, controlando se precisam ser novamente renderizados.
            App.showMainRegions({ 'headerItemView': headerItemView, 'footerItemView': footerItemView });

            // Define o label para o link da headerItemView: se 'sair' ou 'voltar'
            headerItemView.setlogoutLinkLabel();

            // Avisa à aplicação sobre a mudança de rota
            App.vent.trigger('route:before:leftsidebar');
            App.vent.trigger('route:before');
        },

        after: function after (path, args) {
            // Avisa à aplicação sobre a mudança de rota: after
            App.vent.trigger('route:after');
        },

        // Método para detectar a rota atual
        _current: function () {
            var Router = this,
                fragment = Backbone.history.fragment,
                routes = _.pairs(Router.appRoutes),
                route = null, params = null, matched;

            matched = _.find(routes, function (handler) {
                route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
                return route.test(fragment);
            });

            if (matched) {
                params = Router._extractParameters(route, fragment);
                route = matched[1];
            }

            return {
                route: route,
                fragment: fragment,
                params: params
            };
        }
    });
});