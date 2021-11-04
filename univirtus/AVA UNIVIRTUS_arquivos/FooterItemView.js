/* ==========================================================================
   FOOTER View
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 04/02/2014
   ========================================================================== */

define(function(require) {
    'use strict';
    var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),
        Marionette = require('marionette'),
        footerTemplate = require('text!templates/partials/footer-template.html'),
        videoPlayer = require('libraries/videoplayer');
	return Marionette.ItemView.extend({
		template : _.template(footerTemplate),

        events: {
            'click #conhecaNovoAvaFooter': 'openOverlay'
        },

        serializeData: function serializeData () {
            return {
                'centralAjuda': 'Central de Ajuda',
                'conhecaNovoAva': 'Conheça o novo AVA'
            };
        },

        openOverlay: function openOverlay () {
            //var iframe = $('<iframe>', {'id': 'frameConhecaNovoAva',
            //    'src': 'documentos/AVA-Univirtus-Guia-de-Referencia-Rapida-help/index.html',
            //    'class': 'un-iframe-content'
            //});

            App.Helpers.showModal({
                'size': 'modal-lg',
                'body': '<div id="containerConhecaNovoAvaFooter">',
                'onClose': function () {
                    debugger;
                    //O video fica tocando no fundo se apenas fechar a modal, então, destrui o elemento de video.
                    $("#ConhecaAvaFooter").remove();
                },
                'callback': function renderModalBody(dialog) {

                    var videoplayer = new videoPlayer();
                    //videoplayer.sourceMP4 = 'http://vod.grupouninter.com.br/2015/FEV/28244.mp4';
                    videoplayer.sourceMP4 = 'http://vod.grupouninter.com.br/2015/MAR/28619.mp4';
                    videoplayer.domId = "#containerConhecaNovoAvaFooter";
                    videoplayer.width = "800px";
                    videoplayer.height = "600px";
                    videoplayer.videoId = "ConhecaAvaFooter";
                    videoplayer.render();
                    $("#containerConhecaNovoAvaFooter div:first").css("margin", "0 auto");
                    dialog.find('.modal-body').css({ 'height': '670px' });
                    dialog.find('.modal-footer').hide();

                }
            });
        }
	});

});
