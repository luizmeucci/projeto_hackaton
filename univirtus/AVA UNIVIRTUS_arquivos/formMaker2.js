
// ------ Validação utilizando atributo data no input; -----

//data-rule-required  =>  Elemento requerido
//    data-msg-required

//data-rule-remote    => Validação remota. Não implementada neste projeto.
//    data-msg-remote

//data-rule-maxlength => Makes the element require a given maxmimum length.
//    data-msg-maxlength

//data-rule-rangelength – Makes the element require a given value range.
//    data-msg-rangelength

//data-rule-min – Makes the element require a given minimum.
//    data-msg-min

//data-rule-max – Makes the element require a given maximum.
//    data-msg-max

//data-rule-range – Makes the element require a given value range.
//    data-msg-range

//data-rule-email – Makes the element require a valid email
//    data-msg-email

//data-rule-url – Makes the element require a valid url
//    data-msg-url

//data-rule-date – Makes the element require a date.
//    data-msg-date

//data-rule-dateISO – Makes the element require an ISO date.
//    data-msg-dateISO

//data-rule-number – Makes the element require a decimal number.
//    data-msg-number

//data-rule-digits – Makes the element require digits only.
//    data-msg-digits

//data-rule-creditcard – Makes the element require a credit card number.
//    data-msg-creditcard

//data-rule-equalTo – Requires the element to be the same as another one
//    data-msg-equalTo

/* ========================================================================================================
   Form Maker
   Parametros de entrada podem ser conferidos nestes objetos: defaultForm, defaultItem, defaultButton
   ======================================================================================================== */

