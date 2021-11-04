/**
 * Bootstrap Popover
 * @author: Thyago Weber (thyago.weber@gmail.com)
 * @date: 16/07/14
 * @description: Mostra um log no console somente se a aplicação estiver em modo debug.
 *               As mensagens são agrupadas e vem acompanhadas do trace.
 *
 * API Pública:
 * - log: mensagens do tipo 'log'
 * - info: mensagens do tipo 'info'
 * - warn: mensagens do tipo 'warn'
 * - error: mensagens do tipo 'error'
 * - dir: log de objeto com propriedades navegáveis
 *
 * Utilização:
 * UNINTER.logger.info('sup, dawg');
 *
 */
define(function (require) {
    "use strict";

    var Helpers = require('libraries/Helpers'),
        $ = require('jquery'),
        _ = require('underscore');

    return function () {
        var logObject = {},

            logTypes = ['info', 'warn', 'error', 'dir', 'log'],

            styles = function styles(type) {
                var css = _.template('color: <%= color %>');

                switch (type) {
                    case 'info':
                        css = css({color: '#5bc0de'});
                        break;
                    case 'warn':
                        css = css({color: '#f0ad4e'});
                        break;
                    case 'error':
                        css = css({color: '#d9534f'});
                        break;
                    default:
                        css = css({color: '#000'});
                }

                return css;
            },

            checkBrowserSupportsConsoleAdvancedMethods = function checkBrowserSupportsConsoleAdvancedMethods () {
                var supports = ((console.groupCollapsed) && (console.trace)) || false;
                return supports;
            },

            browserSupports = null,

            getFileInfo = function getFileInfo() {
                var error = new Error(), str, spl = '';
                if ( error.stack ) {
                    //str = error.stack.split('\n')[4],
                    //spl = str.split(' (')[1].split(')')[0];
                }
//                return spl;
                return '';
            },

            // Métodos compartilhados entre os objetos
            logProto = {
                log: function log (message, type) {
                    // Se a app não está em modo DEBUG, não ir adiante.
                    if ( !window.UNINTER.debugMode ) { return; }

                    var typeTitle = Helpers.toTitleCase(type),
                        fileInfo = getFileInfo(),
                        style = styles(type),
                        str;

                    if ( arguments[2] ) {
                        var newMessage = message.replace('%s', '');
                        str = '%c' + typeTitle + ': ' + newMessage + arguments[2] + '; Arquivo: ' + fileInfo;

                    } else {
                        str = '%c' + typeTitle + ': ' + message + '; Arquivo: ' + fileInfo;
                    }

                    // @TODO: verificar pq o IE não suporta console.call
                    if ( console[type].call ) {
                    console[type].call(console, str, style);
                    }

                }
            },

            // Cria os métodos dinamicamente, de acordo com a informação encontrada no array logTypes
            createMethods = function createMethods(logTypes) {
                _.each(logTypes, function iterator (logType) {
                    logObject[logType] = function(message) {
                        if ( arguments[1] ) {
                            logProto.log( message, logType, arguments[1] );
                            return;
                        }
                        logProto.log( message, logType );
                    };
                });
            },

            // Inicializa a construção dos métodos
            init = function initializer () {
                createMethods(logTypes);
                browserSupports = checkBrowserSupportsConsoleAdvancedMethods();
            };

        init();

        return logObject;
    };
});