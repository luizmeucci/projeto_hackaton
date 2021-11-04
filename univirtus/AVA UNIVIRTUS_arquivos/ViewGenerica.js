/* ==========================================================================
   View Generica
   @author: Ericson Baggio
   @date: 07/04/2014
   ========================================================================== */
define(function (require) {
    'use strict';
    var App = require('app');
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var template = require('text!templates/common/block-container-template_old.html');
    var templateSimular = require('text!templates/ava/simular-usuario-template.html');
    var Collection = require('collections/common/Collection');
	var jQueryMask = require('vendor/jquery.mask');
	var datepicker = require('vendor/bootstrap-datepicker/bootstrap-datetimepicker');
	var datepickerPtBr = require('vendor/bootstrap-datepicker/locales/bootstrap-datetimepicker.pt-BR');
	var popover = null;
	var accordion = null;
	window.moment = require('moment');

    return Marionette.Layout.extend({
        initialize: function (parametros) {

            UNINTER.contexto = parametros;

            //Caminho onde deverá carregar o javascript.
            this.caminhoJs = "views/" + parametros.sistema + "/" + parametros.rotina + "/";
            
            
            //Disse onde renderizar?
            this.elemento = "#theList";
			
			if(parametros.metodo == "lista")
				parametros.metodo = "";
			
            if (App.Helpers.stringValida(parametros.elemento)) {
                this.elemento = parametros.elemento;
            } else if (App.Helpers.stringValida(parametros.metodo)) {
                this.elemento = "#view" + parametros.rotina.toLowerCase();
            }

            //Chegou as permissoes?
            if (!parametros.areaPerms || parametros.areaPerms.length == 0) {
                parametros.areaPerms = App.auth.getAreaPermsMetodo(parametros.rotina);
            }

            //Setamos os parametros para ficar disponivel nas outras funcoes.
            this.parametros = parametros;
            UNINTER.contexto = parametros;

            
            //tentamos nos livrar do tiny!
            if (this.parametros.renderizarNovoContexto === true) {
                
                try {
                    
                    
                    if (tinymce.editors) {
                        //console.info("Total de editores: " + tinymce.editors.length);
                        
                        if (tinymce.editors.length > 0) {
                            //se tem editores, destroy todos
                            
                            //$.each(tinymce.editors, function (i, tiny) {
                            var tiny;
                            for (tiny in tinymce.editors) {
                                if (tiny != void (0) && tiny != null) {
                                    
                                    //verifica se elemento existe antes de destrui-lo... se nao pode dar erro
                                    //if($(document).find(tinymce.editors[tiny].id).length > 0)
                                    try {
                                        tinymce.editors[tiny].destroy();
                                    } catch (e) {
                                        //Erro ao destruir tiny
                                    }
                                }
                            }
                            //});
                            
                            //remove qualquer vestigio
                            tinymce.remove();
                            
                            
                        }
                    }
                }
                catch (e) {
                    //tinymce.remove();
                   
                    console.error("Erro ao destruir tiny" + e);

                }
            }

            /*if (tinymce.editors) {
                tinymce.editors = [];
            }*/

               
            
        },
        getNomeFnInicializar: function (caminhoCompleto) {
            var self = this;
            var nmFnInicializar = self.parametros.rotina;

            if (App.Helpers.stringValida(self.parametros.metodo) == false) {
                nmFnInicializar = nmFnInicializar + "lista";
            }

            if (caminhoCompleto) {
                nmFnInicializar = "UNINTER.inicializar." + nmFnInicializar;
            }

            return nmFnInicializar;
        },
        getFnInicializar: function () {
            var self = this;
            var fn = null;
            try{
                fn = UNINTER.inicializar[self.getNomeFnInicializar()];
            }catch(e)
            {
                fn = null;
            }

            return fn;
        },
        inicializar: function () {

            var self = this;
            var fn = self.getFnInicializar();

            if (self.modoDebugger == true) {    
                fn(self.parametros.construtor, void(0), self);
                //fn(self.parametros.construtor);
            } else {
                try {
                    fn(self.parametros.construtor, void(0), self);
                    //fn(self.parametros.construtor);
                } catch (e) {
                    console.error("Inicializar (UNINTER.inicializar." + nmFnInicializar + ") não existe ou contém erro => Exception");
                    console.error(e);
                }
            }
        },
        getApp: function () {
            return App;
        },
        modoDebugger: true,
        elemento: null,
        viewGeradas: {},
        id: 'blockContainer',
        className: 'block-container',
        breadcrumb: null,
        regions: {
            theForm: '#theForm',
            theList: '#theList',
            formContainer: '#formContainer'
        },
        parametros: null,
        objEdicao: null,
        htmlForm: null,
        caminhoJs: null,
        template: _.template(template),
        callback: null,
        events: {
            //'click #goBack': 'toggleVisibilityVoltar',
            'click #go': 'toggleVisibility'
        },
        toggleVisibilityVoltar: function () {

            var self = this;
            var urlVoltar = $(self.elemento + " .goBack").parent().attr("href");
            var urlAtual = "#/" + App.mainRouter._current().fragment;
            
            
            
            if (typeof self.callback == "function") {
                try {
                    self.callback();
                    
                } catch (e) {
                    console.error("Erro ao chamar funcão callback => exception: ");
                    console.error(e);
                }                
            }
            
            //Se a URL  é diferente da atual, deixa fazer o location. Se for a mesma URL, fazemos o toggleVisibility.
            if (urlVoltar.replace(" ", "") == 'javascript:void(0)') {
                $(self.elemento + " .goBack").parent().trigger("click");
            } else if (urlVoltar.toLowerCase() != urlAtual.toLowerCase()) {
                window.location = urlVoltar;
            } else if (self.parametros.elementoVoltar) {

                self.toggleVisibilityItem(self.parametros.elementoVoltar);
            } else {

                self.toggleVisibilityItem("#theList");
            }
            
            
        },
        toggleVisibility: function () {
            this.$el.find('.block-item').toggleClass('active');
            //App.Helpers.animatedScrollTop();
            this.setPlaceholderHeight();
        },
        toggleVisibilityItem: function (item) {
            
            // A funcao toggleVisibility() apenas troca p active entre as divs, mas quando vc não sabe onde você está, não pode utilizar.
            //Criado essa função para que fique com o active apenas a função que eu pedi.
            $(".block-item").removeClass("active");
            
            $(item).addClass("active");
            //App.Helpers.animatedScrollTop();
            this.setPlaceholderHeight();
        },
        setPlaceholderHeight: function () {
            
            var self = this;
            var itemHeight = null,
			addHeight = null;
            
            // Armazena a altura do item sendo mostrado no momento
            itemHeight = $('#blockContainer .block-item.active').height();
            // Aumentar o tamnho do item no valor abaixo
            addHeight = 80;

            // Aplica o tamanho ao placeholder principal acrescido do tamanho adicional
            $("#blockContainer").css({ "min-height": itemHeight + addHeight + "px" });
            
        },
        setErrorPlacement: function (error, element) {
            // Define o elemento que receberá a mensagem de erro na validação dos inputs
            var group = element.closest('div.form-group');
            $(group).find('span.help-block').remove();
            error.addClass('help-block').insertAfter(element);
            group.removeClass("has-success").addClass("has-error");
            var a = element.closest('div.form-group').find('div:first');
            error.appendTo(a);
        },

        //Form, dados e inputs:
        getParametrosForm: function () {
            var self = this;

            //Possiveis atributos a serem recuperados do FOMR.
            var parametrosForm = {
                arrayJs: null,
                ws: null,
                actionForm: null,
                contract: null,              
                get: null,
                plugins: null,
                vendor: null,
                funcaoValidacao: null,
                expressaoIdioma: null
            };
            
            //Elemento para consultar
            var elemento = self.elemento.toLowerCase() + " form";
            //Tentamos recuperar todos os dados possiveis. Try/Catch para evitar erro no console.
            try { parametrosForm.arrayJs = $(elemento).data('js').split(";"); } catch (e) { console.warn("Parametro JS não capturado do form.") };
            try { parametrosForm.ws = $(elemento).data('ws'); } catch (e) { console.warn("Parametro WS não capturado do form.") };
            try { parametrosForm.contract = $(elemento).data('contract'); } catch (e) { console.warn("Parametro CONTRACT não capturado do form.") };
            try { parametrosForm.get = $(elemento).data('get'); } catch (e) { console.warn("Parametro GET não capturado do form.") };
            try { parametrosForm.actionForm = $(elemento).attr('action'); } catch (e) { console.warn("Parametro ACTION não capturado do form.") };
            try { parametrosForm.plugins = $(elemento).data('plugins').split(";"); } catch (e) { console.warn("Parametro PLUGINS não capturado do form.") };
            try { parametrosForm.get = parametrosForm.get.replace("{idUrl}", isNaN(self.parametros.idUrl) ? encodeURIComponent(self.parametros.idUrl): self.parametros.idUrl ); } catch (e) { console.warn("erro ao ajustar o ID da URL nos parametros do form") };
            try { parametrosForm.funcaoValidacao = $(elemento).data('funcaovalidacao'); } catch (e) { console.warn("Parametro funcaoValidação não capturado do form.") };
            try { parametrosForm.vendor = $(elemento).data('vendor').split(";"); } catch (e) { console.warn("Parametro VENDOR não capturado do form.") };
            try { parametrosForm.expressaoIdioma = $(elemento).data('expressaoidioma') } catch (e) { console.warn("Parametro EXPRESSAOIDIOMA não capturado do form.") }
            try { self.breadcrumb = $(elemento).data('title'); } catch (e) { console.warn("Parametro TITLE não capturado do form.") };
            return parametrosForm;
        },
        getParametrosLista: function(){
            var self = this;

            //Possiveis atributos a serem recuperados do FOMR.
            var parametrosForm = {
                arrayJs: null,
                plugins: null,
                vendor: null,
                expressaoIdioma: null
            };

            //Elemento para consultar
            var elemento = self.elemento + " div:first";

            //Tentamos recuperar todos os dados possiveis. Try/Catch para evitar erro no console.
            try { parametrosForm.arrayJs = $(elemento).data('js').split(";"); } catch (e) { console.warn("Parametro JS não capturado para lista.") };
            try { parametrosForm.plugins = $(elemento).data('plugins').split(";"); } catch (e) { console.warn("Parametro PLUGINS não capturado para lista.") };
            try { parametrosForm.vendor = $(elemento).data('vendor').split(";"); } catch (e) { console.warn("Parametro VENDOR não capturado para lista.") };
            try { parametrosForm.expressaoIdioma = $(elemento).data('expressaoidioma') } catch (e) { console.warn("Parametro EXPRESSAOIDIOMA não capturada do form.") }

            try { self.breadcrumb = $(elemento).data('title'); } catch (e) { console.warn("Parametro TITLE não capturado para lista.") };

            return parametrosForm;
        },
        
        populaForm: function(){
            
            var self = this;
       
            //Id da URL
            var idForm = $(self.elemento + " #id").val() != void(0) ? $(self.elemento + " #id").val() : "";
            var parametrosForm = self.getParametrosForm();
            var idParametroForm = self.parametros.idUrl != void (0) ? self.parametros.idUrl : "";
            collection = new Collection(parametrosForm.contract);
            
            //Se o idRequisitado (URL) é o mesmo que já estava carregado (FORM), não fazemos nada
            if (idForm.toString() !== self.parametros.idUrl.toString() && parametrosForm.ws !== "") {
                
                //Buscamos os dados:
                var collection = new Collection(parametrosForm.contract);
                
                var url = App.config.UrlWs(parametrosForm.ws) + parametrosForm.actionForm + "/" + parametrosForm.get;

                //Tentamos substituir o idSalaVirtual e idSalaVirtualOferta da url:
                try {
                    var objSala = UNINTER.StorageWrap.getItem('leftSidebarItemView');
                    if (objSala != void (0))
                    {
                        url = url.replace("{idSalaVirtual}", objSala.idSalaVirtual);
                        url = url.replace("{idSalaVirtualOferta}", objSala.idSalaVirtualOferta);
                    }

                } catch (e) { };
                
                $.when(                	
                    App.Helpers.fetchCollectionDeferred(collection, url)                                      
                ).done(function (data) {
                    
                    self.objEdicao = data;
                    
                    //Vamos contar os elementos para saber quando executar o inicializar:
                    var total = parseInt($(self.elemento + " form :input").length) - 1;

                    //percorremos os inputs e colocamos os valores necessarios:
                    $(self.elemento + " form :input").each(function (i, item) {
                    	
                        try {
                            //Se for select, precisamos popular os inputs.
                            if (item.type == "select-one") {
                                $(this).val(data.models[0].get($(this).attr("name")));
                                $("#" + item.id + "Temp").val(data.models[0].get(item.name));
                                var select = item;
                                //Testamos o option para achar o valor selecionado.
                                $(item).find("option").each(function () {
                                    var a = $(this).val() + "";
                                    var b = data.models[0].get(item.name) + "";

                                    if (a == b) {
                                        $(this).attr("selected", "true");
                                        try {
                                            $(select).select2("val", a); //Plugin do autocomplete
                                        } catch (e) {
                                            console.error("Tentativa de iniciar o plugin select 2 falhou para combo: " + item.nome + " - è possivel que ela não seja autocomplete.")
                                        }
                                    }
                                });
                                //Se for radio, verificamos qual esta marcado.
                            } else if (item.type == "radio") {
                                var a = item.value + "";
                                var b = data.models[0].get(item.name) + "";
                                if (a == b) {
                                    $(this).attr("checked", "true");
                                    $(this).prop("checked", "true");
                                }
                            } else if (item.type == "checkbox") {
                                var a = item.value.toString();
                                var b = data.models[0].get(item.name);

                                if (_.isArray(b) && _.contains(b, a)) {
                                    $(this).prop("checked", "true");
                                } else {
                                    if (a.toString() == b.toString()) {
                                        $(this).prop("checked", "true");
                                    }
                                }
                            } else {
                                //Não é select nem radio, somente atribuimos o val.
                                $(this).val(data.models[0].get($(this).attr("name")));
                                
                            }
                        } catch (e) {
                            //Ocorreu erro ao popular;
                            console.warn("Esse atributo não possui valor para ser associado: " + $(this).attr("name"));
                        }

                        //Executou todos os inputs, então vamos inicializar a função.
                        if (total == i) {
							
                            self.validarSelects(true);
                            self.validarGrids(true);
                            //self.validarUpload(self.elemento);
                            self.inicializar();
                        }
                    });
                }).fail(function (error) {
                    //Não executou o select corretamente. Exibimos mensagem
                    var opcoes = {
                        body: "Registro não disponível.",
                        strong: "",
                        type: "danger",
                        appendTo: self.elemento + " #mensagem"
                    }

                    //Limpamos o espaço da mensagem.
                    $(self.elemento + " #mensagem").empty();

                    //Adicionamos nova mensagem.
                    App.flashMessage(opcoes);

                    //Bloqueamos os inputs para evitar que seja inserido um novo registro.
                    self.limparForm(); //Caso tenha algum dado de uma exibição anterior.
                    self.bloquearInputs();
                }).always(function (erro) {
                    
                });
            } else {
                self.inicializar();
            }
        },
        limparForm: function () {
            //Remove todos os valores dos inputs;
            var self = this;
            $(self.elemento + " form :input").each(function (i, item) {                
                
                if (item.type == "radio" || item.type == "checkbox") {
                    $(this).removeAttr("checked");
                    $(this).prop("checked", false);
                    try {
                        $(this).removeAttr("selected");
                        $(this).prop("selected", false);
                        $(item).select2("val", "");
                    } catch (e) {
                        console.error(e);
                    }
                }else{
                    $(this).val("");
                }
            });
            $(self.elemento + " #id").val(0);
        },
        bloquearInputs: function () {
            var self = this;
            //Ocultamos os botoes, pois não terá acao:
            $(self.elemento + "#botoes [type='submit'],#botoes [type='button']").hide();
                
            //Adiciona o bloqueio "disabled"
            $(self.elemento + " form :input").each(function (i, item) {
                $(this).attr("disabled", "disabled");
                if (item.type == "select-one") {
                    $(item).select2("enable", false);
                }
            });
        },
        desbloquearInputs: function () {
            
            var self = this;
            //Remove o bloqueio "disabled"
            $(self.elemento + " form :input").each(function (i, item) {
                $(this).removeAttr("disabled");
                if (item.type == "select-one") {
                    $(item).select2("enable", true);
                }
            });

            //Voltamos os botoes
            $(self.elemento + "#botoes [type='submit'],#botoes [type='button']").show();
        },
        limparGridsForm: function(){
        	var self = this;
        	
        	//caso nao precise exibir o grid, limpa grid #ellen
            $(self.elemento + " div.grid").each(function (i, item) {            	
                if(eval($(this).data("exibir")) == false)
                $(this).html("");	
            });
        },
        formBotoes: function () {
            var self = this;
            var elemento = self.elemento + " #botoes";
            $(elemento).html("");
            
            if (typeof self.callback == "function" && self.parametros.ocultarSelecionar == false) {
                //Botão cancelar
                var button = $("<button></button>");
                button.addClass("btn btn-success");
                button.html("Selecionar");
                button.data("action", "selecionar");
                button.attr("id", "selecionar");
                $(elemento).append(button);

                //Botão cancelar
                var button = $("<button></button>");
                button.addClass("btn btn-default");
                button.html("Cancelar");
                button.data("action", "cancelar");
                $(elemento).append(button);

            } else { 

                if (self.parametros.metodo.toLowerCase() == "excluir") {
                    //Remover
                    var button2 = $("<button></button>");
                    button2.addClass("btn btn-danger");
                    button2.html("Excluir");
                    button2.data("action", "remover");
                    $(elemento).append(button2);

                    //Botão cancelar
                    var button = $("<button></button>");
                    button.addClass("btn btn-default");
                    button.html("Cancelar");
                    button.data("action", "cancelar");
                    $(elemento).append(button);

                } else if (self.parametros.metodo.toLowerCase() == "editar" ||  self.parametros.metodo.toLowerCase() == "novo") {
                    //Salvar
                    var button2 = $("<button></button>");
                    button2.addClass("btn btn-primary");
                    button2.data("action", "submit");
                    button2.html("Salvar");
                    $(elemento).append(button2);

                    //Botão cancelar
                    var button = $("<button></button>");
                    button.addClass("btn btn-default");
                    button.html("Cancelar");
                    button.data("action", "cancelar");
                    $(elemento).append(button);
                }
            }

        },
        formNovo: function () {
            var self = this;
            $(self.elemento + " select").each(function (i, item) {
                $(this).data("popularaoiniciar", "false");
            });
            self.validarGrids(false); //#ellen
            self.limparGridsForm();
            self.validarSelects(false);            
            self.desbloquearInputs(); //Remove o disable dos inputs
            //self.validarUpload(self.elemento);
            self.inicializar();
        },
        formExibir: function () {            
            var self = this;

            //id=0 e metodo de exibicao.
            if (self.parametros.idUrl != null && self.parametros.idUrl.length == 0) {
            	self.limparGridsForm(); //#ellen
                var opcoes = {
                    body: "Registro não disponível.",
                    strong: "",
                    type: "danger",
                    appendTo: self.elemento + " #mensagem"
                }
				
                //Adicionamos nova mensagem.
                App.flashMessage(opcoes);
            } else {
            

                self.populaForm(); //Faz requisicao e popula os dados pelo nome do input.
                self.bloquearInputs(); //Insere disable nos inputs
            }
        },
        formEditar: function () {            
            var self = this;
            
            //id=0 e metodo de edição.
            if (parseInt(self.parametros.idUrl) == 0 && self.parametros.idUrl.length <= 1) {
            	self.limparGridsForm();
                var opcoes = {
                    body: "Registro não disponível.",
                    strong: "",
                    type: "danger",
                    appendTo: self.elemento + " #mensagem"
                }

                //Adicionamos nova mensagem.
                App.flashMessage(opcoes);
            } else {
                self.populaForm(); //Faz requisicao e popula os dados pelo nome do input.
                self.desbloquearInputs();//Remove disable nos inputs, caso haja.;
            }

        },
        formExcluir: function () {
            var self = this;
            self.formExibir();
        },
        formHelper: function () {

            var self = this;

            $(self.elemento + ' input[data-ajuda]').each(function (i, item) {
                var possuiFilho = $(item).parent().parent().find('button');
                
                if(possuiFilho.length > 0){
                    return false;
                }
                
                var divPai = $('<div>');
                divPai.addClass("input-group");
                divPai.append($(item).parent().html());

                var icone = $('<i>');
                icone.addClass("icon-question");

                var btnAjuda = $('<button>');
                btnAjuda.attr("type", "button");
                btnAjuda.html("");
                btnAjuda.addClass("btn btn-primary");
                btnAjuda.html(icone);
                btnAjuda.attr("data-container", "body");
                btnAjuda.attr("data-toggle", "tooltip");
                btnAjuda.attr("data-placement", "bottom");
                btnAjuda.attr("title", $(item).data('ajuda'));
                btnAjuda.attr("data-content", $(item).data('ajuda'));

                var span = $("<span>");
                span.addClass("input-group-btn");
                span.html(btnAjuda);

                divPai.append(span);
                $(item).parent().html(divPai);
            });
            //self.iniciarPopover();
            
            $('[data-toggle="tooltip"]').tooltip();
            //$('[data-toggle="popover"]').popover();
        },
        iniciarPopover: function () {
            var self = this;
            var popover = require('libraries/popover');
            popover({ 'target': '[data-toggle="popover"]' });
        },
        iniciarAccordion: function (opcoes) {
            var self = this;
            accordion = require('libraries/accordion');
            accordion(opcoes).init();
        },
        getCombobox: function () {
            var Combobox = require('libraries/Combobox');
            return Combobox;
        },
        getSlider: function () {
            var urlSlider = 'vendor/bootstrap-slider.min'
            var Slider = require(urlSlider);
            return Slider;
        },
        getFullCalendar: function () {
            //var fullCalendar = require('Vendor/fullCalendar/fullcalendar');
            //return fullCalendar;
        },

        getBootStrapCalendar: function () {
            var underscore = require('Vendor/bootstrap-calendar/components/underscore/underscore-min');
            var jstz = require('Vendor/bootstrap-calendar/components/jstimezonedetect/jstz.min');
            var language = require('Vendor/bootstrap-calendar/js/language/pt-BR');
            var calendar = require('Vendor/bootstrap-calendar/js/calendar');
            return true;
        },


        getAnexosView: function () {
            var AnexosView = require('views/common/AnexosView');
            return AnexosView;
        },
        
        getEditorTextoAvancado: function () {
            var Tinymce = require('vendor/tinymce/tinymce');
            
            var uninterTinymce = require('libraries/uninter.tinymce');
            return uninterTinymce;
            
        },
        
        getUploadArquivo: function (objUpload) {
        
            //Função alterada para passar objeto como parametro, Faz a verificacao por tipo (objeto ou funcao) para continuar funcionando em locais antigos             
            if (typeof (objUpload) == "object") {
                var fnUpload = function (uploadManager) {
                    uploadManager(objUpload);
                    UNINTER.viewGenerica.setPlaceholderHeight();
                }
            }
            else var fnUpload = objUpload;

            var UploadManager = require(['libraries/uploadManager2'], fnUpload);
            return UploadManager;            
        },
        getLoadingItemView: function (uploadManager) {
            var loadingView = require('views/common/LoadingItemView');
            return loadingView;
        },

        
        getMathJax: function () {            
            var win = window;
            $.when(require('mathjax')).then(function () {                
                var MathJax = win.MathJax;
                MathJax.Hub.Config({
                    tex2jax: {
                        inlineMath: [['$$', '$$']],
                        displayMath: [['\[$', '$\]']]
                    }
                , showMathMenu: false
                , showMathMenuMSIE: false
                , showProcessingMessages: false
                , messageStyle: 'none'
                });
            }).then(function (e) {                
                var MathJax = win.MathJax;
                var args = new win.Array('Typeset', MathJax.Hub, document);

                MathJax.Hub.Queue(args);

            }).done(function () {                
                setTimeout(function () {                    
                    UNINTER.viewGenerica.setPlaceholderHeight()
                }, 1000);
            });
        },
        getInstanceCollection: function (contract) {
            var collection = new Collection();
            collection.contract = contract;
            return collection;
        },
        
        formRegrasValidacao: function () {
            var self = this;
            var forms = $(self.elemento + " form");

            forms.each(function (i, form) {

                $(form).validate({
                    wrapper: "span",
                    highlight: function (element, errorClass) {
                        var a = $('#' + element.id).closest('div.form-group');
                        $('#' + element.id).closest('div.form-group').removeClass('has-success').addClass('has-error');
                        self.setPlaceholderHeight();
                    },
                    errorPlacement: self.setErrorPlacement,
                    success: function (label) {
                        label.closest('div.form-group').removeClass('has-error').addClass('has-success');
                        label.closest('div.form-group').find('span.help-block').remove();
                        self.setPlaceholderHeight();
                    }
                });
            });

        },
        validarSelects: function (inicializar, elementoPesquisar) {

            var self = this;
        
            if (elementoPesquisar == void (0) || elementoPesquisar == '')
            {
                elementoPesquisar = self.elemento
            }

            var Combobox = self.getCombobox();
            
            var a = $(elementoPesquisar + " select");
            $.each($(elementoPesquisar + " select"), function (i, item) {
                try{
                    
                    var idObjComboPai = null;
                    if ($(this).data("idobjcombopai") !== void (0)) {
                        idObjComboPai = $(this).data("idobjcombopai");
                    }

                    var dataws = $(this).data("ws");
                    if (!dataws) {
                        $(this).select2();
                    } else {
                        var url = App.config.UrlWs($(this).data("ws")) + $(this).data("url");
                        var obj = "cbo" + $(this).attr("id");
                        
                        UNINTER[obj] = new Combobox();
                        UNINTER[obj].idObjCombo = $(this).attr("id");
                        UNINTER[obj].url = url;
                        UNINTER[obj].msgNaoEncontrado = $(this).data("msgnaoencontrado");
                        UNINTER[obj].valorOption = $(this).data("valoroption");
                        UNINTER[obj].textoOption = $(this).data("textooption");
                        UNINTER[obj].tituloOption = $(this).data("titulooption");
                        
                        UNINTER[obj].nomeObjRetorno = $(this).data("contract");
                        UNINTER[obj].textoInicial = $(this).data("textoinicial");
                        UNINTER[obj].popularAoIniciar = $(this).data("popularaoiniciar");
                        UNINTER[obj].exibirPrimeiraOpcao = $(this).data("exibirprimeiraopcao");
                        UNINTER[obj].autoComplete = $(this).data("autocomplete");
                        UNINTER[obj].change = $(this).data("change");
                        UNINTER[obj].successCallback = $(this).data("successcallback");
                        UNINTER[obj].idObjComboPai = idObjComboPai;
                        UNINTER[obj].erroObjPai = $(this).data("erroobjpai");
                        UNINTER[obj].classe = $(this).data("classe");
                        UNINTER[obj].formatResult = $(this).data("formataresultado");

                        try {
                            UNINTER[obj].initValorOption = $(this).data("initvaloroption");
                            UNINTER[obj].initTextoOption = $(this).data("inittextooption");
                            UNINTER[obj].initNomeObjRetorno = $(this).data("initcontract");
                        } catch (e) {

                        }
                        
                        if (inicializar && $(this).data("initurl")) {                            
                            try {
                                var initVal = self.objEdicao != null ? self.objEdicao.models[0].get($(this).data("initvalor")) : 0;
                                
                                if (initVal != void (0) && initVal != null) {
                                    console.warn('initval');
                                    var urlInicializar = App.config.UrlWs($(this).data("initws")) + $(this).data("initurl");
                                    urlInicializar = urlInicializar.replace("{valor}", initVal);
                                    UNINTER[obj].initUrl = urlInicializar;
                                }
                            } catch (e) {
                                console.warn(e);
                                console.warn("Não precisou carregar pela ViewGenerica. Automatizado pelo JS");
                            }                            
                            UNINTER[obj].inicializar = true;
                        }
                        

                        //objCombo.render();
                        
                        UNINTER[obj].render();
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
        },
        validarSelectId: function (id) {
            var inicializar = true;
            
            var self = this;
            var Combobox = self.getCombobox();
            var objDOMid = $("#"+id);

            var idObjComboPai = null;
            if ($(objDOMid).data("idobjcombopai") !== void (0)) {
                idObjComboPai = $(objDOMid).data("idobjcombopai");
            }

            var dataws = $(objDOMid).data("ws");
            if (!dataws) {
                $(objDOMid).select2();
            } else {
                var url = App.config.UrlWs($(objDOMid).data("ws")) + $(objDOMid).data("url");
                var obj = "cbo" + $(objDOMid).attr("id");

                UNINTER[obj] = new Combobox();
                UNINTER[obj].idObjCombo = $(objDOMid).attr("id");
                UNINTER[obj].url = url;
                UNINTER[obj].msgNaoEncontrado = $(objDOMid).data("msgnaoencontrado");
                UNINTER[obj].valorOption = $(objDOMid).data("valoroption");
                UNINTER[obj].textoOption = $(objDOMid).data("textooption");
                UNINTER[obj].tituloOption = $(objDOMid).data("titulooption");
                UNINTER[obj].nomeObjRetorno = $(objDOMid).data("contract");
                UNINTER[obj].textoInicial = $(objDOMid).data("textoinicial");
                UNINTER[obj].popularAoIniciar = $(objDOMid).data("popularaoiniciar");
                UNINTER[obj].exibirPrimeiraOpcao = $(objDOMid).data("exibirprimeiraopcao");
                UNINTER[obj].autoComplete = $(objDOMid).data("autocomplete");
                UNINTER[obj].change = $(objDOMid).data("change");
                UNINTER[obj].classe = $(objDOMid).data("classe");
                
                UNINTER[obj].successCallback = $(objDOMid).data("successcallback");
                UNINTER[obj].idObjComboPai = idObjComboPai;
                UNINTER[obj].erroObjPai = $(objDOMid).data("erroobjpai");

                try {
                    UNINTER[obj].initValorOption = $(objDOMid).data("initvaloroption");
                    UNINTER[obj].initTextoOption = $(objDOMid).data("inittextooption");
                    UNINTER[obj].initNomeObjRetorno = $(objDOMid).data("initcontract");
                } catch (e) {

                }

                if (inicializar && $(objDOMid).data("initurl")) {
                    try {
                        var urlInicializar = App.config.UrlWs($(objDOMid).data("initws")) + $(objDOMid).data("initurl");

                        if (self.objEdicao != void (0) && self.objEdicao.models != void(0))
                        {

                            var initVal = self.objEdicao.models[0].get($(objDOMid).data("initvalor"));
                            if (initVal != void (0) && initVal != null) {
                                urlInicializar = urlInicializar.replace("{valor}", initVal);
                                //UNINTER[obj].initUrl = urlInicializar;
                            }
                        }

                        UNINTER[obj].initUrl = urlInicializar;
                    } catch (e) {
                        console.warn(e);
                        console.warn("Não precisou carregar pela ViewGenerica. Automatizado pelo JS");
                    }
                    UNINTER[obj].inicializar = true;
                }
                UNINTER[obj].render();
            }

        },
        validarGrids: function (inicializar) {
            
            var Grid = require('libraries/uninter.grid');

            var self = this;
            
            var a = $(self.elemento + " div.grid");            
            $.each($(self.elemento + " div.grid"), function (i, item) {
                
            	var exibir = eval($(this).data("exibir"));
            	if( exibir == true){
	                var urlGET = App.config.UrlWs($(this).data("ws")) + $(this).data("urlget");
	                urlGET = urlGET .replace("{valor}", self.parametros.idUrl);
	                    
	                var retornoJSON = $(this).data("retornojson");                  
	                var colunas = eval($(this).data("colunas"));
	                
	                var funcaoPerderFoco = $(this).data("funcaoperderfoco");
	                var funcaoClickLinha = $(this).data("funcaoclicklinha");
	                
	                var funcaoErroAjax = $(this).data("funcaoerroajax");
	                var funcaoOnComplete = $(this).data("funcaocomplete");
	                var funcao = $(this).data("funcaoclicklinha");
	                var obj = "grid" + $(this).attr("id");                
	                UNINTER[obj] = new grid();
	                $(this).html(UNINTER[obj].criarGrid());
	                
	                UNINTER[obj].setFuncaoPerderFocoEntradaTexto(funcaoPerderFoco);
	                UNINTER[obj].setFuncaoClickLinha(funcaoClickLinha);
	                UNINTER[obj].setCabecalho(colunas);
	                	                
	                
	                if($(this).data("funcaosucessoajax") == "" || typeof($(this).data("funcaosucessoajax")) == "undefined"){	                	
	                	var funcaoAposCarregarAjax = UNINTER[obj].converterJSONtoArray;	                	
	                }else{
	                	
	                	var funcaoAposCarregarAjax = $(this).data("funcaosucessoajax"); //$(this).data("funcaosucessoajax");  
	                }
	                
	                
	                var arrayLinha = UNINTER[obj].enviarFormularioGrid("GET", urlGET, '', 'JSON',funcaoAposCarregarAjax ,funcaoErroAjax , retornoJSON);
	                UNINTER[obj].setCorpo(arrayLinha);
	                self.setPlaceholderHeight();
	                       
               }
            });
        },
        validarSelectListaPalavras: function (inicializar, elementoPesquisar) {

            var self = this;
        
            if (elementoPesquisar == void (0) || elementoPesquisar == '')
            {
                elementoPesquisar = self.elemento
            }

            var Combobox = self.getCombobox();
            
            var a = $(elementoPesquisar + " .select2ListaPalavra");
            $.each($(elementoPesquisar + " .select2ListaPalavra"), function (i, item) {
                
                try {
                    var tags = [];
                    var tokenSeparators = [";", ","];

                    var tagsStr = $(this).data('tags');
                    if (tagsStr) {
                        tags = tagsStr.split(",");
                    }
                    var tokenSeparatorsStr = $(this).data('tokenSeparators');
                    if (tokenSeparatorsStr) {
                        tokenSeparators = tokenSeparatorsStr.split(",");
                    }

                    jQuery(".select2ListaPalavra").select2({
                    tags: tags,
                    tokenSeparators: tokenSeparators,
                    formatNoMatches: ""
                }).on("select2-blur", function (e) {
                    //$(this).trigger("onblur");
                });
                    
                }
                catch (e) {
                    console.error(e);
                }
            });
        },
        circliful: function ($el, options) {
            var plugin = require('vendor/jquery-plugin-circliful-master/js/jquery.circliful');

            $el.circliful(options, options.callback);

        },
  
        criarTelaUpload: function(divUpload, fnEnvioFinalizado) {
            var self = this;
            var rotina = self.parametros.rotina;
            var FileTypes = 'gif, jpg, jpeg, png, doc, docx, zip, xls, xlsx, pdf, odt, html, txt'; //getUploadOptions
            var fileSize = null; //implementar File Size
            var MaxNumberOfFiles = 1;
            divUpload = divUpload + " #uploadArquivoViewGenerica";
            

            var fnPlaceHolder = function () {               
                self.setPlaceholderHeight();
            };


            var fnOnComplete = null;


            if (fnEnvioFinalizado != void (0) && fnEnvioFinalizado != null) {
                var fnOnComplete = function (links) {
                    fnEnvioFinalizado(links);
                };
            }


            require(['libraries/uploadManager2'], function (uploadManager) {
                uploadManager({
                    acceptFileTypes: FileTypes,
                    maxFileSize: fileSize,
                    element: divUpload,
                    maxNumberOfFiles: MaxNumberOfFiles,
                    onFileDone: fnPlaceHolder,
                    onStop: fnOnComplete
                });
            });
        },


        validarUpload: function(divUpload, fnEnvioFinalizado) {
        	var self = this;
        	divUpload = divUpload + " #uploadArquivoViewGenerica";
        	//var formatoPermitido = 'gif, jpg, jpeg, png, doc, docx, xls, xlsx, pdf, odt, html, txt';

        	var fnPlaceHolder = function () {        	    
        	    self.setPlaceholderHeight();
        	};
        	var fnOnComplete = null;
        	if (fnEnvioFinalizado != void (0) && fnEnvioFinalizado != null) {
        	    var fnOnComplete = function (links) {
        	        fnEnvioFinalizado(links);
        	    };
        	}
            
        	//if (extensoesPermitidas != void (0) && extensoesPermitidas != null) {
        	//    formatoPermitido = extensoesPermitidas;
        	    
        	//}
        	require(['libraries/uploadManager2'], function (uploadManager) {
        	    uploadManager({
        	        element: divUpload,
        	        onFileDone: fnPlaceHolder,
        	        onStop: fnOnComplete
        	    });       
        	    self.setPlaceholderHeight();
            });
        },

        validarForm: function (expressaoIdioma) {
            var self = this;
            
            //Remove a mensagem, caso tenha ficado da ação anterior
            $(self.elemento + " #mensagem").empty();

            //Permissoes
            var permissoes = self.parametros.areaPerms;

            //Limpa o form
            self.limparForm();

            //BreadCrumb
            self.atualizarBreadcrumb(true, expressaoIdioma);

            //Tentamos achar o metodo correto e executar a ação do form.
            if (self.parametros.metodo.toLowerCase() == "editar" && _.contains(permissoes, "editar")) {
                self.formEditar();
            } else if (self.parametros.metodo.toLowerCase() == "exibir" && _.contains(permissoes, "visualizar")) {
                self.formExibir();
            } else if (self.parametros.metodo.toLowerCase() == "excluir" && _.contains(permissoes, "remover")) {
                self.formExcluir();
            } else if (_.contains(permissoes, "cadastrar") ) {
                self.formNovo();
            } else {
                //Mensagem de não autorizado.
                var opcoes = {
                    body: "Desculpe. Você não possui permissão para acessar essa área.",
                    strong: "",
                    type: "danger",
                    appendTo: "#theForm"
                }
                $("#theForm").empty();
                App.flashMessage(opcoes);
            }

            //Botoes do form:
            self.formBotoes();

            //Insere os botoes de ajuda nos inputs:
            self.formHelper();

            //Registra as validações:
            self.formRegrasValidacao();
            
            //Atualiza os eventos.
            self.atualizarEventos();
        },

        //Ações disparadas por: data-action dentro do form:
        remover: function () {
            var self = this;
            //pega os parametros do form.
            var parametrosForm = self.getParametrosForm();

            //Opções da requisição AJAX
            var opcoes = {
                url: App.config.UrlWs(parametrosForm.ws) + parametrosForm.actionForm + "/" + self.parametros.idUrl,
                type: "DELETE"
            };

            //Executa o ajax.
            var result = App.Helpers.ajaxRequestError(opcoes);
            
            //Se o statu sé diferente de 200 deu erro na requisição.
            if (result.status !== 200) {
                //A resposta do servidor quando der erro, sempre deverá se um idioma ou mais. Nunca texto. Se vier texto, colocamos mensagem generica, pois foi um erro não tratado.
                var opcoes = {
                    body: "",
                    strong: "",
                    type: "danger",
                    appendTo: self.elemento + " #mensagem"
                }

                //Tentamos converter a string do retorno em array de idiomas.
                var arrayIdiomas = result.resposta.split(",");

                //Deu certo a conversão do array, e chegou inteiros?
                if (parseInt(arrayIdiomas[0]) > 0) {
                    $.each(arrayIdiomas, function (i, item) {
                        opcoes.body = opcoes.body + "\r\Erro: n" + item
                    });
                } else {
                    //Ocorreu algum erro não tratado.
                    opcoes.body = "Não foi possível concluir a ação com sucesso. Tente novamente, caso o erro persista contate o suporte."
                }

                //Removemos a mensagem, caso haja, e inserimos a nova.
                $(self.elemento + " #mensagem").empty();
                App.flashMessage(opcoes);
            } else {
                self.limparForm();
                //Deu certo, então vamos para listagem:
                //window.location = "#/" + self.parametros.sistema + "/" + self.parametros.rotina;
                var urlVoltar = "#/" + self.parametros.sistema + "/" + self.parametros.rotina;
                if (self.parametros.voltar) {
                    urlVoltar = self.parametros.voltar;
                }
                window.location = urlVoltar;
                //self.toggleVisibility();
            }
        },
        submit: function () {
            
            var self = this;

            //Por default mandamos o POST
            var metodo = "POST";

            //Pegamos o id do form:
            var idForm = $(self.elemento + ' #id').val();
            
            //Se tem id, então não é POST, é PUT
            if (parseInt(idForm) > 0) {
                metodo = "PUT";
            }

            //Recupera os atributos do form (data que estão definidos)
            var parametrosForm = self.getParametrosForm();
                        
            //Função do usuario de validação (Fora dos inputs)
            var fnValidar = '';
            var fnValido = true;
            if (App.Helpers.stringValida(parametrosForm.funcaoValidacao)) {
                try {
                    fnValidar = function () { return eval(parametrosForm.funcaoValidacao) };
                    fnValido = fnValidar();
                } catch (e) {
                    console.error("Função de validação não foi disparada corretamente: =>Exception:");
                    console.error(e);
                }
            }
            
            //Verifica se o form passa na validação dos inputs (jQuery.Validations):
            var form = $(self.elemento + ' form');
            var valido = form.valid();
            
            if (fnValido == true && valido == true) {
                //Opções para execução ajax
                var opcoes = {
                    url: App.config.UrlWs(parametrosForm.ws) + parametrosForm.actionForm,
                    type: metodo,
                    data: $(self.elemento + " form").serialize()
                };

                //Retorno da requsição AJAX
                var result = App.Helpers.ajaxRequestError(opcoes);
                
                //Não ocorreu tudo bem. Voltou status diferente de 200
                if (result.status !== 200) {
                    //A resposta do servidor quando der erro, sempre deverá se um idioma ou mais. Nunca texto.
                    //Se chegar texto, colocamos mensagem generica, pois foi um erro não tratado.
                    var opcoes = {
                        body: "",
                        strong: "",
                        type: "danger",
                        appendTo: self.elemento + " #mensagem"
                    }

                    //Convertemos a string de retorno em array de idiomas.
                    var arrayIdiomas = result.resposta.replace(/\[|\]|"| /g, '').split(',');

                    //Se o primeiro item for maior que zero, quer dizer tem idiomas mesmo:
                    if (parseInt(arrayIdiomas[0]) > 0) {
                        //Para cada idioma implementamos as mensagens na tela.
                        $.each(arrayIdiomas, function (i, item) {
                            opcoes.body = opcoes.body + "\r\nErro: " + item
                        });
                    } else {
                        //Aconteceu alguma coisa que não foi prevista.
                        opcoes.body = "Não foi possível concluir a ação com sucesso. Tente novamente, caso o erro persista contate o suporte."
                    }

                    //Limpamos o espaço da mensagem.
                    $(self.elemento + " #mensagem").empty();

                    //Adicionamos nova mensagem.
                    App.flashMessage(opcoes);
                } else {
                    self.successCallbackSubmit(result);
                }
            }
            
        },
        successCallbackSubmit: function(result){
            var self = this;
            var id = 0;
            try {
                id = parseInt(result.resposta.id);
            } catch (e) {
                //console.warn("Salvou objeto e não retornou id. Location para lista.");
            }
            //Se retornou id, então vamos para o editar com mensagem de registro salvo. Se retornou apenas 200, então volta para lista.
            if (id > 0 && self.parametros.metodo == "novo") {
                $(self.elemento + ' #id').val(id);

                if(typeof self.callback === 'function')
                {
                    try {
                        self.callback();
                    }
                    catch (e) { }
                }

                var location = "#/" + self.parametros.sistema + "/" + self.parametros.rotina + "/" + id + "/editar";
                if (App.Helpers.stringValida(self.parametros.idAcao))
                    location += "/" + self.parametros.idAcao;
                window.location = location;
            } else {                        
                //window.location = "#/" + self.parametros.sistema + "/" + self.parametros.rotina;
                self.toggleVisibilityVoltar();
            }
        },
        cancelar: function () {
			
            var self = this;            
            self.toggleVisibilityVoltar();

            //var urlAtual = "#"+App.mainRouter._current().fragment;
            //var url = "#/" + self.parametros.sistema + "/" + self.parametros.rotina;

            //if (self.parametros.voltar) {
            //    url = self.parametros.voltar;   
            //}

            //if (urlAtual.toLowerCase() == url.toLowerCase()) {
            //    self.toggleVisibilityVoltar();
            //} else {
            //    window.location = url;
            //}
            
        },
        selecionar: function () {
            var self = this;
            try {
                
                self.cancelar();
            } catch (e) {
                console.error("Erro ao chamar funcão callback => exception: ");
                console.error(e);
            }
        },
        novaView: function (parametros, callback) {
            try{
                var self = this;
                parametros.rotina = parametros.rotina.toLowerCase();
                

                if (UNINTER.viewGenerica.parametros.View) {
                    self.viewGeradas[parametros.rotina] = new UNINTER.viewGenerica.parametros.View(parametros);
                    self.viewGeradas[parametros.rotina].callback = callback;
                } else {
                    self.viewGeradas[parametros.rotina] = new self.parametros.View(parametros);
                }
                //self.viewGeradas[parametros.rotina] = new UNINTER.viewGenerica.parametros.view(parametros);
                self.viewGeradas[parametros.rotina].onShow();
                                
            }
            catch (e) {
                console.warn(e);
            }
        },
        atualizarBreadcrumb: function (exibirMetodo, expressaoIdioma) {
            var self = this;
            
            var options = {
                breadcrumbItems: [{ text: self.breadcrumb, expressaoIdioma: expressaoIdioma }],
                rotina: self.parametros.rotina,
                idUrl: self.parametros.idUrl
            };

            if (exibirMetodo == true) {
                options.breadcrumbItems.push({ text: self.parametros.metodo });
            }
            
            self.trigger('renderbreadcrumb', options);
            //self.trigger('updatebreadcrumb', self.parametros.metodo);
        },

        //Ações internas
        atualizarEventos: function () {
            var self = this;

            //Não permitimos o submit dos forms.
            $("form").submit(function (evento){
                evento.preventDefault();
                return false;
            });

            //Removemos os eventos que já estão registrados.
            $(self.elemento + "#botoes [type='submit']," + self.elemento + " #botoes [type='button']").unbind("click");
            
            //Vamos capturar os eventos definidos e colocar os disparadores:
            $(self.elemento + " :input, " + self.elemento + " a").each(function (i, item) {
                var possuiEvento = $(item).data('action');
                
                if (possuiEvento !== void (0)) {
                    
                    
                        $(item).on("click", function () {
                            try {
                                var evento = $(this).data('action');
                                evento = "self." + evento + "();"
                                eval(evento);
                            } catch (e) {
                                console.warn("Erro ao tentar executar evento: " + evento);
                            }
                        });
                    }
            });            
        },
        novaJanela: function (url, callback, ocultarSelecionar, construtor) {            
            var self = this;            
            
            var parametrosURL = url.split("/");
            var urlAtual = App.mainRouter._current();
            
            
            var parametros = {
                voltar: "#/" + urlAtual.fragment,
                elementoVoltar: "#" + $(".block-item.active").attr("id"),
                sistema: undefined,
                rotina: undefined,
                metodo: undefined,
                idUrl: undefined,
                idAux: undefined,
                ocultarSelecionar: (ocultarSelecionar == void (0)) ? false : ocultarSelecionar
            };
            
            if (parametrosURL[0] !== void (0)) {
                parametros.sistema = parametrosURL[0];
            }
            if (parametrosURL[1] !== void (0)) {
                parametros.rotina = parametrosURL[1];
            }
            if (parametrosURL[2] !== void (0)) {
                parametros.idUrl = parametrosURL[2];
            }
            if (parametrosURL[3] !== void (0)) {
                parametros.metodo = parametrosURL[3];
            }
            if (parametrosURL[4] !== void (0)) {
                parametros.idAcao = parametrosURL[4];
            }
            if (parametrosURL[5] !== void (0)) {
                parametros.idAux = parametrosURL[5];
            }
			
            if (construtor !== 'undefined') {
                parametros.construtor = construtor;
            }
			
            var divNovaJanela = "novajanela_" + parametros.rotina.toLowerCase() + (parametros.metodo ? parametros.metodo.toLowerCase().replace (/^/,'_') : "");
			
            if ($("#details .details#" + divNovaJanela).length == 0) {                
                $("#details").append($("<div>").attr('id', divNovaJanela).addClass("details block-item right"));
            }

			parametros.elemento =  "#details .details#" + divNovaJanela;
			
            self.novaView(parametros, callback);
            
            return true;
        },
        renderizarFormulario: function () {
            
            var self = this;

            var permissao = self.parametros.areaPerms;
            
            if (permissao == void (0)) {
                //Mensagem de não autorizado.
                var opcoes = {
                    body: "Desculpe. Você não possui permissão para acessar essa área.",
                    strong: "",
                    type: "danger",
                    appendTo: "#theForm "+self.elemento
                }
                $("#theForm "+self.elemento + " form").empty();
                App.flashMessage(opcoes);
            } else {
                //Load do html sob demanda.
                var viewLoader = new App.LazyLoader('text!' + this.caminhoJs);

                //Ao carregar...
                $.when(
                    viewLoader.get(this.parametros.rotina + ".html")
                ).done(function (html) {
                    var item = "#theForm";

                    //Guardamos o html:
                    self.htmlForm = html;
                    
                    //Renderizar em outro elemento ou 
                    if (self.parametros.renderizarNovoContexto) {
                        //Limpa o form
                        $('#theForm').empty();

                        //Insere o novo
                        $('#theForm').append(html);
                    } else {
                        
                        item = $(self.elemento);
                        //Limpa o form
                        $(self.elemento).empty();

                        //Insere o novo
                        $(self.elemento).append(html);
                    }

                    //Verificamos se precisamos trocar a ação do action:
                    if (self.parametros.voltar) {
                        $(self.elemento).find(".goBack").parent().attr("href", self.parametros.voltar);
                    }
                    
                    //Após inserir o form na tela, tentamos carregar os JS necessarios:
                    var parametrosForm = self.getParametrosForm();

                    //Verificamos se precisa carregar algum Javascript:
                    var urlArray = []
                    
                    if (parametrosForm.vendor !== null && parametrosForm.vendor.length > 0) {
                        $.each(parametrosForm.vendor, function (i, item) {
                            if (App.Helpers.stringValida(item)) {
                                urlArray.push("vendor/" + item);
                            }
                        });
                    }

                    if (parametrosForm.plugins !== null && parametrosForm.plugins.length > 0) {
                        $.each(parametrosForm.plugins, function (i, item) {
                            if (App.Helpers.stringValida(item)) {
                                urlArray.push("js/libraries/" + item);
                            }
                        });
                    }

                    if (parametrosForm.arrayJs !== null && parametrosForm.arrayJs.length > 0) {
                        $.each(parametrosForm.arrayJs, function (i, item) {
                            if (App.Helpers.stringValida(item)) {
                                urlArray.push("js/"+self.caminhoJs + item);
                            }
                            
                        });
                    }

                    // Verificamos se devemos renderizar a opção para simular
                    self.simularCheck();

                    require(urlArray, function () {
                        //Funcao que vai carregar os atributos, bloquear ou não os inputs....
                        self.validarForm(parametrosForm.expressaoIdioma);
                    });

                    //Exibe o form;
                    self.toggleVisibilityItem(item);
                });
            }
        },
        renderizarLista: function () {

            var self = this;
            var permissao = self.parametros.areaPerms;

            if (permissao == void (0)) {
                //Mensagem de não autorizado.
                var opcoes = {
                    body: "Desculpe. Você não possui permissão para acessar essa área.",
                    strong: "",
                    type: "danger",
                    appendTo: "#theList " + self.elemento
                }
                $("#theList " + self.elemento).empty();
                App.flashMessage(opcoes);
            } else {
                var item = "#theList";

                //Load do html sob demanda.
                var viewLoader = new App.LazyLoader('text!' + this.caminhoJs);

                //Ao carregar...
                $.when(
                    viewLoader.get(this.parametros.rotina + "Lista.html")
                ).done(function (html) {

                    //Guardamos o html:
                    self.htmlForm = html;

                    //Renderizar em outro elemento ou 
                    if (self.parametros.renderizarNovoContexto) {
                        //Limpa o form
                        $('#theList').empty();

                        //Insere o novo
                        $('#theList').append(html);
                    } else {

                        item = $(self.elemento);
                        //Limpa o form
                        $(self.elemento).empty();

                        //Insere o novo
                        $(self.elemento).append(html);
                    }


                    //Verificamos se precisamos trocar a ação do action:
                    if (self.parametros.voltar) {
                        $(self.elemento).find(".goBack").parent().attr("href", self.parametros.voltar);
                    }

                    ////Limpa a lista
                    //$(self.elemento).empty();

                    ////Insere o novo HTML
                    //$(self.elemento).append(html);

                    //Após inserir o form na tela, tentamos carregar os JS necessarios:
                    var parametrosLista = self.getParametrosLista();

                    //Verificamos se precisa carregar algum Javascript:
                    var urlArray = []

                    if (parametrosLista.vendor !== null && parametrosLista.vendor.length > 0) {
                        $.each(parametrosLista.vendor, function (i, item) {
                            if (App.Helpers.stringValida(item)) {
                                urlArray.push("js/vendor/" + item);
                            }
                        });
                    }
                    
                    if (parametrosLista.plugins !== null && parametrosLista.plugins.length > 0) {
                        $.each(parametrosLista.plugins, function (i, item) {
                            if (App.Helpers.stringValida(item)) {
                                //urlArray.push("libraries/" + item);
                                urlArray.push("js/libraries/" + item);
                            }
                        });
                    }
                    
                    if (parametrosLista.arrayJs !== null && parametrosLista.arrayJs.length > 0) {
                        $.each(parametrosLista.arrayJs, function (i, item) {
                            if (App.Helpers.stringValida(item)) {
                                urlArray.push(self.caminhoJs + item);
                            }
                        });
                    }

                    // Verificamos se devemos renderizar a opção para simular
                    self.simularCheck();

                    require(urlArray, function (itemJs) {
                        self.atualizarBreadcrumb(false, parametrosLista.expressaoIdioma);
                        self.validarGrids();
                        self.inicializar();

                        //Atualiza os eventos.
                        self.atualizarEventos();
                    });

                    //Exibe a lista
                    self.toggleVisibilityItem(item);
                });
            }


            // Mostra a Grid
            //$('#theList').empty();
            //$('#theList').append("<div id='grid"+self.parametros.rotina+"'>Aqui vai a lista</div>");
            //$("#grid"+self.parametros.rotina).append("</br><a id='goaaa' href='#/pap/solicitacaoAssunto/1062/exibir'>Exibir: 1062</a>");
            //$("#grid" + self.parametros.rotina).append("</br><a id='goaaa' href='#/pap/solicitacaoAssunto/1062/editar'>Editar: 1062</a>");
            //$("#grid" + self.parametros.rotina).append("</br><a id='goaaa' href='#/pap/solicitacaoAssunto/1063/exibir'>Exibir: 1063</a>");
            //$("#grid" + self.parametros.rotina).append("</br><a id='goaaa' href='#/pap/solicitacaoAssunto/1063/editar'>Editar: 1063</a>");
            //$("#grid" + self.parametros.rotina).append("</br><a id='goaaa' href='#/pap/solicitacaoAssunto/0/novo'>Novo</a>");

            self.setPlaceholderHeight();
            self.toggleVisibilityItem("#theList");
            // Esconde o Loading
            App.loadingView.hide();

        },
        continuar: function () {            
            //inializamos a instancia.       
            
            var self = this;
            //Chegou metodo, então é form e não grid.
            if (App.Helpers.stringValida(self.parametros.metodo)) {

                //Form já existe na tela?
                var form = $(self.elemento).html();

                if (form !== void (0)) {
                    self.validarForm();
                    //Exibe o form;
                    if (self.parametros.renderizarNovoContexto) {
                        self.toggleVisibilityItem("#theForm");
                    } else {
                        self.toggleVisibilityItem(self.elemento);
                    }
                    
                } else {
                    self.renderizarFormulario();
                }

            } else {
                //Exibe a lista.
                self.renderizarLista();
            }

        },
        onShow: function () {

            this.validacoesPersonalizadas();

            var self = this;

            var item = "#theForm";
            
            if (App.Helpers.stringValida(self.parametros.metodo)) {
                self.renderizarFormulario();
            } else {
                self.renderizarLista();
                item = "#theList";
            }
            if (self.parametros.renderizarNovoContexto == void(0)) {
                item = self.parametros.elemento;
            }
            self.toggleVisibilityItem(item);
            $('#breadcrumb').show(); // Temporario
            
        },
        isSimulado: function () {
            if (UNINTER.StorageWrap.getItem('simular') == null) {
                return false;
            } else {
                if (UNINTER.StorageWrap.getItem('simular').idUsuario == UNINTER.StorageWrap.getItem('user').idUsuario) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        simularGetUser: function () {

            var self = this;

            var elementName = '#view';

            if (App.Helpers.stringValida(self.parametros.metodo) == false) {
                elementName += self.parametros.rotina + "lista";
            } else {
                elementName += self.parametros.rotina;
            }

            // Caso a <div data-simular='true'></div> esteja preenchida.
            if ($(elementName + " div[data-simular='true']").html().length > 0) {

                if (UNINTER.StorageWrap.getItem('simular') == null) {
                    return UNINTER.StorageWrap.getItem('user');
                } else {
                    return UNINTER.StorageWrap.getItem('simular');
                }
            } else {
                return UNINTER.StorageWrap.getItem('user');
            }
        },
        simularCheck: function () {

            var self = this;

            var elementName = '#view';

            if (App.Helpers.stringValida(self.parametros.metodo) == false) {
                elementName += self.parametros.rotina + "lista";
            } else {
                elementName += self.parametros.rotina;
            }

            // Caso exista a <div data-simular='true'></div>
            if ($(elementName + " div[data-simular='true']").length > 0) {
                //
                this.rotinaAcao = App.Helpers.Auth.getAreaPermsMetodo(self.parametros.rotina + 'simular');

                // verifica se o usuário possui a permissão específica conforme o retorno.
                if (App.Helpers.Auth.viewCheckPerms('visualizar', this.rotinaAcao)) {
                    self.simularGetUser();
                    self.simularRender();
                }
            }
        },
        simularRender: function () {

            var self = this;

            var elementName = '#view';

            if (App.Helpers.stringValida(self.parametros.metodo) == false) {
                elementName += self.parametros.rotina + "lista";
            } else {
                elementName += self.parametros.rotina;
            }

            //
            $(elementName + " div[data-simular='true']").html(templateSimular);

            if (UNINTER.StorageWrap.getItem('simular') != null) {
                // Caso exista aluno sendo simulado, expandimos.
                $("#accordionSimular .un-accordion-item").first().addClass("un-accordion-item sv-item active");

                $(elementName + " #txt_simular_ru").attr("placeholder", UNINTER.StorageWrap.getItem('simular').RU + " - " + UNINTER.StorageWrap.getItem('simular').nome);
            }

            // Inicializamos o componente Accordion
            self.iniciarAccordion({
                'element': '#accordionSimular', 'closeInactive': true, 'onToggle': function () {
                    // Chamamos a função para ajustar o tamanho da tela.
                    setTimeout(function () {
                        self.setPlaceholderHeight();
                    }, 300);
                }
            });

            $(elementName).on("click", "#btn_simular_buscar", function () {
                var ru = undefined;

                if ($(elementName + " #txt_simular_ru").val() != '') {
                    ru = $(elementName + " #txt_simular_ru").val();
                } else {
                    var _placeholder = $(elementName + " #txt_simular_ru").attr('placeholder');
                    ru = _placeholder.substr(0, _placeholder.lastIndexOf("-"));
                }

                var opcoes = {
                    url: App.config.UrlWs('autenticacao') + "Usuario/" + ru.trim() + "/GetUsuarioByRU",
                    type: 'GET',
                    data: null,
                    async: false
                }
                var retorno = UNINTER.Helpers.ajaxRequestError(opcoes);
                if (retorno.status == 200) {

                    //UNINTER.StorageWrap.setItem('simular', {
                    //    'idUsuario': retorno.resposta.usuario.idUsuario,
                    //    'RU': retorno.resposta.usuario.RU,
                    //    'nome': retorno.resposta.usuario.nome,
                    //    'email': retorno.resposta.usuario.email
                    //});

                    UNINTER.StorageWrap.setItem('simular', retorno.resposta.usuario);

                    // Recarregamos a view
                    self.continuar();
                } else if (retorno.status == 405) {
                    $(elementName + " #txt_simular_msg").text("Você não possui permissão para simular o usuário informado.");
                } else {
                    $(elementName + " #txt_simular_msg").text(jQuery.parseJSON(retorno.resposta).mensagem);
                }
            })

            $(elementName).on("click", "#btn_simular_limpar", function () {
                UNINTER.StorageWrap.removeItem('simular');
                self.continuar();
            })
        },
        validacoesPersonalizadas: function () {
            //CPF
            jQuery.validator.addMethod("cpf", function (value, element) {

                value = jQuery.trim(value);

                value = value.replace('.', '');
                value = value.replace('.', '');
                var cpf = value.replace('-', '');
                while (cpf.length < 11) cpf = "0" + cpf;

                // this is mostly not needed
                var invalidos = [
                     '11111111111',
                     '22222222222',
                     '33333333333',
                     '44444444444',
                     '55555555555',
                     '66666666666',
                     '77777777777',
                     '88888888888',
                     '99999999999',
                     '00000000000'
                ];
                for (var i = 0; i < invalidos.length; i++) {
                    if (invalidos[i] == value) {
                        return false;
                    }
                }

                var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
                var a = [];
                var b = new Number;
                var c = 11;
                var x = null;
                for (var i = 0; i < 11; i++) {
                    a[i] = cpf.charAt(i);
                    if (i < 9) b += (a[i] * --c);
                }
                if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
                b = 0;
                c = 11;
                for (var y = 0; y < 10; y++) b += (a[y] * c--);
                if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }

                var retorno = true;
                if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) retorno = false;

                return this.optional(element) || retorno;

            }, "Informe um CPF válido")
        },
    });
});