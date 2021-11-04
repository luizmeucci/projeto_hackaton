/* ==========================================================================
   Bootstrap and App Initializer
   ========================================================================== */
require([
	'app', 
	'mainRouter',
	'avaRouter',
	'papRouter',
	'controllers/Controller',
	'controllers/AvaController',
	'controllers/PapController'
], function (App, MainRouter, AvaRouter, PapRouter, Controller, AvaController, PapController) {
    'use strict';

    // Carrega o Marionette Application no modo Desktop (default)
    // @TODO: implementar modo Mobile

    // Carregar Router da área pública (Login)
    App.mainRouter = new MainRouter({
        controller: new Controller()
    });

    // Carregar Router do Pap
    App.papRouter = new PapRouter({
        controller: new PapController()
    });

    // Carregar Router do Pap
    App.avaRouter = new AvaRouter({
        controller: new AvaController()
    });

    App.start();

});