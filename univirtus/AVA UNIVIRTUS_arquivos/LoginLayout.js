/* ==========================================================================
   LOGIN Layout
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 04/02/2014
   ========================================================================== */

define([
	'jquery',
	'underscore',
	'backbone',
	'marionette',
	'text!templates/login/login-template.html'
], function($, _, Backbone, Marionette, template) {
    'use strict';

	var LoginLayout = Marionette.Layout.extend({
		initialize: function() {
			var self = this;
			this.loginBox.on('show', function (v) {
				this.listenTo(v, 'login', function(data) {
					self.trigger("itemview:login", data);
				});
			});
		},
		id: "loginPage",
		template: _.template(template),
		regions: {
			advArea  : "#adv-area",
			loginBox : "#login-box"
		}
	});

	return LoginLayout;
});
