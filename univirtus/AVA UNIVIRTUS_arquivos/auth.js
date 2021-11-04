/* ==========================================================================
   Auth -  Métodos relativos a permissões
   @author Thyago Weber (thyago.weber@gmail.com)
   @date 30-02-2014
   ========================================================================== */

define([
'jquery',
'underscore',
'config/AppConfig',
'libraries/flashMessage',
'libraries/Helpers',
'libraries/StorageWrap',
'libraries/redirecter'
], function ($, _, Config, flashMessage, Helpers, StorageWrap, Redirecter) {
    'use strict';

    return {
        handleHeaders: function (status) {
            var msg = "";
            switch (status) {
                case 401 :
                    msg = "Você precisa estar logado para efetuar esta ação";
                    break;
                case 404 :
                    msg = "Recurso ou Página não encontrada";
                    break;
                case 405 :
                    msg = "Você não possui as permissões necessárias para efetuar esta ação";
                    break;
                case 500 :
                    msg = "Ocorreu um erro interno no Servidor";
                    break;
                case 502 :
                    msg = "O Servidor demorou muito para responder";
            };

            // Envia a mensagem
            flashMessage({
                body: msg,
                type: "danger"
            });
        },

        permissaoAppUninter: function () {
            var user = StorageWrap.getItem('user');
            var msg = "Você não possui as permissões necessárias para efetuar esta ação";

            //Se o mac não é valido e esta usando aplicativo, testamos se o usuario pode cadastrar PC, se não, mensagem de PC não cadastrado.
            if (user.macAddressValido == false && user.appDesktop == true) {
                msg = "Computador não cadastrado.";
                var redirecionarCadastroComputador = this.permissaoCadastrarComputadorApp();
                if (redirecionarCadastroComputador == true) {
                    Redirecter({ url: '#/pap/computador/0/novo', message: msg });
                } else {
                    Redirecter({ url: "#/", delay: 0, message: msg });
                }
            }
            return msg;
        },

        permissaoCadastrarComputadorApp: function () {
            var siteSection = Backbone.history.fragment.split("/")[1];
            if (siteSection == "computador" || siteSection == void(0)) {
                return false;
            } else {
                return true;
            }
        },

        // Verifica se o usuário está autenticado.
        // Se sim, seta o token em cada requisição ajax.
        // Se não, direciona-o para a página inicial
        checkAuth: function () {
            var url = Config.baseUrl()+"sistema/ExpressaoIdioma/6/rotina";
            var response = Helpers.ajaxGet(url);
            var userIsLogged = false;

            if (response.status !== 401) {
                userIsLogged = true;
            }
            return userIsLogged;
        },

        // Permissões do Sistema
        permissions: {
            ava: 1,
            pap: 2,
            adm: 3
        },

        checkPermission: function () {

            window.name = window.name || Helpers.getRandomInt(999, 999999);; //cria um nome para janela para controlar permissão.

            var siteSection = Backbone.history.fragment.split("/")[0];
            var rotina = Backbone.history.fragment.split("/")[1];
            // var permissions = _.values(this.permissions);
            var hasPermission = false;
            var user;
            var userPerms;
            var message;
            var idsSistema = [];

            // Pega a permissão do usuário do storage
            StorageWrap.setAdaptor(sessionStorage);
            user = StorageWrap.getItem('user');

            var acessoRoa = StorageWrap.getItem('acessoRoa');

            if ( user ) {
                _.each(user.perfis, function (perfil) {
                    idsSistema.push(perfil.idSistema);
                });

//                userPerms = user.idSistema;

                if ( _.contains(idsSistema, 4)  || _.contains(idsSistema, this.permissions[siteSection]) ) {
                    hasPermission = true;
                }
                //se tem sessao de nova janela do roa e tentar acessar outro conteudo, nao permite acesso
                if (acessoRoa && rotina != 'roa' && rotina != 'acessoroa') {
                        hasPermission = false;                    
                }

                // Se as permissões do usuário for 4 ou compatível com a seção atual do site, 
                // o usuário tem permissão de  acesso.
//                if ( userPerms === 4 || this.permissions[siteSection] === userPerms ) {
//                    hasPermission = true;
//                }

                //Verifica se está na mesma sessão:
                if(user.window != window.name)
                {
                    //console.log(user);

                    //O ajax pode não ter sido iniciado ainda, então força:
                    Config.ajaxSetup().setToken({
                        token: user.token,
                        macAddress: '',
                        computador: ''
                    });

                    //Permite login simultaneo?
                    var loginSimultaneo = this.getUserPermissionsMetodo('loginsimultaneo');
                    //console.log(loginSimultaneo);
                    if (loginSimultaneo == void (0) || loginSimultaneo.length == 0) {
                        user = void (0);
                        StorageWrap.removeItem('user');
                        document.location = '';
                        return;
                    } else {
                        window.name = user.window;
                    }
                    
                }

            }

            if ( !user || !hasPermission ) {
                if ( !hasPermission ) { message = "Você não possui os privilégios necessários para acessar esta área ou efetuar esta ação."; }
                if ( !user ) { message = "Você precisa efetuar o Login para continuar."; }
                flashMessage({body: message, type: "danger" });

                // Redireciona o usuário para a página anterior.
                setTimeout(function () {
                    document.location = '#/';
                    $("#flashMessage").fadeOut('slow');
                }, 3000);

                return false;
            }
            return true;
        },
        setTokenHeader: function () {
            
            StorageWrap.setAdaptor(sessionStorage);
            var user = null;

            try {
                user = StorageWrap.getItem('user');
            } catch (e) {
                user = null;
            }

            var opcoes = {
                token: "",
                macAddress: "",
                computador: "",
                userAgent: window.UNINTER.userAgent
            };

            try { opcoes.token = user.token; } catch (e) { };
            var macAddress = $("#macAddressMaquina").val();
            if (Helpers.stringValida(macAddress)) {
                opcoes.macAddress = $("#macAddressMaquina").val();
                opcoes.computador = $("#nomeComputadorMaquina").val();
                window.UNINTER.userAgent = "Navegador-UNINTER";
                opcoes.userAgent = UNINTER.userAgent;
            }else if (user !== void(0) && user !== null) {
                try { opcoes.macAddress = user.macAddress; } catch (e) { };
                try { opcoes.computador = user.computador; } catch (e) { };
            }

            //var token = user.token;

            // var token = "B1C54C3191D6FE6EC6B710F73D24F0FC20FCA1FE";
            // $.ajaxSetup({
            //     beforeSend: function(xhr) { 
            //         xhr.setRequestHeader('Authorization', token );
            //     }
            // });
            // 
            Config.ajaxSetup().setToken( opcoes );
        },

        // Verifica as credenciais do usuário
        checkCredentials: function () {
            if ( this.checkPermission() ) { this.setTokenHeader(); }
        },

        // Pega as permissões do usuário para a localidade atual
        // @param sectionId int
        getUserPermissions: function (sectionId) {
            var url = Config.permissionsUrl(sectionId);
            var permissions = Helpers.ajaxRequest({ 'url': url });
            return permissions.rotinas;
        },
        getUserPermissionsMetodo: function (sectionId, metodoPermissao) {

            var user = StorageWrap.getItem('user');

            //Cache por usuario de permissão somente no JS
            if(user != void(0))
            {
                try {
                    UNINTER.Cache = UNINTER.Cache || {};

                    if (UNINTER.Cache[user.idUsuario] == void(0))
                    {
                        UNINTER.Cache = {}; //Reset - caso haja dados de um usuario anterior
                        UNINTER.Cache[user.idUsuario] = {
                            Permissoes: {}
                        }
                    }

                    if (UNINTER.Cache[user.idUsuario].Permissoes[sectionId] != void (0))
                    {
                        return UNINTER.Cache[user.idUsuario].Permissoes[sectionId];
                    }
                }catch(e){};
            }

            var url = Config.permissionsUrlMetodo(sectionId, metodoPermissao);

            if(url == null)
            {
                return [];
            }
            var permissions = Helpers.ajaxRequest({ 'url': url });
            
            try {
                UNINTER.Cache[user.idUsuario].Permissoes[sectionId] = permissions.rotinas;
                if (permissions.rotinas.length > 0) {
                    if (UNINTER.Cache[user.idUsuario].Permissoes[permissions.rotinas[0].nome] == void(0)) {
                        UNINTER.Cache[user.idUsuario].Permissoes[permissions.rotinas[0].nome] = permissions.rotinas;
                    }
                    if (UNINTER.Cache[user.idUsuario].Permissoes[permissions.rotinas[0].idRotina] == void (0)) {
                        UNINTER.Cache[user.idUsuario].Permissoes[permissions.rotinas[0].idRotina] = permissions.rotinas;
                    }
                }
            } catch(e){};

            return permissions.rotinas;
        },

        getAreaPerms: function (areaId) {
            var perms = this.getUserPermissions(areaId);
            return this.setActions(perms[0].permissoes);
        },

        getAreaPermsMetodo: function (areaId) {
            var perms = this.getUserPermissionsMetodo(areaId);
            try {
                return this.setActions(perms[0].permissoes);
            } catch (e) {
                console.log("Não possui permissão ou ocorreu algum erro na requisição.");
                return false;
            }
        },

        getAreaPermsMetodoPorId: function (idRotina) {
            var perms = this.getUserPermissionsMetodo(idRotina, 'RotinaPermissaoMenuPorId');
            try {
                return this.setActions(perms[0].permissoes);
            } catch (e) {
                console.log("Não possui permissão ou ocorreu algum erro na requisição.");
                return false;
            }
        },

        setActions: function (permissions) {
            var perms = {
                'GET': 'visualizar',
                'POST': 'cadastrar',
                'PUT': 'editar',
                'DELETE': 'remover',
                'GET/GrupoEstrutura': 'visualizarTodos',
                'POST/GrupoEstrutura' : 'cadastrarTodos'
            };
            var arr = [];

            _.each(permissions, function (value, index) {
                arr.push( perms[value] );
            });

            return arr;
        },

        viewCheckPerms: function (permissionName, areaPerms) {
            StorageWrap.setAdaptor(sessionStorage);
            var hasPermission = false, i = 0;

            var user = StorageWrap.getItem('user');
            var idSalaVirtual = StorageWrap.getItem('leftSidebarItemView');
            if ( idSalaVirtual ) {
                idSalaVirtual = idSalaVirtual.idSalaVirtual;
            } else {
                idSalaVirtual = 0;
            }
            var sala1 = '1240';
            var sala2 = '9191';
            var userLogin = '1004256';
//            var userLogin = '1013632';

            // sala 1240
            if (idSalaVirtual === sala1 || idSalaVirtual === sala2) {

//            if ((user.login === userLogin) && (idSalaVirtual === sala) ) {
                if (user.login === userLogin) {
                    for (i = 0; i < areaPerms.length; i++) {
                        if (areaPerms[i] === permissionName) { hasPermission = true; }
                    }
                }

            } else {
                if (areaPerms != void (0)) {
                    for (i = 0; i < areaPerms.length; i++) {
                        if (areaPerms[i] === permissionName) { hasPermission = true; }
                    }
                }
            }

            // Esconde a sala virtual da lista de salas virtuais se a tela for a inicial e o não for o permitido
            var location = document.location.hash.split('/'),
                isHome = _.isUndefined(location[2]) || location[2] === '';

            if (isHome) {
                for (i = 0; i < areaPerms.length; i++) {
                    if (areaPerms[i] === permissionName) { hasPermission = true; }
                }
            }

            return hasPermission;
        }
    }
});