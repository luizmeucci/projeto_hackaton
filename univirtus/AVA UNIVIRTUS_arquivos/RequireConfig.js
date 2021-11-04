/* ==========================================================================
   Require Config
   ========================================================================== */
'use strict';
var require = {
	urlArgs: function () {
		var host = document.location.host;
		var args = 'v=';

		var v = 'v351';
		
		if ( host.indexOf('127.0.0.1') !== -1 || host.indexOf('localhost') !== -1 ) {
			args += (new Date()).getTime();
		}
		else  {
			args += v;
		}

		return args;
	}, 


	baseUrl:'/ava/web/js',

	waitSeconds: 600,

	paths: {
		// Core Libs
	    //'jquery': 'vendor/jquery-1.11',
	    //'jquery': 'vendor/jquery-3.3.1.min',
		'jquery': 'vendor/jquery-3.5.1.min',
		'underscore' : 'vendor/lodash.underscore',
		'backbone.routefilter' : 'vendor/backbone.routefilter',
		'backbone' : 'vendor/backbone-amd',
		'backbone.babysitter' : 'vendor/backbone.babysitter',
		'backbone.wreqr' : 'vendor/backbone.wreqr',
		'marionette' : 'vendor/backbone.marionette',
		'json2' : 'vendor/json2',
		'templates' : '../templates',
		'mainRouter' : 'routers/MainRouter',
		'avaRouter' : 'routers/AvaRouter',
		'papRouter' : 'routers/PapRouter',
		'app' : 'app',

		// Plugins
		'jquery-validation' : 'vendor/jquery.validate',
		'nivoslider' : 'vendor/jquery.nivo.slider.pack',
		'bootstrap' : 'vendor/bootstrap/amd/main',
		'backbone-upload-manager' : 'vendor/backbone-upload-manager/backbone.upload-manager',
		'backbone-defered-view-loader' : 'vendor/backbone-upload-manager/backbone.defered-view-loader',
		'jquery-fileupload' : 'vendor/backbone-upload-manager/jquery.fileupload',
		'jquery-iframe-transport' : 'vendor/backbone-upload-manager/jquery.iframe-transport',
		'jquery.ui.widget' : 'vendor/backbone-upload-manager/jquery-ui-widget',
		// 'jquery-xdomainrequest' : 'vendor/jquery.xdomainrequest.min',
		'jquery-select2': 'vendor/select2',
        'backbone.router.title.helper': 'vendor/backbone.router.title.helper',
        'dTree': 'libraries/dtree',
        

		// Raphael
		'eve' : 'vendor/raphael/eve',
		'raphael.core' : 'vendor/raphael/raphael.core',
		'raphael.svg' : 'vendor/raphael/raphael.svg',
		'raphael.vml' : 'vendor/raphael/raphael.vml',
		'raphael' : 'vendor/raphael/raphael.amd',
		'livicons' : 'vendor/livicons-1.3',

		'jquery-mask' : 'vendor/jquery.mask',

		// Bootstrap datetimepicker
		'bootstrap-datetimepicker': 'vendor/bootstrap-datepicker/bootstrap-datetimepicker',
		'moment': 'vendor/fullcalendar-3.10.2/lib/moment',
		'fullcalendar':  'vendor/fullcalendar-3.10.2/fullcalendar',
		'moment-locale': 'vendor/fullcalendar-3.10.2/locale/pt-br',

		// Player de video
		'videojs': 'vendor/video-js/video',
		'mathjax': 'vendor/MathJax/MathJax.js?config=TeX-AMS_CHTML'

	}, 

	shim: {
        'json2': {
            exports: 'JSON'
        },
		'marionette' : {
			deps : ['underscore', 'backbone', 'jquery', 'json2', 'backbone.babysitter', 'backbone.wreqr'],
	        exports : 'Marionette'
		},
		'backbone.babysitter' : {
			deps : ['underscore', 'backbone', 'jquery'],
	        exports : 'BabySitter'
		},
		'backbone.wreqr' : {
			deps : ['underscore', 'backbone', 'jquery'],
	        exports : 'Wreqr'
		},
		'nivoslider' : {
			deps: [ 'jquery' ],
			exports: 'jQuery.fn.nivoslider'
		},
		'backbone-upload-manager' : {
			deps: ['backbone', 'backbone-defered-view-loader'], 
			exports: 'Backbone.UploadManager'
		},
		'backbone-defered-view-loader' : {
			deps: ['backbone'],
			exports: 'Backbone.TemplateManager'
		},
		'jquery-validation' : {
			deps : ['jquery'],
	        exports : 'jQuery.fn.validation'
		},
		// 'jquery-xdomainrequest' : {
		// 	deps : ['jquery'],
		// 	exports : 'jQuery.fn.xdomainrequest'
		// },
		'rafael': {
			exports: 'Raphael'
		},
		'jquery-select2' : {
			deps : ['jquery']
		},
		'dTree' : {
		    deps : ['jquery']
		},
		'jquery-mask': {
			deps: ['jquery']
		},
		'bootstrap-datepicker': {
			deps: ['jquery', 'bootstrap', 'moment']
		},
		'videojs': {
			deps: ['jquery']
		}
	}
};