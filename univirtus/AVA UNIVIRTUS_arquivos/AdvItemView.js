/* ==========================================================================
   ADV (slider) CollectionView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 04/02/2014
   ========================================================================== */

define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!templates/login/slider.html',
    'collections/AdvLoginCollection',
    'nivoslider'
], function ($, _, Backbone, Marionette, template, AdvCollection) {
    'use strict';

    return Marionette.ItemView.extend({
        data: void (0),
        collection: void(0),
        initialize: function initialize(data) {

            this.collection = new AdvCollection();

            if (data != void (0) && data.title != void(0)) {

                this.data = data;

                this.collection.reset();
                this.collection.addOne({ title: this.data.title, description: this.data.description, img: this.data.img, href: this.data.href });
            }
        },
        template: _.template(template),
        slider: function slider () {
            //  NivoSlider
            var appendDescription = function () {
                var text, str;
                text = $('#slider').find('.nivo-caption').html();
                str = '<div class=\'ad-description\' >' + text + '</div>';

                $('#slider-description').html(str).fadeIn('slow');
            };

            // Configuração do slider
            $('#slider').nivoSlider({
                effect: 'sliceDown',            // Specify sets like: 'fold,fade,sliceDown'
                slices: 8,                      // For slice animations
                boxCols: 8,                     // For box animations
                boxRows: 4,                     // For box animations
                animSpeed: 1000,                // Slide transition speed
                pauseTime: 5000,                // How long each slide will show
                startSlide: 0,                  // Set starting Slide (0 index)
                directionNav: false,            // Next & Prev navigation
                controlNav: false,              // 1,2,3... navigation
                controlNavThumbs: false,        // Use thumbnails for Control Nav
                pauseOnHover: true,             // Stop animation while hovering
                manualAdvance: false,           // Force manual transitions
                prevText: 'Prev',               // Prev directionNav text
                nextText: 'Next',               // Next directionNav text
                randomStart: true,              // Start on a random slide
                // Triggers before a slide transition
                afterChange: function () {
                    appendDescription();
                },
                // Triggers after a slide transition
                slideshowEnd: function () { },     // Triggers after all slides have been shown
                lastSlide: function () { },        // Triggers when last slide is shown
                afterLoad: function () {
                    appendDescription();
                }
            });
        },
        onShow: function onShow() {
            this.slider();
        }
    });
});
