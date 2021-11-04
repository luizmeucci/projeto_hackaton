/* ==========================================================================
   Left Sidebar ItemView
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 05/02/2014
   ========================================================================== */

define(function (require) {
    'use strict';

    var App = require('app'),
        $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        Marionette = require('marionette'),
        template = require('text!templates/ava/left-sidebar-template.html'),
        animatedIconsLib = require('libraries/animatedIcons'),
        animatedIcons,
        controleOfertas = require('libraries/controleOfertas'),
        ComboBox = require('libraries/Combobox');

    
    window.CONTROLE_OFERTA = null;
    var listaPermissoes = [];
    var templateMenu = '<% for (var i=0; i < listaPermissoes.length; i++){ %>' + 
     '<header data-section="<%=listaPermissoes[i].section%>">' + 
        '<h3 class="sidebar-item">' + 
            '<span class="sidebar-link-box">' + 
                '<a href="<%=  _.template(listaPermissoes[i].url, {idSalaVirtualOferta:idSalaVirtualOferta, codigoOferta: codigoOferta, token: token }) %>"  <%= (listaPermissoes[i].url.indexOf("http") > -1 ? "target=\'_blank\'" : "") %> >' +
                '<%if(listaPermissoes[i].idMenu == 60 && totalTrabalho > 0){ %><span class="menu-notification-counter" data-notification="trabalho"><%= totalTrabalho %></span><%}%>' +
                    '<span class="sidebar-link-box-icon">' + 
                        '<%=listaPermissoes[i].icone%>' + 
                    '</span>' + 
                    '<span class="sidebar-link-box-title"><%=listaPermissoes[i].ExpressaoIdioma%></span>' + 
                '</a>' + 
            '</span>' + 
        '</h3>' + 
    '</header>' + 
    '<%}%>';
    return Marionette.ItemView.extend({
        initialize: function (options) {
          
            App.StorageWrap.setAdaptor(sessionStorage);
            var self = this;
            listaPermissoes = App.session.get('LeftSideBarSala');
            $(listaPermissoes).each(function (i, item) {
                listaPermissoes[i].section = listaPermissoes[i].url.replace('#/ava/', '')
            });
            animatedIcons = animatedIconsLib({ 'selector': '#leftSidebarItemView i.livicon', 'iconOptions': { 'size': 53, 'color': '#999' } });

            if ( options && options.actions ) { this.actions = options.actions; }
            this.idSalaVirtual = (options.idSalaVirtual) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idSalaVirtual : null);
            this.idSalaVirtualOferta = (options.idSalaVirtualOferta) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOferta : null);
            this.cIdSalaVirtual = (options.cIdSalaVirtual) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').cIdSalaVirtual : null);
         
            this.cIdSalaVirtualOferta = (options.cIdSalaVirtualOferta) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').cIdSalaVirtualOferta : null);

      

            this.idSalaVirtualOfertaPai = (options.idSalaVirtualOfertaPai) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOfertaPai : null);
            this.idSalaVirtualOfertaAproveitamento = (options.idSalaVirtualOfertaAproveitamento) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOfertaAproveitamento : null);
            
            this.totalFilhas = (options.totalFilhas) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').totalFilhas : null);
            this.ofertaMaster = (this.totalFilhas > 0) ? true : false;
            this.idCurso = (options.idCurso) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idCurso : null);
            this.nomeCurso = (options.nomeCurso) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').nomeCurso : null);
            this.nomeSalaVirtual = options.nomeSalaVirtual || this.getNomeSalaVirtual();
            this.idCursoModalidade = (options.idCursoModalidade) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idCursoModalidade : null);
            this.idCursoNivel = (options.idCursoNivel) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idCursoNivel : null);
            this.codigoOferta = null;
            this.usuarioInscrito = (options.usuarioInscrito) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').usuarioInscrito : true);
            this.permissaoTCC = false;//(options.permissaoTCC == null) ? this.getPermissaoTCC() : App.StorageWrap.getItem('leftSidebarItemView').permissaoTCC;
            this.fnChangeSalaVirtualOferta = options.fnChangeSalaVirtualOferta || null;
            this.idSalaVirtualMetodoInscricao = (options.idSalaVirtualMetodoInscricao) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualMetodoInscricao : null)
            this.idMultidisciplinar = (options.idMultidisciplinar) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idMultidisciplinar : null);
            this.utilizaPesoMedia = (options.utilizaPesoMedia) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').utilizaPesoMedia : null);
            this.utilizaTrabalho = (options.utilizaTrabalho) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').utilizaTrabalho : null);
            this.totalAvaliacao = (options.totalAvaliacao) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').totalAvaliacao : null);
            this.totalTrabalho = (options.totalTrabalho) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').totalTrabalho : null);
            this.idUsuarioSalaVirtualOferta = (options.idUsuarioSalaVirtualOferta) || (options.id) || ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').idUsuarioSalaVirtualOferta : null);

            // Define o item ativo sempre que a aplicação anuncia a mudança de rota
            App.vent.off('route:before:leftsidebar');
            App.vent.on('route:before:leftsidebar', function () {
                self.setActiveItem();
            });

            window.CONTROLE_OFERTA = new controleOferta;
            
            $("#infobarItemView").html("");
        },

        events: {
            'click a': 'linkClickHandler',
            'keydown a': App.Helpers.enterTriggerClick,
            'change [data-notification]': 'triggerAtualizarContagemNotificacao',
        },

        linkClickHandler: function linkClickHandler (e) {
            App.loadingView.reveal();
        },

        triggerAtualizarContagemNotificacao: function () {

            var objSession = App.StorageWrap.getItem('leftSidebarItemView');

            if(!(objSession.idUsuarioSalaVirtualOferta > 0))
            {
                //Se não tem id na session não faz nada.
                return;
            }

            App.Helpers.ajaxRequest({
                async: true,
                type: 'GET',
                url: App.config.UrlWs('bqs') + 'PendenciaUsuario/'+objSession.idUsuarioSalaVirtualOferta+'/Total',
                successCallback: function (data) {
                    try {
                        objSession.totalAvaliacao = data.pendenciaUsuarioTotal.totalAvaliacao;
                        objSession.totalTrabalho = data.pendenciaUsuarioTotal.totalTrabalho;

                        App.StorageWrap.setItem('leftSidebarItemView', objSession);

                        if (objSession.totalAvaliacao == 0) {
                            $('[data-notification="avaliacao"]').remove();
                        } else {
                            $('[data-notification="avaliacao"]').html(objSession.totalAvaliacao);
                        }

                        if (objSession.totalTrabalho == 0) {
                            $('[data-notification="trabalho"]').remove()
                        } else {
                            $('[data-notification="trabalho"]').html(objSession.totalTrabalho);
                        }
                        
                    } catch (e) { }

                }, errorCallback: function () { }
            });
        },

        getNomeSalaVirtual: function () {
           
            return ((App.StorageWrap.getItem('leftSidebarItemView')) ? App.StorageWrap.getItem('leftSidebarItemView').nomeSalaVirtual : App.Helpers.getNomeSalaVirtual(this.idSalaVirtual));
            
        },

     

        template: _.template(template),

        serializeData: function () {

            var self = this;

            
            
            var permissoesAvaliacao = UNINTER.Helpers.Auth.getAreaPermsMetodo("avaliacao");
            var permissaoAvaliacaoTutor = App.auth.viewCheckPerms('cadastrar', permissoesAvaliacao);

            var avaliacaoUrl = 'AvaliacaoUsuario';

            if (permissaoAvaliacaoTutor)
            {
                var objSalaSession = App.StorageWrap.getItem('leftSidebarItemView');
                if (objSalaSession == void (0) || objSalaSession.utilizaPesoMedia == false) {
                    avaliacaoUrl = 'Avaliacao';
                } else {
                    avaliacaoUrl = 'AvaliacaoTipoCurso/' + App.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOferta + '/novo/salavirtualoferta';
                }
            }
            
            
            return {
                'nomeSalaVirtual': this.nomeSalaVirtual,                
                'atividadeId': encodeURIComponent(this.cIdSalaVirtual),
                'avaliacaoUrl': avaliacaoUrl,
                'listaPermissoes': listaPermissoes,
                'totalAvaliacao': App.StorageWrap.getItem('leftSidebarItemView').totalAvaliacao,
                'totalTrabalho': App.StorageWrap.getItem('leftSidebarItemView').totalTrabalho

                /*'atividadeId': this.idSalaVirtual,
                'nomeSalaVirtual': this.nomeSalaVirtual,
                'avaliacaoUrl': avaliacaoUrl,
                'entregaTrabalhoUrl': entregaTrabalhoUrl,
                'permissaoAdministracaoSalaVirtual': permissaoAdministracaoSalaVirtual,
                'administracaoSalaVirtualUrl': administracaoSalaVirtualUrl,
                'tutorCoach': tutorCoach,*/


            };
        },

        urlHandler: function urlHandler () {
            var url = document.location.hash,
                arr = url.split('/'),
                page = (arr[2]) ? arr[2].toLowerCase() : '',
                param = (arr[3]) ? arr[3].toLowerCase() : '';

            return {
                page: page,
                param: param
            };
        },

        hasIdSalaVirtual: true,

        storeSvId: function () {
            //if (this.idUsuarioSalaVirtualOferta == void(0))
            //{
            //    console.trace();
            //    debugger;
            //}
            
            var user = App.StorageWrap.getItem('user');
            
            App.StorageWrap.setItem('leftSidebarItemView', {
                'idSalaVirtual': this.idSalaVirtual,
                'cIdSalaVirtual': this.cIdSalaVirtual,
                'nomeSalaVirtual': this.nomeSalaVirtual,
                'idSalaVirtualOferta': this.idSalaVirtualOferta,
                'cIdSalaVirtualOferta': this.cIdSalaVirtualOferta,
                'codigoOferta': this.codigoOferta,
                'idSalaVirtualOfertaPai': this.idSalaVirtualOfertaPai,
                'idSalaVirtualOfertaAproveitamento': this.idSalaVirtualOfertaAproveitamento,
                'idSalaVirtualMetodoInscricao': this.idSalaVirtualMetodoInscricao,
                'totalFilhas': this.totalFilhas,
                'idMultidisciplinar': this.idMultidisciplinar,
                idCurso: this.idCurso,
                nomeCurso: this.nomeCurso,
                idCursoModalidade: this.idCursoModalidade,
                idCursoNivel: this.idCursoNivel,
                ofertaMaster: this.ofertaMaster,
                usuarioInscrito: this.usuarioInscrito,
                utilizaPesoMedia: this.utilizaPesoMedia,
                utilizaTrabalho: this.utilizaTrabalho,
                idUsuario: (user != void (0) ? user.idUsuario : null),
                totalAvaliacao: this.totalAvaliacao,
                totalTrabalho: this.totalTrabalho,
                idUsuarioSalaVirtualOferta: this.idUsuarioSalaVirtualOferta
            });
        },

        retrieveSvId: function () {
            var item = App.StorageWrap.getItem('leftSidebarItemView');
            if (item && item.idSalaVirtual) {
                this.atividadeId = item.idSalaVirtual;
            } else {
                this.hasIdSalaVirtual = false;
                App.logger.warn('Nenhum id de sala virtual foi previamente armazenado.');
            }
        },

        // Define o status de ativo no item do menu, de acordo com a url
        setActiveItem: function () {
            var location = this.urlHandler(),
                page = location.page;

            if ( page === 'interacaocontrole' ) {
                page = page + '/' + location.param;
            }

            this.$el
                .find('header[data-section]')
                .removeClass('active')
                .each(function () {
                    var section = $(this).data('section').toLowerCase();
                    section = section.split(',');

                    if ( _.contains(section, page) ) {
                        $(this).addClass('active');
                    }
                });
        },

        onShow: function () {
            this.getPermissoesMenu();
            this.setActiveItem();

            animatedIcons.add();

            if (!this.hasIdSalaVirtual) {
                this.$el.find('.sidebar-item').eq(0).find('a').attr('href', '#/ava');
            }

            
            // Por algum motivo os eventos não são delegados automaticamente...
            // Esta é uma solução temporária.
            // Re-delegando os eventos:
            this.delegateEvents();

            var permissaoCombo = App.auth.getAreaPermsMetodo('ComboOfertas');
            
            window.CONTROLE_OFERTA.SetComboSalaVirtualOferta(ComboBox);
            window.CONTROLE_OFERTA.fnChange = this.fnChangeSalaVirtualOferta;
            window.CONTROLE_OFERTA.idSalaVirtualOfertaInicializar = this.cIdSalaVirtualOferta != null ?encodeURIComponent(this.cIdSalaVirtualOferta): this.idSalaVirtualOferta ;
   
            if (_.contains(permissaoCombo, "visualizar")) {
                window.CONTROLE_OFERTA.Render();

                //$("#sidebarCurrentArea").css("margin-top", "48px");
            } else {
              
                var data = App.Helpers.getCodigoOfertAtual(this.idSalaVirtual);
                $('#idTotalAvisos').trigger('change.atualizarTotaisSala');
                this.codigoOferta = data.codigoOferta;
                this.idSalaVirtualOferta = data.idSalaVirtualOferta;
                this.idSalaVirtualOfertaPai = data.idSalaVirtualOfertaPai;
                this.totalFilhas = data.totalFilhas;
                this.idCursoModalidade = data.idCursoModalidade;
                this.idCursoNivel = data.idCursoNivel;
                this.utilizaPesoMedia = data.utilizaPesoMedia;
                this.utilizaTrabalho = data.utilizaTrabalho;
                this.totalAvaliacao = data.totalAvaliacao;
                this.totalTrabalho = data.totalTrabalho;
                this.idUsuarioSalaVirtualOferta = data.id || data.idUsuarioSalaVirtualOferta;
                this.storeSvId();
                if(data.idGrupoEstrutura > 0)
                {
                    //Se o idGrupoEstrutura for diferente da sessao, precisa atualizar:
                    var usuario = App.StorageWrap.getItem('user');
                    if(usuario.idGrupoEstrutura != data.idGrupoEstrutura)
                    {
                        usuario.idGrupoEstrutura = data.idGrupoEstrutura;
                        App.StorageWrap.setItem('user', usuario);
                    }
                }
                if(this.fnChangeSalaVirtualOferta != void(0))
                    this.fnChangeSalaVirtualOferta();
            }

            
            if (App.StorageWrap.getItem('leftSidebarItemView')) {
                if (App.StorageWrap.getItem('leftSidebarItemView').nomeCurso) {
                    var ol = $("<ol>").html("<li>Curso: " + App.StorageWrap.getItem('leftSidebarItemView').nomeCurso + "</li>");
                    $("#infobarItemView").html(ol);
                }
            }            
        },
        setChangeOferta: function (fn) {
            this.fnChangeSalaVirtualOferta = fn;
            window.CONTROLE_OFERTA.SetFnChange(fn);
        },
        getPermissoesMenu: function () {
            var self = this;
            if (listaPermissoes == null) {
                App.Helpers.ajaxRequest({
                    async: true,
                    type: 'GET',
                    url: App.config.UrlWs('sistema') + 'Menu/51/GetMenusFilhos',
                    successCallback: function (r) {
                        App.session.set('LeftSideBarSala', r.MenusFilhos);
                        listaPermissoes = App.session.get('LeftSideBarSala');

                        self.renderMenu();

                    }, errorCallback: function () { }
                });
            } else self.renderMenu();
        },
        renderMenu: function () {
            var user = App.StorageWrap.getItem('user');
            var oferta = App.StorageWrap.getItem('leftSidebarItemView');

            var html = _.template(templateMenu,
                {
                    'listaPermissoes': listaPermissoes,
                    token: user.token,
                    idUsuario: user.idUsuario,
                    idSalaVirtualOferta: oferta.idSalaVirtualOferta,
                    codigoOferta: oferta.codigoOferta,
                    totalAvaliacao: oferta.totalAvaliacao,
                    totalTrabalho: oferta.totalTrabalho
                });
            $("#divMenuLateralSala").html(html );
        }
    });
});
