/* ==========================================================================
   Redirecter
   @author Thyago Weber (thyago.weber@gmail.com)
   @date 30-02-2014
   @description: Redireciona para uma dada URL interna.
                 Sem parâmetros, a página inicial da aplicação é carregada.
                 Se informada, mostra uma mensagem com ou sem delay ao
                 redirecionar.
   @param options.url string A URL de redirecionamento. Default: '#/'
   @param options.delay int O tempo em ms que o sistema deve esperar até
                            redirecionar. Default: null
   @param options.messageType string Tipo de mensagem: info, warn, danger,
                                     success. Default: danger.
   ========================================================================== */

define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        flashMessage = require('libraries/flashMessage');

    return function (options) {

        options = options || {};
        var location = options.url || '#/',
            delay = options.delay || null,
            messageType = options.messageType || 'danger',
            loginCustomizado = false,
            redirect = function (location) {
                var isAppUrl = location.indexOf('#/');

                if (isAppUrl == -1) {
                    //window.location = location;

                    if (loginCustomizado == false) {
                        window.open(
                          location,
                          '_blank'
                        );
                    } else {
                        window.location = location;
                    }
                    return;
                }

                Backbone.history.navigate(location);
            };

        //Se está redirecionando para o login, verifica se é uma pagina customizada:
        if (location == '#/')
        {
            var urlSair = sessionStorage.getItem('LOCATIONSAIR');
            if (urlSair != void (0) && urlSair.length > 0)
            {
                loginCustomizado = true;
                location = urlSair;
            }
        }

        if ( options.message ) {
            flashMessage({ body: options.message, type: messageType });
        }
        // Redireciona para a url informada ou a home page (login)
        if ( delay ) {
            setTimeout(function () {
                redirect(location);
                if ( options.message ) {
                    $('#flashMessage').fadeOut('slow');
                }
            }, delay);
        }
        else { redirect(location); }
    };
});