define([
	'app',
	'jquery',
	'underscore',
	'backbone',
	'jquery-validation',
    'backbone-upload-manager',
    'jquery-iframe-transport',
    'jquery-fileupload'
], function (App, $, _, Backbone, Validate) {

    var Form = function (options) {

        //options deve chegar nesse formato.
        var defaultForm = {
            nome: "encaminhar",
            id: "form-encaminhar",
            classe: "form-horizontal",
            buttonsContainerClass: "col-sm-10",
            grupo: [defaultGrupo],  //Array de objetos com o formato de "defaultGrupo"
            botoes: [defaultButton] //Array de objetos com o formato de "defaultButton"
        }

        //Objeto de exemplo para parametros do form.
        var defaultGrupo = {
            exibirComoPanel: false, //Se true aplica as classes de PANEL do Bootstrap, se não, utiliza <fieldset>
            titulo: null,     //Se name for null, não exibe
            itens: [defaultItem] //Array de objetos com o formato de "defaultItem"
        };

        //Obj de exemplo para usar nos parametros de entrada.
        var defaultItem = {
            labelSize: "col-sm-2",
            tipo: "text",
            classe: null,
            inputName: "name",
            value: null,  ///Quando o tipo de objeto for select ou radio e precisem ser populados por aqui, enviar uma lista de objetos defaultItem.
            size: null,
            id: 'id',
            placeholder: null,
            checked: 'checked', //Valido apenas para Select/Chekbox/Radio
            validacao:[{
                regra: "",
                valor: "",
                msg: "",
                maxLength: ""
            }]
        };

        //Obj de exemplo para usar nos parametros de entrada.
        var defaultButton = {
            text: "Enviar",
            tipo: "submit",
            classe: "btn btn-primary"
        };

        //Variaveis para usar no decorrer da View.
        var options = options || {},
	        FormItemView,
	        FormView,
            FormGroupView,
	        FormControlsView,
	        FormModel,
	        FormCollection,
	        UploadPanelView;

        //Metodo que irá criar o input de um item. Será chamado no each
        var templates = {
            formItem: [
    			"<% if ( typeof label !== 'undefined' ) { %>",
	    		    "<label for='<%= inputName %>' class=\" <%= (typeof labelSize !== 'undefined') ? labelSize : 'col-sm-2' %> control-label\"><%= label %> </label>",
				"<% } %>",

				"<% if ( typeof size  !== \"undefined\") { %> ",
					"<div class=\"<%= typeof size !== \"undefined\" ? size : \"col-sm-10\" %>\">",
				"<% } %>",

				    "<% if ( tipo === \"textarea\" ) { %>",
				    	"<textarea <%= typeof rows !== \"undefined\" ? \" rows='\"+rows+\"' \" : \"\" %> <%= typeof placeholder !== \"undefined\" ? \" placeholder='\"+placeholder+\"' \" : \"\" %> class=\"<%= classe %>\" id=\"<%= typeof id !== 'undefined' ? id : inputName %>\" name=\"<%= inputName %>\"><%= typeof value !== 'undefined' ? value : '' %></textarea>",

				    "<% } else if ( tipo === \"hidden\" ){ %>",
				    	"<input type=\"hidden\" id=\"<%= id %>\" name=\"<%= inputName %>\" value=\"<%= typeof value !== \"undefined\" ? value : \"\" %>\">",

				    "<% } else if ( tipo === \"file\" ) { %>",
                        "<input type=\"hidden\" value=\"\"\" name=\"arquivosTemporarios\">",
				    	"<div id=\"uploadArea\"></div>",

                    "<% } else if ( tipo === \"select\" ) { %>",
                        "<select id=\"<%= inputName %>\" name=\"<%= inputName %>\" \"  class=\"<%= classe %>\" >",
                            "<option value=\"\"><%= placeholder %></option>",
                            "<% _.each(value, function(item){ %>",
                                "<option value=\"<%= item.value %>\"><%= item.inputName %></option>",
	    	                "<% }) %>",
                        "</select>",

                    "<% } else if ( tipo === \"radio\" ) { %>",
                                "<div class='radio'>",
                                  "<label>",
                                    "<input type='radio' name='<%= inputName %>'  <%= typeof id !== \"undefined\" ? \"id=\" + id : \"\"  %> value=\"<%= value %>\" <%= typeof checked !== \"undefined\" ? \" '\"+ checked +\"'\" : \"\" %> /> <%= placeholder %> ",
                                  "</label>",
                                "</div>",
				    "<% } else if ( tipo === \"checkbox\" ) { %>",
                                "<div class='checkbox'>",
                                  "<label>",
                                    "<input type='checkbox' name='<%= inputName %>' <%= typeof id !== \"undefined\" ? \"id=\" + id : \"\"  %> value=\"<%= value %>\" <%= typeof checked !== \"undefined\" ? \" '\"+ checked +\"'\" : \"\" %> /> <%= placeholder %> ",
                                  "</label>",
                                "</div>",
                    "<% } else { %>",
				    	"<input <%= typeof placeholder !== \"undefined\" ? \" placeholder='\"+placeholder+\"' \" : \"\" %> type=\"<%= tipo %>\"<%= typeof mask !== \"undefined\" ? \" data-mask='\"+ mask +\"'\" : \"\" %>  class=\"<%= classe %>\" id=\"<%= inputName %>\" value=\"<%= typeof value !== \"undefined\" ? value : \"\" %>\"  name=\"<%= inputName %>\">",
				    "<% } %>"
            ],
            buttonPlaceholder: "<button <%= typeof id !== \"undefined\" ? \"id=\" + id : \"\"  %> type=\"<%= tipo %>\" class=\"<%= classe %>\"><%= text %></button>",
            fieldset: "<fieldset><%= legend %> <%= corpoItens %> </fieldset>",
            legend: "<legend><%= titulo %></legend>",
            panelHeading: "<div class=\"panel-heading\"><h3 class=\"panel-title\"> <%= titulo %> </h3></div>",
            panelGroup: ["<div class=\"panel panel-default\">",
                            "<%= legend %>",
                            "<div class=\"panel-body\">",
                                "<div class=\"row\">",
                                    "<div class=\"col-md-12\">",
                                        "<%= corpoItens %>",
                                    "</div>",
                                "</div>",
                            "</div>",
                        "</div>"
            ]
        };


        var validacaoItem = function (objDom, item) {
           
            var teste = item.validacao;
            if( typeof teste !== 'undefined'){
                $.each(teste, function (index, value) {
                    $(objDom).find("[name=" + item.inputName + "]").attr("data-rule-" + value.regra, value.valor);
                    if (value.msg != 'undefined' && value.msg != null) {
                        $(objDom).find("[name=" + item.inputName + "]").attr("data-msg-" + value.regra, value.msg);
                    }
                });
            }
            return objDom;
        };

        var textareaLimit = function (options) {
        /**
         *  @param string textareaId - O id do elemento
         *  @param int charLimit - O limite do de caracteres para o elemento em questão
         *  @param string remainingText - String de texto que sinaliza a quantidade de caracteres que o usuário ainda pode digitar
         *  @param string exceededText - String de texto que sinaliza a quantidade de caracteres que está além do número permitido de caracteres
         *  @param boolean stopAtLimit - Parar a contagem ao atingir o limite? Se verdadeiro, suspende a contagem para ao atingir "0". Se falso, haverá um incremento na contagem referente a quantidade de caracteres excedidos.
         *  @param boolean domObject - O objeto DOM o qual será atribuído os eventos de contagem.   
         */
            var defaults = {
                textareaId: null,
                charLimit: 30,
                remainingText: 'Faltam',
                exceededText: 'Limite ultrapassado em',
                stopAtLimit: false,
                domObject: null
            };
            var opts = _.defaults(options, defaults);
            var props = {
                textareaId: opts.textareaId, 
                remainingText: opts.remainingText, 
                exceededText: opts.exceededText, 
                charLimit: opts.charLimit
            };
            
            if ( !opts.textareaId && !opts.domObject ) { throw new Error('Parâmetro textareaId ou domObject não informado.'); }

            var textareaObject = opts.domObject || $(opts.textareaId);
            var parentHolder = textareaObject.parent();
            var remainingCharsHolder = _.template('<div class="ta-remainingCharsHolder"><span class="ta-remaining" ><%= remainingText %> </span> <span class="ta-exceeded"><%= exceededText %></span> <span class="ta-charLimit"><%= charLimit %></span> caracteres</div>');
            
            var updateChars = function (event, el) {
                var actualChars = $(el).val().length;
                var n = ((opts.charLimit - actualChars) >= 0) ? opts.charLimit - actualChars : (opts.charLimit - actualChars) * (-1);

                if ( actualChars > opts.charLimit ) {
                    
                   if ( opts.stopAtLimit ) { 
                       event.preventDefault(); 
                   } else {
                       parentHolder.find('.ta-remainingCharsHolder').addClass('error');
                       parentHolder.find('.ta-remainingCharsHolder .ta-charLimit').text(n);
                       parentHolder.find('.ta-remaining').hide();
                       parentHolder.find('.ta-exceeded').show();
                   }
                } else {
                    parentHolder.find('.ta-remainingCharsHolder').removeClass('error'); 
                    parentHolder.find('.ta-charLimit').text(n);
                    parentHolder.find('.ta-remaining').show();
                    parentHolder.find('.ta-exceeded').hide();
                }
            };
            textareaObject.after(remainingCharsHolder(props));
            textareaObject.on('keypress change input', function (e) {
                updateChars(e, this);
            });
        };

        var textareaLimitItems = [];

        // Upload Manager
        var uploadManagerConfig = function (view) {
            // Cria o UploadManager
            Backbone.TemplateManager.baseUrl = 'templates/common/uploadmanager/{name}';
            var uploadManager = new Backbone.UploadManager({
                'baseUploadUrl': App.config.baseUrl() + 'repositorio/',
                'uploadUrl': 'sistemaRepositorioPublico/0/upload',
                'templates': {
                    'main': 'upload-manager-main.html',
                    'file': 'upload-manager-file.html'
                },
                'autoUpload': true,
                'maxFileSize': 5000000,
                'messages': {
                    'maxNumberOfFiles': 'Excedeu limite de arquivos.',
                    'acceptFileTypes': 'Envie arquivos somente nos formatos: gif | jpg | jpeg | png | doc | docx | xls | xlsx | pdf | odt | html | txt',
                    'maxFileSize': 'Arquivo muito grande.',
                    'minFileSize': 'Arquivo muito pequeno.'
                },

                'acceptFileTypes': /(\.|\/)(gif|jpg|jpeg|png|doc|docx|xls|xlsx|pdf|odt|html|txt)$/i
            });

            // Render it
            uploadManager.renderTo( view.$el.find("#uploadArea"));
            uploadManager.on('render:done', function () {
//                Event.trigger('uploadmanager:rendered');
            });

            // Links
            var links = [];
            var c = 0;
            uploadManager.on('filedone', function (model, data) {
                c++;
                var attrs = model.toJSON();
                var link = $("<a>", { href: App.config.baseUrl() + 'repositorio/publico/' + data.result.repositorio + "/" + attrs.data.name, target: '_blank' }).html(attrs.data.name)[0];
                links.push({ "tag": link, "filename": attrs.data.name, "repositoryName": data.result.repositorio + "/" + attrs.data.name, "folder": data.result.repositorio, id:"file"+c });

                if (c === model.collection.length) {
                    
                }
                view.trigger("uploadmanager:filedone", links);
                //Event.trigger('uploadmanager:rendered');
            });
			
            view.bind("uploadmanager:filedone", function (links) {
				$("#uploadArea input[name^=arquivosTemporarios]").remove();
                //var folders = [];
                _.each(links, function (link) {
                    $("#upload-manager-file-list tbody tr.upload-manager-file").each(function () {
                        if ($(this).find("span.name").text() === link.filename) {
                            $(this).find("span.name").html(link.tag);
                            $(this).find('td.last span').data("repositoryName", link.repositoryName).data("id", link.id);
                        }
                    });

                    var arquivosTemporariosInput = '<input type="hidden" value="' + link.folder + '" name="arquivosTemporarios">';

					view.$el.find("#uploadArea").append(arquivosTemporariosInput);
                });

                $("#upload-manager-file-list tbody tr.upload-manager-file td.last > span").unbind();
                // $("#upload-manager-file-list tbody tr.upload-manager-file td.last > span").each(function () {
                    $('#upload-manager-file-list tbody tr.upload-manager-file td.last > span').bind("click", function () {
                        var cid = $(this).parent().parent().prop("id");
                        var repositoryName = $(this).data("repositoryName");
                        var model = uploadManager.files._byId[cid];
                        $.post(App.config.baseUrl() + "repositorio/sistemaRepositorioPublico/0/delete", {
                            diretorioArquivo: repositoryName
                        }, function (data) {
                            try{
                                model.destroy();
                            }catch(e){
                                console.log("não encontrado model para remover");
                            }
                            view.trigger('uploadmanager:filedeleted');
                        }).fail(function (r) { console.log(r); });
                    });
                // });

                // Remove arquivos
                // Remove o evento, se existir
               /* $("td.last span").unbind("click");
                $("td.last span").bind("click", function () {
                    $("#upload-manager-file-list tbody tr.upload-manager-file.active").each(function () {
                        var cid = $(this).prop("id");
                        var repositoryName = $(this).data("repositoryName");
                        var model = uploadManager.files._byId[cid];

                        $.post(App.config.baseUrl() + "repositorio/sistemaRepositorioPublico/0/delete", {
                            diretorioArquivo: repositoryName
                        }, function (data) {
                            model.destroy();
                        }).fail(function (r) { console.log(r); });
                    });

                });*/
            });
        };

        UploadPanelView = Backbone.View.extend({
            id: "manager-area",
            render: function () {
                return this;
            }
        });

        // Representa um único ítem do form.
        FormItemView = Backbone.View.extend({
            className: "form-group",
            template: _.template(templates.formItem.join('')),
            render: function () {
                this.$el.append(this.template(this.model));
                return this;
            }
        });

        // Representa um único ítem do form.
        FormGroupPanelView = Backbone.View.extend({
            template: _.template(templates.panelGroup.join('')),
            render: function () {
                this.$el.append(this.template(this.model));
                return this;
            }
        });

        // Representa um único ítem do form.
        FormGroupFieldView = Backbone.View.extend({
            template: _.template(templates.fieldset),
            render: function () {
                this.$el.append(this.template(this.model));
                return this;
            }
        });

        // Representa um único ítem do form.
        FormLegendFieldView = Backbone.View.extend({
            template: _.template(templates.legend),
            render: function () {
                this.$el.append(this.template(this.model));
                return this;
            }
        });

        // Representa um único ítem do form.
        FormPanelHeadingFieldView = Backbone.View.extend({
            template: _.template(templates.panelHeading),
            render: function () {
                if (this.model != null && this.model != undefined && this.model.titulo) {
                    this.$el.append(this.template(this.model));
                }
                return this;
            }
        });

        // Define o elemento que receberá a mensagem de erro
        var setErrorPlacement = function (error, element) {
            var group = element.closest('div.form-group');
            if ( $('span.help-block').length > 1 ) { $('span.help-block').remove(); }
            error.addClass('help-block').insertAfter(element);
            group.removeClass("has-success").addClass("has-error");
        };

        // A View do Formulário Genérico.
        FormView = Backbone.View.extend({
            initialize: function (params) {
                this.grupo = params.grupo;
                this.buttons = params.botoes;
                this.formClass = params.classe;
                this.formId = params.id;
                this.formName = params.nome;
                this.buttonsContainerClass = params.buttonsContainerClass;
            },
            tagName: "form",
            id: this.formId,
            events: {
                "submit": function (e) {
                    e.preventDefault();
                    var data = App.Helpers.serializeObject(e.currentTarget);
                    if (this.$el.valid()) {
                        this.trigger("formview:submit", data);
                    }
                }, 
                'click #btnCancelar': function (e) {
                    $('.goBack').trigger('click');
                }
            },
            renderControls: function () {
                var controls = new FormControlsView();
                return controls.render({ buttons: this.buttons, btnContainer: this.buttonsContainerClass }).$el;
            },
            render: function () {
                var self = this;
                //Percorre cada grupo para criar seus inputs
                _.each(this.grupo, function (grupo) {

                    var legend, formGrupo;
                    var carregarUpload = false;

                    //Criamos os inputs do grupo:
                    grupo.corpoItens = $("<div>");
                    _.each(grupo.itens, function (item) {
                        if(item.tipo == 'file')
                        {
                            carregarUpload = true;
                        }

                        var formItemView = new FormItemView({ model: item });
                        //grupo.corpoItens.append(formItemView.render().$el);
                        var element = formItemView.render().$el;

                        // Textarea Limit
                        if(item.tipo === 'textarea' && item.textareaLimit)
                        {
                            var elementId = '#'+item.inputName
                            var itemToLimit = {
                                options: item.textareaLimit,
                                el: element,
                                elementId: '#'+item.inputName
                            };
                            textareaLimitItems.push(itemToLimit);
                        }

                        grupo.corpoItens.append(validacaoItem(element, item));
                    }, this);

                    if (grupo.exibirComoPanel == true) {

                        legend = new FormPanelHeadingFieldView({ model: grupo });
                        grupo.legend = legend.render().$el.html();
                        grupo.corpoItens = grupo.corpoItens.html();
                        formGrupo = new FormGroupPanelView({ model: grupo });

                    } else {

                        legend = new FormLegendFieldView({ model: grupo });
                        grupo.legend = legend.render().$el.html();
                        grupo.corpoItens = grupo.corpoItens.html();
                        formGrupo = new FormGroupFieldView({ model: grupo });

                    }
                    this.$el.append(formGrupo.render().$el);
                    if(carregarUpload)
                    {
                        uploadManagerConfig(this);
                    }
                    
                    this.$el.addClass(this.formClass);
                    this.$el.attr("name", this.formName);

                }, this);
                this.$el.append(this.renderControls());

                // Validation
                this.$el.validate({
                    wrapper: "span",
                    highlight: function (element, errorClass) {
                        $('#'+element.id).closest('div.form-group').removeClass('has-success').addClass('has-error');
                    },
                    errorPlacement: setErrorPlacement,
                    success: function (label) {
                        label.closest('div.form-group').removeClass('has-error').addClass('has-success');
                    }
                });

                // Textarea Limit
                // Foi preciso fazer uma pós iteração devido aos objetos perderem os eventos após o tratamento.
                _.each(textareaLimitItems, function (item) {
                    this.$el.find(item.elementId).each(function () {
                        item.options.domObject = $(this);
                        textareaLimit(item.options);                        
                    });
                }, this);

                return this;
            }
        });

        // View para os Controles do formulário (botões)
        FormControlsView = Backbone.View.extend({
            className: "form-group",
            buttonTemplate: _.template(templates.buttonPlaceholder),
            // inputFileTemplate: _.template(templates.inputFile.join('')),
            // View Renderizer
            render: function (options) {
                var template,
		        	btnContainer = $('<div></div>'),
		            btnContainerClass = options.btnContainer || "col-sm-offset-2 col-sm-10";

                btnContainer.addClass(btnContainerClass);

                _.each(options.buttons, function (btn) {
                    template = this.buttonTemplate(btn);
                    btnContainer.append(template);
                }, this);

                this.$el.append(btnContainer);

                return this;
            }
        });
        // var arr = [];
        // _.each(options.form, function (form) {
        //     //arr.push(new FormView({ options: form, id: form.eid, className: form.classe, collection: options.collection.instance }).render().$el);
        // });

        // Retorno: Array.
        //return arr;

        return new FormView(options);
    };

    return Form;
});