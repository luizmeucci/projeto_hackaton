/* ==========================================================================
   Loading ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 25/03/2014
   ========================================================================== */
define(function (require) {
	'use strict';
	var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        animatedIconsLib = require('libraries/animatedIcons'),

        location = require('system/location'),

        animatedIcons,

	// var viewTemplate = '<img src="img/loader.gif" alt="loading..." class="spinner"> <div class="loading-text fade"></div>';
//        viewTemplate = '<i class="livicon" data-name="spinner-four"></i> <div class="loading-text fade"></div>',
        viewTemplate = '<img src="img/icons/spinner.gif" alt="carregando..." class="loading-view-spinner"> <div class="loading-text fade"></div>',

        timer = {
            interval: 40,
            timeStart: 0,
            timeEnd: 0,
            timePassed: 0,
            start: function start () {
                this.timeStart = new Date();
            },
            stop: function stop () {
                this.timeEnd = new  Date();
                this.timePassed = (this.timeEnd - this.timeStart);
                this.limitReached = (this.timePassed > this.interval);
            },
            limitReached: false
        },

        LoadingView = Marionette.ItemView.extend({
            initialize: function () {
                this.render();

//                animatedIcons = animatedIconsLib({ selector: '#loading-view .livicon', iconOptions: { size: 72, color: '#4270a1', loop: true } });
            },

            el: '#loading-view',

            // Tempo em milisegundos para as operações que envolvem Temporização
            timeOut: 5000,

            template: viewTemplate,

            isHidden: false,

            hideTimeout: null,

            reveal: function reveal (options) {
                options = options || {};

                var self = this,
                    loc = location(),
                    isHidden = $('#loading-view').hasClass('loading-view-hidden'),
                    isHome = _.isUndefined(loc.sistema) || loc.sistema === '' || _.isNull(loc.sistema) || loc.sistema === 'eja',
                    text = options.text,
                    bypass = options.bypass;

                if ( bypass ) { window.UNINTER.ajaxLoadBypass = true; }

                if ( isHidden && !isHome ) {
                    timer.start();

                    if ( text ) {
                        $('#loading-view .loading-text')
                            .empty()
                            .text(text)
                            .removeClass('fade');
                    }

                    this.$el.removeClass('loading-view-hidden');

                    this.isHidden = false;

                    // Adiciona Ícone animado
//                    animatedIcons.add();

                    // Esconde ao atingir o limite de tempo
                    this.hideTimeout = setTimeout(function () {
                        self.hide();
                    }, this.timeOut);
                }
            },

            hideView: function hideView () {
                this.$el
                    .addClass('loading-view-hidden')
                    .find('.loading-text')
                    .addClass('fade')
                    .empty();

                this.isHidden = true;
            },

            removeAnimatedIcons: function removeAnimatedIcons () {
                setTimeout(function () {
                    if ( animatedIcons ) {
                        animatedIcons.remove();
                    }
                }, this.timeOut);
            },

            hide: function hide () {
                timer.stop();
    //            console.warn(timer.timePassed);

                window.UNINTER.ajaxLoadBypass = false;

                if ( !timer.limitReached || window.UNINTER.ajaxLoadBypass ) {
                    return;
                }

    //            console.log('Time reached.');

                this.hideView();

                clearTimeout(this.hideTimeout);

                // Remove LivIcon
                // this.removeAnimatedIcons();
            },

            render: function render () {
                this.$el.append(this.template);
            }
        });

	return new LoadingView();
});