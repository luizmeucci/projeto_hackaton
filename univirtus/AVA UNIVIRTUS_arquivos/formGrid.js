"use strict";
var formEtiqueta = (function () {

    var clsFormEtiqueta = function () {

        var _objJSON = null;
        var _titulo;
        var objDivContainerForm;
        var objDivContainer;
        var objObjeto = new Array();
        var _nomeFuncaoBlur = null;
        var _nomeFuncaoUploadArquivo = null;
        var _nomeFuncaoOpenModal = null;
        var _nomeFuncaoErroValidacao = null;
        var _idObjetoSelecionado = null;
        var _valorObjetoSelecionado = null;
        var _campoDesabilitado = true;
        var _camposObrigatorios = new Array();
        var _idObjAnulaValidacaoData = null
        var arrFilhos = new Array();

        var self = this;

        this.registrarOperador = false;
        this.formHorizontal = true;
        this.exibirRotulo = true;
        this.exibirPlaceholder = false;
        this.inicializa = function (objJSON, titulo, campoDesabilitado) {
            _objJSON = objJSON;

            objDivContainer = document.createElement("div");
            //objDivContainer.setAttribute("class", "main-holder");

            objDivContainerForm = document.createElement("div");

            if (this.formHorizontal)
                objDivContainerForm.setAttribute("class", "form-horizontal");
            else
                objDivContainerForm.setAttribute("class", "form-inline");

            _campoDesabilitado = campoDesabilitado;

            /*if(titulo != ""){
                _titulo = titulo;
                var objDivContainerFormH2 = criaTitulo();
                objDivContainerForm.appendChild(objDivContainerFormH2);
            }
            */

        };

        var inicializarTiny = function (selector) {
            //UNINTER.removerTiny();
            try {
                var menu = {};

                UNINTER.viewGenerica.getEditorTextoAvancado();
                var uninterTiny = new uninterTinymce();
                uninterTiny.destroyAll();

                uninterTiny.seletor = selector;

                uninterTiny.plugins = [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table contextmenu paste"
                ];
                uninterTiny.menu = menu;
                uninterTiny.valid_elements = "em/i,strong/b,ol,ul,li,br,table[style|border|cellpadding|cellspacing],tr[style],td[style],th,img[src|alt|width|height],p,a[href|target|title],u";
                uninterTiny.toolbar = "bold italic underline | visualblocks link"; //| charmap
                uninterTiny.validarNrCaracteres = false;

                uninterTiny.render();
            }
            catch (e) {
                console.error("erro inicializar" + e);
            }
        };

        this.afterCriarForm = function () {
            //inicializarTiny(".inputTinyMCE");
        };

        this.pai = function (id, nomeRotulo, nomeTipoRecurso, idTipoRotulo, nomeTipoRotulo, obrigatorio, idRecurso, objFilhos) {

            var objPai = new Object();
            objPai.id = id;
            objPai.nomeRotulo = nomeRotulo;
            objPai.nomeTipoRecurso = nomeTipoRecurso;
            objPai.idTipoRotulo = idTipoRotulo;
            objPai.nomeTipoRotulo = nomeTipoRotulo;
            objPai.obrigatorio = obrigatorio;
            objPai.idRecurso = idRecurso;
            objPai.filhos = objFilhos;
            objObjeto.push(objPai);
        };

        this.filho = function (id, nomeRotulo, nomeTipoRecurso, idTipoRotulo, nomeTipoRotulo, obrigatorio, idRecurso, valorEtiqueta, texto, urlRecurso, idTipoRecurso, ativa, nomeAjuda, labelAnexarArquivos) {
            var objFilho = new Object();
            if (nomeTipoRecurso)
                nomeTipoRecurso = nomeTipoRecurso.toLowerCase();

            objFilho.id = id;
            objFilho.nomeRotulo = nomeRotulo;
            objFilho.nomeTipoRecurso = nomeTipoRecurso;
            objFilho.idTipoRotulo = idTipoRotulo;
            objFilho.nomeTipoRotulo = nomeTipoRotulo;
            objFilho.obrigatorio = obrigatorio;
            objFilho.idRecurso = idRecurso;
            objFilho.valorEtiqueta = valorEtiqueta;
            objFilho.texto = texto;
            objFilho.urlRecurso = urlRecurso;
            objFilho.idTipoRecurso = idTipoRecurso;
            objFilho.nomeAjuda = (nomeAjuda) ? nomeAjuda : null;
            objFilho.idObjeto = null; //nome randomico do objeto
            /*if (ativa === false || ativa == 'false')
                objFilho.ativa = false;
            else*/
            objFilho.ativa = true;
            objFilho.labelAnexarArquivos = labelAnexarArquivos;

            return objFilho;
        };

        this.setTitulo = function (titulo) {
            _titulo = titulo;
        };

        this.setFuncaoOnBlur = function (nomeFuncaoBlur) {
            _nomeFuncaoBlur = nomeFuncaoBlur;
        };

        this.setFuncaoUploadArquivo = function (nomeFuncaoUploadArquivo) {
            _nomeFuncaoUploadArquivo = nomeFuncaoUploadArquivo;
        };

        this.setFuncaoOpenModal = function (nomeFuncaoOpenModal) {
            _nomeFuncaoOpenModal = nomeFuncaoOpenModal;
        };

        this.setFuncaoErroValidacao = function (nomeFuncaoBlur) {
            _nomeFuncaoErroValidacao = nomeFuncaoBlur;
        };

        this.getObjeto = function (idObjeto) {
            var obj = document.getElementById(idObjeto);
            return obj.meuObjeto;

        };

        this.finalizarCamposCombobox = function (selector) {

            $('#' + selector).each(function (i, item) {
                UNINTER.viewGenerica.validarSelectId($(item).attr("id"))
            });
        };

        var criaTitulo = function () {
            var objDivContainerFormH2 = document.createElement("h2");
            var objDivContainerFormI = document.createElement("i");
            objDivContainerFormH2.setAttribute("class", "form-title");
            objDivContainerFormI.setAttribute("class", "icon-plus-circle");
            objDivContainerFormH2.innerHTML = _titulo;
            objDivContainerFormH2.appendChild(objDivContainerFormI);
            return objDivContainerFormH2;
        };

        var criarConjuntoCampo = function () {
            var objDivContainerFormFieldSet = document.createElement("fieldset");
            return objDivContainerFormFieldSet;
        };

        var criarLegenda = function (_legenda) {
            _legenda = _legenda || "";
            var objDivContainerFormFieldSetLegend = document.createElement("legend");
            objDivContainerFormFieldSetLegend.innerHTML = _legenda;
            return objDivContainerFormFieldSetLegend;
        };

        var criarRotulo = function (_rotulo) {
            var objDivContainerFormFieldSetLegendGroupLabel = document.createElement("label");
            objDivContainerFormFieldSetLegendGroupLabel.setAttribute("class", "un-label");
            objDivContainerFormFieldSetLegendGroupLabel.setAttribute("for", _rotulo);
            objDivContainerFormFieldSetLegendGroupLabel.innerHTML = _rotulo;
            return objDivContainerFormFieldSetLegendGroupLabel;
        };
        var criarRotuloAjuda = function (_rotulo, ajuda) {

            var objDivContainerFormFieldSetLegendGroupLabel = document.createElement("label");
            objDivContainerFormFieldSetLegendGroupLabel.setAttribute("class", "un-label");
            objDivContainerFormFieldSetLegendGroupLabel.setAttribute("for", _rotulo);
            objDivContainerFormFieldSetLegendGroupLabel.innerHTML = _rotulo;

            if (ajuda) {
                var objAjuda = criarAjuda(ajuda);
                objDivContainerFormFieldSetLegendGroupLabel.appendChild(objAjuda);
            }

            return objDivContainerFormFieldSetLegendGroupLabel;
        };

        var criarAjuda = function (ajuda) {
            var icon = document.createElement("i");
            icon.setAttribute("class", "icon-question-circle ajuda-formgrid");

            var span = document.createElement("span");
            span.setAttribute("data-container", "body");
            span.setAttribute("data-toggle", "tooltip");
            span.setAttribute("data-placement", "bottom");
            span.setAttribute("title", ajuda);
            span.appendChild(icon);
            return span;
        }

        var criarDivGrupo = function () {
            var objDivContainerFormFieldSetLegendGroup = document.createElement("div");
            objDivContainerFormFieldSetLegendGroup.setAttribute("class", "form-group");
            return objDivContainerFormFieldSetLegendGroup;
        };

        var criarDivGrupoEntradaValor = function () {
            //Todos objetos de entrada estarão dentro desta div
            var objDivContainerFormFieldSetLegendGroupInputDiv = document.createElement("div");
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInputTexto = function (objeto) {

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            var classe = "form-control";

            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInput.type = "text";
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-recurso", objeto.idRecurso);
            var idNomeInput = gerarIdRamdomico();

            if (self.exibirPlaceholder) {
                objDivContainerFormFieldSetLegendGroupInput.placeholder = objeto.nomeRotulo;
            }
            
            if (objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    if (params.idObjeto)
                        idNomeInput = params.idObjeto;
                        
                    if(self.registrarOperador == true){
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
                    }
                } catch (e) {

                }
            }


            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.value = objeto.valorEtiqueta;
            if (objeto.ativa === false) {

                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }

            switch (objeto.idTipoRecurso) {
                case 10://url                
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-url", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-url", "Link inválido");
                    break;
                case 16://uppercase                                        
                    classe += " text-uppercase";
                    break;
                case 26: //readyonly                
                    objDivContainerFormFieldSetLegendGroupInput.readOnly = true;
                    if (objeto.texto)
                        objDivContainerFormFieldSetLegendGroupInput.value = objeto.texto;
                    break;
                case 27://CPF    
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-maxlength", 14);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-validar-cpf", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("maxlength", 14);
                    break;
                case 28: // CNPJ
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-maxlength", 18);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-validar-cnpj", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("maxlength", 18);
                    break;
                case 34: // CEP
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-maxlength", 9);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-validar-cep", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("maxlength", 9);
                    break;
                case 35: // telefone
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-maxlength", 15);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-validar-telefone", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("maxlength", 15);
                    break;
                case 36: // email                    
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-validar-email", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-email", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-email", "E-mail inválido");
                    break;
                case 42: // ano                
                        objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-sm");
                        classe += " datepicker";
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-number", "true");                        
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("maxlength", "4");
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-date-format", "YYYY");
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-date-viewmode", "year");

                        jQuery(objDivContainerFormFieldSetLegendGroupInput).datetimepicker();

                    break;
            }

            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", classe);

            objeto.idObjeto = idNomeInput;

            criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInpuHidden = function (objeto) {

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control");
            objDivContainerFormFieldSetLegendGroupInput.type = "hidden";

            var idNomeInput = gerarIdRamdomico();

            if (objeto.urlRecurso != null) {
                var params = JSON.parse(objeto.urlRecurso);

                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);

                if (params.pegarDaSessao) {
                    if (objeto.nomeRotulo == "idSalaVirtualOferta") {
                        objeto.valorEtiqueta = UNINTER.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOferta;
                    }
                }
            }

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.value = objeto.valorEtiqueta;
            if (objeto.ativa === false) {

                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;


            objeto.idObjeto = idNomeInput;
            criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInputNumerico = function (objeto) {

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-xs");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-number", "true");
            objDivContainerFormFieldSetLegendGroupInput.type = "number";
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-recurso", objeto.idRecurso);

            if (self.exibirPlaceholder) {
                objDivContainerFormFieldSetLegendGroupInput.placeholder = objeto.nomeRotulo;
            }
            if (self.registrarOperador == true && objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);


                } catch (e) {

                }
            }


            var idNomeInput = gerarIdRamdomico();

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.value = objeto.valorEtiqueta;
            if (objeto.ativa === false) {

                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }

            objeto.idObjeto = idNomeInput;


            criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInputTextarea = function (objeto, montarTinyMCE) {

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("textarea");
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-recurso", objeto.idRecurso);

            if (self.registrarOperador == true && objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("data-operador", params.operador);
                    objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("data-id", objeto.id);
                } catch (e) {

                }
            }

            var classeTiny = "";
            if (montarTinyMCE)
                classeTiny = "inputTinyMCE";

            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control " + classeTiny);
            //objDivContainerFormFieldSetLegendGroupInput.type = "text";

            var idNomeInput = gerarIdRamdomico();

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;

            if (objeto.valorEtiqueta == null)
                objeto.valorEtiqueta = "";
            objDivContainerFormFieldSetLegendGroupInput.value = objeto.valorEtiqueta;
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;
            objeto.idObjeto = idNomeInput;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }
            if (objeto.idTipoRecurso == 32) { //readonly            
                objDivContainerFormFieldSetLegendGroupInput.readOnly = true;
                if (objeto.texto)
                    objDivContainerFormFieldSetLegendGroupInput.value = objeto.texto;
            }

            criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInputData = function (objeto) {

            var idRandomico = gerarIdRamdomico();
            var idElementoDataInicio = idRandomico + "_DataInicio";
            var idElementoHoraInicio = idRandomico + "_HoraInicio";
            var idElementoDataFim = idRandomico + "_DataFim";
            var idElementoHoraFim = idRandomico + "_HoraFim";
            var divPrincipal = criarDivGrupoEntradaValor();
            var divMensagemDatas = document.createElement("div");
            var divDataInicioPai = document.createElement("div");
            var divHoraInicioPai = document.createElement("div");
            var divDataFimPai = document.createElement("div");
            var divHoraFimPai = document.createElement("div");
            var totalDias = 0;
            var ocultarCampoHora = 0;
            var idObjAnulaValidacao = 0; //idTabelaColuna
            var valorObjAnulaValidacao = 0;
            var classInputHora = "un-input-xs";
            var valorObjAnulaValidacaoData = null;

            objeto.idObjeto = idElementoDataInicio;

            divDataInicioPai.setAttribute("class", "un-input-xs");

            if (objeto.urlRecurso != null) {

                var arrAtributos = JSON.parse(objeto.urlRecurso);

                if (arrAtributos.totalDias) {
                    totalDias = arrAtributos.totalDias;
                }

                if (arrAtributos.ocultarCampoHora) {
                    ocultarCampoHora = arrAtributos.ocultarCampoHora;
                    if (ocultarCampoHora == 1) {
                        classInputHora = "hidden";
                    }
                }
                var arrAtributos = JSON.parse(objeto.urlRecurso);
                if (arrAtributos.idObjAnulaValidacao != null) {
                    _idObjAnulaValidacaoData = arrAtributos.idObjAnulaValidacao
                    valorObjAnulaValidacaoData = $('[data-id = ' + _idObjAnulaValidacaoData + ']').val();
                }

            }


            divHoraInicioPai.setAttribute("class", "un-input-xs");
            divHoraInicioPai.setAttribute("class", classInputHora);

            divDataFimPai.setAttribute("class", "un-input-xs");
            divHoraFimPai.setAttribute("class", classInputHora);

            //Criação dos elementos
            var elementoDataInicio = document.createElement("input");
            elementoDataInicio.setAttribute("class", "form-control datepicker");
            elementoDataInicio.type = "text";

            var elementoHoraInicio = document.createElement("input");
            elementoHoraInicio.setAttribute("class", "form-control datepicker ignoreOnFilter");
            elementoHoraInicio.type = "text";

            var elementoDataFim = document.createElement("input");
            elementoDataFim.setAttribute("class", "form-control datepicker ignoreOnFilter");
            elementoDataFim.type = "text";

            var elementoHoraFim = document.createElement("input");
            elementoHoraFim.setAttribute("class", "form-control datepicker ignoreOnFilter");
            elementoHoraFim.type = "text";

            //Adicionando dados do datepicker
            elementoDataInicio.setAttribute("data-date-picktime", "false");
            elementoDataInicio.setAttribute("data-date-format", "DD/MM/YYYY");
            elementoHoraInicio.setAttribute("data-date-pickdate", "false");
            elementoHoraInicio.setAttribute("data-date-format", "HH:mm:ss");
            elementoDataFim.setAttribute("data-date-picktime", "false");
            elementoDataFim.setAttribute("data-date-format", "DD/MM/YYYY");
            elementoHoraFim.setAttribute("data-date-pickdate", "false");
            elementoHoraFim.setAttribute("data-date-format", "HH:mm:ss");

            elementoDataInicio.setAttribute("data-date-useCurrent", "false");
            elementoDataFim.setAttribute("data-date-useCurrent", "false");

            //Adicionando dados de máscara
            elementoDataInicio.setAttribute("maxlength", "10");
            jQuery(elementoDataInicio).datetimepicker();
            jQuery(elementoDataInicio).mask("00/00/0000");
            elementoHoraInicio.setAttribute("maxlength", "10");
            jQuery(elementoHoraInicio).datetimepicker();
            jQuery(elementoHoraInicio).mask("00/00/0000");
            elementoDataFim.setAttribute("maxlength", "10");
            jQuery(elementoDataFim).datetimepicker();
            jQuery(elementoDataFim).mask("00/00/0000");
            elementoHoraFim.setAttribute("maxlength", "10");
            jQuery(elementoHoraFim).datetimepicker();
            jQuery(elementoHoraFim).mask("00/00/0000");

            //Adicionando o ID
            elementoDataInicio.name = idElementoDataInicio;
            elementoDataInicio.id = idElementoDataInicio;
            elementoHoraInicio.name = idElementoHoraInicio;
            elementoHoraInicio.id = idElementoHoraInicio;
            elementoDataFim.name = idElementoDataFim;
            elementoDataFim.id = idElementoDataFim;
            elementoHoraFim.name = idElementoHoraFim;
            elementoHoraFim.id = idElementoHoraFim;

            //Adicionando evento do Blur
            criarFunctionOnBlur(elementoDataInicio, objeto);
            criarFunctionOnBlur(elementoHoraInicio, objeto);
            criarFunctionOnBlur(elementoDataFim, objeto);
            criarFunctionOnBlur(elementoHoraFim, objeto);

            //Adicionando operador
            if (self.registrarOperador == true && objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    elementoDataInicio.setAttribute("data-operador", params.operador);
                    elementoDataInicio.setAttribute("data-id", objeto.id);
                    elementoHoraInicio.setAttribute("data-operador", params.operador);
                    elementoHoraInicio.setAttribute("data-id", objeto.id);
                    elementoDataFim.setAttribute("data-operador", params.operador);
                    elementoDataFim.setAttribute("data-id", objeto.id);
                    elementoHoraFim.setAttribute("data-operador", params.operador);
                    elementoHoraFim.setAttribute("data-id", objeto.id);
                } catch (e) {

                }
            }

            //Habilitando/Desabilitando
            if (objeto.ativa === false) {
                elementoDataInicio.disabled = true;
                elementoHoraInicio.disabled = true;
                elementoDataFim.disabled = true;
                elementoHoraFim.disabled = true;
            }
            else {
                elementoDataInicio.disabled = _campoDesabilitado;
                elementoHoraInicio.disabled = _campoDesabilitado;
                elementoDataFim.disabled = _campoDesabilitado;
                elementoHoraFim.disabled = _campoDesabilitado;
            }

            //Adicionando obrigatoriedade
            if (objeto.obrigatorio) {
                elementoDataInicio.setAttribute("data-rule-required", true);
                elementoDataInicio.setAttribute("data-msg-required", "Essa informação é obrigatória.");
                elementoHoraInicio.setAttribute("data-rule-required", true);
                elementoHoraInicio.setAttribute("data-msg-required", "Essa informação é obrigatória.");
                elementoDataFim.setAttribute("data-rule-required", true);
                elementoDataFim.setAttribute("data-msg-required", "Essa informação é obrigatória.");
                elementoHoraFim.setAttribute("data-rule-required", true);
                elementoHoraFim.setAttribute("data-msg-required", "Essa informação é obrigatória.");

            }

            jQuery(elementoDataInicio).off("dp.change").on("dp.change", function (e) {

                var dataMin = moment(e.date);
                var dataMax = moment(e.date);

                jQuery(elementoDataFim).data("DateTimePicker").minDate(dataMin);

                if (totalDias > 0) {
                    jQuery(elementoDataFim).data("DateTimePicker").maxDate(dataMax.add("days", totalDias));
                }

                if (elementoDataInicio.valueOf() != "") {
                    if (elementoHoraInicio.valueOf() != "") {
                        jQuery(elementoHoraInicio).data("DateTimePicker").date(e.date.hour(0));
                    }
                }
            });

            jQuery(elementoDataFim).off("dp.change").on("dp.change", function (e) {
                if (elementoDataFim.valueOf() != "") {
                    if (elementoHoraFim.valueOf() != "") {
                        jQuery(elementoHoraFim).data("DateTimePicker").date(e.date.hour(23).minute(59).second(59));
                    }
                }
            });

            jQuery(elementoDataInicio).on("blur", function (e) {

                blurDataInicio(e);
            });
            jQuery(elementoDataFim).on("blur", function (e) {

                blurDataFim(e)
            });

            var divAtePai = document.createElement("div");
            divAtePai.setAttribute("class", "un-input-xxs");
            divAtePai.setAttribute("style", "width:auto;");
            var labelAte = document.createElement("label");
            labelAte.innerHTML = "Até";

            var divDePai = document.createElement("div");
            divDePai.setAttribute("class", "un-input-xxs");
            divDePai.setAttribute("style", "width:auto;");
            var labelDe = document.createElement("label");
            labelDe.innerHTML = "De";

            divPrincipal.setAttribute("id", "divDatas");

            //Fazendo append na div principal
            divDataInicioPai.appendChild(elementoDataInicio);

            divHoraInicioPai.appendChild(elementoHoraInicio);

            divDePai.appendChild(labelDe);
            divAtePai.appendChild(labelAte);
            divDataFimPai.appendChild(elementoDataFim);

            divHoraFimPai.appendChild(elementoHoraFim);

            divPrincipal.appendChild(divDePai);
            divPrincipal.appendChild(divDataInicioPai);
            divPrincipal.appendChild(divHoraInicioPai);


            divPrincipal.appendChild(divAtePai);
            divPrincipal.appendChild(divDataFimPai);

            divPrincipal.appendChild(divHoraFimPai);

            return divPrincipal;
        };

        var criarListaInputTexto = function (objeto) {

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            //objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");

            var objDivGroup = criarDivGrupoEntradaValor();
            objDivGroup.setAttribute("class", "un-input-md input-group");

            var idNomeInputHidden = gerarIdRamdomico();
            var inputHidden = document.createElement("input");
            inputHidden.type = "hidden";
            inputHidden.value = objeto.texto;
            inputHidden.name = idNomeInputHidden;
            inputHidden.id = idNomeInputHidden;
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(inputHidden);
            objeto.idObjeto = idNomeInputHidden;

            inputHidden.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            inputHidden.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            inputHidden.setAttribute("data-id-recurso", objeto.idRecurso);

            var idNomeInput = gerarIdRamdomico();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control");
            objDivContainerFormFieldSetLegendGroupInput.type = "text";
            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;

            if (self.exibirPlaceholder) {
                objDivContainerFormFieldSetLegendGroupInput.placeholder = objeto.nomeRotulo;
            }
            var separador = null;
            if (objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    if (self.registrarOperador == true) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
                    }
                    if (params.separador)
                        separador = params.separador;

                } catch (e) { }
            }
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);

                if (objeto.texto)
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", false);

                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }

            var funcaoOnBlur = function (_objeto, _objDivContainerFormFieldSetLegendGroupInputDiv) {
                return function () {

                    var valor = objDivContainerFormFieldSetLegendGroupInput.value;
                    if (UNINTER.Helpers.stringValida(valor)) {
                        $(objDivContainerFormFieldSetLegendGroupInput).data("rule-required", false);
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", false);
                        var divListaObjeto = criarInputGroupLista(objeto, inputHidden, valor);
                        objDivContainerFormFieldSetLegendGroupInput.value = "";
                        objDivContainerFormFieldSetLegendGroupInputDiv.insertBefore(divListaObjeto, objDivContainerFormFieldSetLegendGroupInputDiv.lastElementChild);

                        registrarFuncao(_objeto, objeto);
                        UNINTER.viewGenerica.setPlaceholderHeight();
                    }
                }
            };
            objDivContainerFormFieldSetLegendGroupInput.onblur = funcaoOnBlur(inputHidden);
            objDivGroup.appendChild(objDivContainerFormFieldSetLegendGroupInput);

            if (!objDivContainerFormFieldSetLegendGroupInput.disabled) {
                var buttonAdd = document.createElement("button");
                buttonAdd.setAttribute("class", "btn btn-primary");
                buttonAdd.innerHTML = '<i class="icon-plus"></i>';

                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.appendChild(buttonAdd);
                objDivGroup.appendChild(span);
            }
            if (UNINTER.Helpers.stringValida(objeto.texto)) {
                var valor = objeto.texto;
                var palavras = valor.split(separador);

                if (palavras.length > 0) {
                    for (var i = 0; i < palavras.length; i++) {
                        palavras[i] = $.trim(palavras[i]);

                        if (palavras[i]) {
                            var divListaObjeto = criarInputGroupLista(objeto, inputHidden, palavras[i]);
                            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(divListaObjeto);
                        }
                    }
                }
            }

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivGroup);

            return objDivContainerFormFieldSetLegendGroupInputDiv;
        }

        var criarInputGroupLista = function (objeto, inputHidden, valor) {
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md input-group");

            //var objDivGroup = criarDivGrupoEntradaValor();
            //objDivGroup.setAttribute("class", "input-group");

            var idNomeInput = gerarIdRamdomico();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");

            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control inputList_" + objeto.idObjeto);
            objDivContainerFormFieldSetLegendGroupInput.type = "text";
            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.value = valor;
            if (self.exibirPlaceholder) {
                objDivContainerFormFieldSetLegendGroupInput.placeholder = objeto.nomeRotulo;
            }

            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }

            //criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);

            var obj = document.getElementById(objeto.id);
            var funcaoOnBlur = function (_objeto) { return function () { registrarFuncao(_objeto, objeto); } };
            objDivContainerFormFieldSetLegendGroupInput.onblur = funcaoOnBlur(inputHidden);

            //objDivGroup.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);

            if (!objDivContainerFormFieldSetLegendGroupInput.disabled) {
                var buttonAdd = document.createElement("a");
                buttonAdd.innerHTML = ' <i class="icon-times" title="limpar dados"></i>';
                buttonAdd.href = "javascript: void(0)";
                var funcaoLimpar = function (_objeto) {
                    return function () {
                        objDivContainerFormFieldSetLegendGroupInputDiv.parentNode.removeChild(objDivContainerFormFieldSetLegendGroupInputDiv);
                        registrarFuncao(_objeto, objeto);
                    }
                };
                buttonAdd.onclick = funcaoLimpar(inputHidden);

                var span = document.createElement("span");
                span.style.paddingLeft = "5px";
                span.setAttribute("class", "input-group-btn");
                span.appendChild(buttonAdd);
                objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(span);
            }
            //objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivGroup);
            objDivContainerFormFieldSetLegendGroupInputDiv.style.paddingBottom = "5px";
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        }

        var criarTabelaInputDisciplina = function (objeto) {

            //return criarListaInputTexto(objeto);

            var divPai = document.createElement('div');
            divPai.setAttribute('id', 'divTabelaInputTexto');

            //var table = document.createElement('table');
            //table.setAttribute('id', 'tableInputTexto');

            //var trCabecalho = document.createElement('tr');

            //document.createElement('');

            var divSpans = document.createElement('div');
            divSpans.setAttribute('class', 'un-input-md input-group');

            var spanA = document.createElement("span");
            spanA.setAttribute('style', 'width:25%; padding-left: 0px;');
            spanA.setAttribute('class', 'un-label');
            spanA.innerHTML = 'Disciplina';

            var spanB = document.createElement("span");
            spanB.setAttribute('style', 'width:25%; padding-left: 0px;');
            spanB.setAttribute('class', 'un-label');
            spanB.innerHTML = 'Carga Horária';

            var spanC = document.createElement("span");
            spanC.setAttribute('style', 'width:25%; padding-left: 0px;');
            spanC.setAttribute('class', 'un-label');
            spanC.innerHTML = 'Frequência';

            var spanD = document.createElement("span");
            spanD.setAttribute('style', 'width:25%; padding-left: 0px;');
            spanD.setAttribute('class', 'un-label');
            spanD.innerHTML = 'Nota';

            var spanExcluir = document.createElement('span');
            spanExcluir.setAttribute('class', 'input-group-btn');
            spanExcluir.setAttribute('style', 'padding-left: 27px;');

            divSpans.appendChild(spanA);
            divSpans.appendChild(spanB);
            divSpans.appendChild(spanC);
            divSpans.appendChild(spanD);
            divSpans.appendChild(spanExcluir);
            divPai.appendChild(divSpans);

            var onClickAdd = function (e) {

                divPai.appendChild(criarLinhadaTabela(divPai));
                UNINTER.viewGenerica.setPlaceholderHeight();
            };

            var onClickExcluir = function (e) {

                jQuery(e.currentTarget).closest('div').remove();
                UNINTER.viewGenerica.setPlaceholderHeight();
            };

            var criarLinhadaTabela = function (divPai, objValores) {
                var divFilho = document.createElement('div');
                divFilho.setAttribute('class', 'un-input-md input-group');
                divFilho.setAttribute('style', 'padding-bottom: 5px;');

                var funcaoOnBlur = function (_objeto) { return function () { registrarFuncao(_objeto, objeto); } };

                var idNomeInput = gerarIdRamdomico();
                var inputTextA = document.createElement("input");
                inputTextA.setAttribute("class", "form-control");
                inputTextA.setAttribute('style', 'width:25%;');
                inputTextA.type = "text";
                inputTextA.name = idNomeInput;
                inputTextA.onblur = funcaoOnBlur(inputTextA);
                inputTextA.id = idNomeInput;
                if (objValores != null)
                    inputTextA.value = objValores.valorEtiqueta;

                idNomeInput = gerarIdRamdomico();
                var inputTextB = document.createElement("input");
                inputTextB.setAttribute("class", "form-control");
                inputTextB.setAttribute('style', 'width:25%;');
                inputTextB.type = "text";
                inputTextB.name = idNomeInput;
                inputTextB.id = idNomeInput;

                idNomeInput = gerarIdRamdomico();
                var inputTextC = document.createElement("input");
                inputTextC.setAttribute("class", "form-control");
                inputTextC.setAttribute('style', 'width:25%;');
                inputTextC.type = "text";
                inputTextC.name = idNomeInput;
                inputTextC.id = idNomeInput;

                idNomeInput = gerarIdRamdomico();
                var inputTextD = document.createElement("input");
                inputTextD.setAttribute("class", "form-control");
                inputTextD.setAttribute('style', 'width:25%;');
                inputTextD.type = "text";
                inputTextD.name = idNomeInput;
                inputTextD.id = idNomeInput;

                divFilho.appendChild(inputTextA);
                divFilho.appendChild(inputTextB);
                divFilho.appendChild(inputTextC);
                divFilho.appendChild(inputTextD);

                var spanComandos = divPai.getElementsByClassName('span-add-linha');

                console.log(spanComandos.length);

                for (var i = 0; i < spanComandos.length; i++) {
                    var iExcluir = document.createElement('i');
                    iExcluir.setAttribute('class', 'icon-times');
                    iExcluir.setAttribute('title', 'limpar dados');

                    var aExcluir = document.createElement('a');
                    aExcluir.setAttribute('href', 'javascript:void(0)');
                    aExcluir.appendChild(iExcluir);

                    var spanExcluir = document.createElement('span');
                    spanExcluir.setAttribute('class', 'input-group-btn');
                    spanExcluir.setAttribute('style', 'padding-left: 15px;');
                    jQuery(spanExcluir).on('click', onClickExcluir);
                    spanExcluir.appendChild(aExcluir);

                    spanComandos[i].innerHTML = '';
                    spanComandos[i].appendChild(spanExcluir);
                    spanComandos[i].classList.remove("span-add-linha");
                }

                var iAdd = document.createElement('i');
                iAdd.setAttribute('class', 'icon-plus');

                var buttonAdd = document.createElement('button');
                buttonAdd.setAttribute('class', 'btn btn-primary');
                jQuery(buttonAdd).on('click', onClickAdd);
                buttonAdd.appendChild(iAdd);

                var spanAdd = document.createElement('span');
                spanAdd.setAttribute('class', 'input-group-btn span-add-linha');
                spanAdd.appendChild(buttonAdd);

                divFilho.appendChild(spanAdd);

                return divFilho;
            };

            var divFilho = criarLinhadaTabela(divPai, objeto);

            divPai.appendChild(divFilho);

            return divPai;
        };

        var criarLinhaDivisoria = function (objeto) {

            return document.createElement("hr");
        };

        var criarLegendaForm = function (objeto) {
            objeto.idObjeto = gerarIdRamdomico();


            var objDivContainerFormFieldSetLegendGroupLabel = document.createElement("label");
            objDivContainerFormFieldSetLegendGroupLabel.setAttribute("class", "un-label");
            objDivContainerFormFieldSetLegendGroupLabel.id = objeto.idObjeto;

            objDivContainerFormFieldSetLegendGroupLabel.innerHTML = objeto.nomeRotulo;
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupLabel);
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };
        var criarRecursoDiv = function (objeto) {
            objeto.idObjeto = gerarIdRamdomico();

            
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");

            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("data-nome", objeto.nomeRotulo);
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("data-id-recurso", objeto.idRecurso);

            objDivContainerFormFieldSetLegendGroupInputDiv.id = objeto.idObjeto;
            
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };


        var blurDataInicio = function (e) {
            var el = e.currentTarget;
            var id = el.id.substring(0, el.id.indexOf('_DataInicio'))
            var dataInicio = $(el).val();
            var dataFim = $('#' + id + '_DataFim').val();
            var valorObjAnulaValidacaoData = $('[data-id = ' + _idObjAnulaValidacaoData + ']').val();
            var form = $(el).closest('form')[0].id;
            if (valorObjAnulaValidacaoData != null && valorObjAnulaValidacaoData != '') {
                $(el).attr("data-rule-required", false);
                $('#' + id + '_DataFim').attr("data-rule-required", false);
                $("#" + form + '#mensagemDatas').html('');
                return true;
            }

            if (dataFim == '') {
                dataFim = null;
            }
            if (!validarDatas(form, dataInicio, dataFim)) {
                return false;
            }
            else {
                return true;
            }
        };

        var blurDataFim = function (e) {
            var el = e.currentTarget;
            var id = el.id.substring(0, el.id.indexOf('_DataFim'))
            var dataInicio = $('#' + id + '_DataInicio').val();
            var dataFim = $(el).val();
            var valorObjAnulaValidacaoData = $('[data-id = ' + _idObjAnulaValidacaoData + ']').val();
            var form = $(el).closest('form')[0].id;
            if (valorObjAnulaValidacaoData != null && valorObjAnulaValidacaoData != '') {
                $('#' + id + '_DataInicio').attr("data-rule-required", false);
                $(el).attr("data-rule-required", false);
                $("#" + form + ' #mensagemDatas').html('');
                return true;
            }

            if (!validarDatas(form, dataInicio, dataFim)) {
                return false;
            }
            else {
                $("#" + form + ' #mensagemDatas').html('');
                return true;
            }
        };

        this.validarDatasBlur = function (el) {
            var id = el[0].id.substring(0, el[0].id.indexOf('_DataFim'))
            var dataInicio = $('#' + id + '_DataInicio').val();
            var dataFim = $(el).val();
            var valorObjAnulaValidacaoData = $('[data-id = ' + _idObjAnulaValidacaoData + ']').val();
            var form = $(el).closest('form')[0].id;
            if (valorObjAnulaValidacaoData != null && valorObjAnulaValidacaoData != '') {
                $('#' + id + '_DataInicio').attr("data-rule-required", false);
                $(el).attr("data-rule-required", false);
                $("#" + form + ' #mensagemDatas').html('');
                return true;
            }
            if (!validarDatas(form, dataInicio, dataFim)) {
                return false;
            }
            else {
                $("#" + form + ' #mensagemDatas').html('');
                return true;
            }
        };

        var validarDatas = function (form, dataInicio, dataFim, horaInicio, horaFim) {
            var matchdata = new RegExp(/((0[1-9]|[12][0-9]|3[01])\/(0[13578]|1[02])\/[12][0-9]{3})|((0[1-9]|[12][0-9]|30)\/(0[469]|11)\/[12][0-9]{3})|((0[1-9]|1[0-9]|2[0-8])\/02\/[12][0-9]([02468][1235679]|[13579][01345789]))|((0[1-9]|[12][0-9])\/02\/[12][0-9]([02468][048]|[13579][26]))/gi);
            var matchhora = new RegExp(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/gi);

            if (dataInicio != null && dataInicio != '') {
                if (!dataInicio.match(matchdata)) {
                    erroDatas(form, "Data Início inválida.", "danger");
                    return false;
                }
            }
            if (dataFim != null && dataFim != '') {
                if (!dataFim.match(matchdata)) {
                    erroDatas(form, "Data Fim inválida.", "danger");
                    return false;
                }
            }
            if (horaInicio != null) {
                if (!horaInicio.match(matchhora)) {
                    erroDatas(form, "Hora Início inválida.", "danger");
                    return false;
                }
            }
            if (horaFim != null) {
                if (!horaFim.match(matchhora)) {
                    erroDatas(form, "Hora Fim inválida.", "danger");
                    return false;
                }
            }
            if (isDataInicialMenorDataFinal(dataInicio, dataFim, horaInicio, horaFim) == false) {
                erroDatas(form, "A Data Final deve ser até 31 dias superior à Data Inicial.", "danger");
                return false;
            }
            if (diferencaDias(dataInicio, dataFim) > 31) {
                erroDatas(form, "A Data Final deve ser até 31 dias superior à Data Inicial.", "danger");
                return false;
            }
            return true;
        }

        var isDataInicialMenorDataFinal = function (dataInicial, dataFinal, horaInicial, horaFinal) {
            var dataIni = dataInicial.split('/');
            var dataFim = dataFinal.split('/');
            // Verifica os anos. Se forem diferentes, é só ver se o inicial
            // é menor que o final.
            var aIni = parseInt(dataIni[2], 10);
            var aFim = parseInt(dataFim[2], 10);

            var mIni = null;
            var mFim = null;


            var dIni = null;
            var dFim = null;

            if (aIni > aFim) {
                return false;
            }
            else if (aIni == aFim) {
                // Se os anos são iguais, verifica os meses então.
                mIni = parseInt(dataIni[1], 10);
                mFim = parseInt(dataFim[1], 10);
                if (mIni > mFim) {

                    return false;
                }
                else if (mIni == mFim) {
                    // Se os meses são iguais, verifica os dias então.
                    dIni = parseInt(dataIni[0], 10);
                    dFim = parseInt(dataFim[0], 10);
                    if (dIni > dFim) {
                        return false;
                    }
                    else if (dIni == dFim) {
                        if (horaInicial != null && horaFinal != null) {
                            if (UNINTER.Helpers.isHoraInicialMenorHoraFinal(horaInicial, horaFinal) == false) {
                                return false;
                            }
                        }
                    }
                }
            }
        };

        function diferencaDias(date1, date2) {

            var ONE_DAY = 1000 * 60 * 60 * 24

            var date1_aux = new Date(date1.split('/')[2], date1.split('/')[1] - 1, date1.split('/')[0]);
            var date2_aux = new Date(date2.split('/')[2], date2.split('/')[1] - 1, date2.split('/')[0]);


            var date1_ms = date1_aux.getTime();
            var date2_ms = date2_aux.getTime();

            var difference_ms = Math.abs(date2_ms - date1_ms);

            return Math.round(difference_ms / ONE_DAY)

        }

        var erroDatas = function (form, mensagem, tipo) {


            //elemento onde sera exibido a mensagem
            var opcoes = {
                body: "",
                strong: "",
                type: tipo,
                appendTo: "#" + form + " #mensagemDatas"
            };

            opcoes.body = mensagem;
            //Removemos a mensagem, caso haja, e inserimos a nova.
            $("#" + form + " #mensagemDatas").empty();
            UNINTER.flashMessage(opcoes);
            /*UNINTER.Helpers.animatedScrollTop();*/
            UNINTER.viewGenerica.setPlaceholderHeight();
        };

        var criarInputHora = function (objeto) {

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-xs");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control datepicker");
            objDivContainerFormFieldSetLegendGroupInput.type = "text";

            if (self.registrarOperador == true && objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
                } catch (e) {

                }
            }

            //dados da mascara            
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("maxlength", "10");

            //dados dodatepicker
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-date-picktime", "false");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-date-format", "DD/MM/YYYY");

            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;
            var idNomeInput = gerarIdRamdomico();

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.value = objeto.valorEtiqueta;
            objeto.idObjeto = idNomeInput;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }

            criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);


            jQuery(objDivContainerFormFieldSetLegendGroupInput).datetimepicker();
            jQuery(objDivContainerFormFieldSetLegendGroupInput).mask("00/00/0000");

            //console.log(objDivContainerFormFieldSetLegendGroupInput);
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);


            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInputDataHora = function (objeto) {

            var data = "";
            var hora = "";
            var exibirHora = true;
            if (objeto.valorEtiqueta != "" && objeto.valorEtiqueta != null) {
                var dataHora = objeto.valorEtiqueta.split(" ");
                data = dataHora[0];
                hora = dataHora[1];
            }
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-xs");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control datepicker");
            objDivContainerFormFieldSetLegendGroupInput.type = "text";
            objDivContainerFormFieldSetLegendGroupInput.style.minWidth = "100px";
            var objGroupData = criarDivGrupoEntradaValor();
            objGroupData.setAttribute("class", "input-group");
            var iconCalendar = document.createElement("span");
            iconCalendar.setAttribute("class", "input-group-addon");
            iconCalendar.innerHTML = '<i class="icon-calendar"></i>';

            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-recurso", objeto.idRecurso);
            if (objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);

                    if (self.registrarOperador == true) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);

                    }

                    if (params.ocultarHora == 'true')
                        exibirHora = false;

                } catch (e) {

                }
            }

            //dados da mascara            
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("maxlength", "10");

            //dados dodatepicker
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-date-picktime", "false");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-date-format", "DD/MM/YYYY");

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }
            //console.log(objeto.ativa);
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;
            var idRandom = gerarIdRamdomico();
            var idNomeInput = idRandom;

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.value = data;
            objeto.idObjeto = idNomeInput;

            var criarFunctionOnBlurData = function (objeto, objetoUsr) {
                var funcaoOnBlur = function (objeto) {

                    return function () {
                        var elemenData = document.getElementById(idRandom);
                        var elemenHora = document.getElementById(idRandom + "Hora");
                        if (exibirHora) {
                            if (elemenHora.value == "" && objetoUsr.idRecurso == 18 && elemenData.value != "") {
                                elemenHora.value = "00:00:00";
                            }
                            else if (elemenHora.value == "" && objetoUsr.idRecurso == 21 && elemenData.value != "") {
                                elemenHora.value = "23:59:59";
                            }
                            else if (elemenHora.value == "" && elemenData.value != "")
                                elemenHora.value = "00:00:00";
                        }
                        registrarFuncao(objeto, objetoUsr);
                    }
                };
                objeto.onblur = funcaoOnBlur(objeto);
            };
            criarFunctionOnBlurData(objDivContainerFormFieldSetLegendGroupInput, objeto);

            //objDivContainerFormFieldSetLegendGroupInput.onblur = funcaoOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);

            jQuery(objDivContainerFormFieldSetLegendGroupInput).datetimepicker();
            jQuery(objDivContainerFormFieldSetLegendGroupInput).mask("00/00/0000");

            objGroupData.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            objGroupData.appendChild(iconCalendar);
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objGroupData);

            var divMaior = criarDivGrupoEntradaValor();
            divMaior.setAttribute("class", "divdatetimepicker");
            divMaior.appendChild(objDivContainerFormFieldSetLegendGroupInputDiv);


            if (exibirHora) {
                var objDivContainerFormFieldSetLegendGroupInputHoraDiv = criarDivGrupoEntradaValor();
                var objDivContainerFormFieldSetLegendGroupInputHora = document.createElement("input");
                objDivContainerFormFieldSetLegendGroupInputHoraDiv.setAttribute("class", "un-input-xs");
                objDivContainerFormFieldSetLegendGroupInputHora.setAttribute("class", "form-control datepicker");
                objDivContainerFormFieldSetLegendGroupInputHora.type = "text";

                var objGroupHora = criarDivGrupoEntradaValor();
                objGroupHora.setAttribute("class", "input-group");
                var iconClock = document.createElement("span");
                iconClock.setAttribute("class", "input-group-addon");
                iconClock.innerHTML = '<i class="icon-clock-o"></i>';

                //dados da mascara            
                objDivContainerFormFieldSetLegendGroupInputHora.setAttribute("maxlength", "5");

                //dados dodatepicker
                objDivContainerFormFieldSetLegendGroupInputHora.setAttribute("data-date-pickdate", "false");
                objDivContainerFormFieldSetLegendGroupInputHora.setAttribute("data-date-format", "HH:mm:ss");

                if (objeto.obrigatorio) {
                    objDivContainerFormFieldSetLegendGroupInputHora.setAttribute("data-rule-required", true);
                    objDivContainerFormFieldSetLegendGroupInputHora.setAttribute("data-msg-required", "Essa informação é obrigatória.");
                }
                if (objeto.ativa === false) {
                    objDivContainerFormFieldSetLegendGroupInputHora.disabled = true;
                }
                else
                    objDivContainerFormFieldSetLegendGroupInputHora.disabled = _campoDesabilitado;
                var idNomeInput = idRandom + "Hora";

                objDivContainerFormFieldSetLegendGroupInputHora.name = idNomeInput;
                objDivContainerFormFieldSetLegendGroupInputHora.id = idNomeInput;
                objDivContainerFormFieldSetLegendGroupInputHora.value = hora;
                objeto.idObjeto = idNomeInput;

                var criarFunctionOnBlurHora = function (objeto, objetoUsr) {
                    var funcaoOnBlur = function (objeto) {
                        return function () {
                            var elemenData = document.getElementById(idRandom);
                            var elemenHora = document.getElementById(idRandom + "Hora");

                            if (elemenHora.value == "" && objetoUsr.idRecurso == 18 && elemenData.value != "") {
                                elemenHora.value = "00:00:00";
                            }
                            else if (elemenHora.value == "" && objetoUsr.idRecurso == 21 && elemenData.value != "") {
                                elemenHora.value = "23:59:59";
                            }

                            if (elemenData.value != "" || (elemenData.value == "" && elemenHora.value == "")) {

                                registrarFuncao(objeto, objetoUsr);
                            }
                        }
                    };
                    objeto.onblur = funcaoOnBlur(objeto);
                };
                criarFunctionOnBlurHora(objDivContainerFormFieldSetLegendGroupInputHora, objeto);
                //var funcaoOnBlur = function (objDivContainerFormFieldSetLegendGroupInput, objeto) { return function () { if (fnBlur(objeto)) registrarFuncao(objDivContainerFormFieldSetLegendGroupInput, objeto); } };
                //objDivContainerFormFieldSetLegendGroupInput.onblur = funcaoOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);

                jQuery(objDivContainerFormFieldSetLegendGroupInputHora).datetimepicker();
                jQuery(objDivContainerFormFieldSetLegendGroupInputHora).mask("00:00:00");

                objGroupHora.appendChild(objDivContainerFormFieldSetLegendGroupInputHora);
                objGroupHora.appendChild(iconClock);
                objDivContainerFormFieldSetLegendGroupInputHoraDiv.appendChild(objGroupHora);
                divMaior.appendChild(objDivContainerFormFieldSetLegendGroupInputHoraDiv);
            }




            return divMaior;

        };

        var criarInputCheckBox = function (objeto) {

            //console.log(objeto);         
            var objLabel = document.createElement("label");

            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            //objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control");
            objDivContainerFormFieldSetLegendGroupInput.type = "checkbox";
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;
            var idNomeInputCheckBox = gerarIdRamdomico();

            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-recurso", objeto.idRecurso);

            if (self.registrarOperador == true && objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);

                } catch (e) {

                }
            }

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInputCheckBox;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInputCheckBox;

            var valor = eval(objeto.valorEtiqueta);
            if (valor == undefined)
                valor = "";

            objDivContainerFormFieldSetLegendGroupInput.value = valor;
            objDivContainerFormFieldSetLegendGroupInput.checked = valor;
            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }
            objeto.idObjeto = idNomeInputCheckBox;

            criarFunctionOnClick(objDivContainerFormFieldSetLegendGroupInput, objeto);

            objLabel.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            var contentLabel = document.createTextNode(objeto.nomeRotulo);
            objLabel.appendChild(contentLabel);
            if (objeto.nomeAjuda) {
                var objAjuda = criarAjuda(objeto.nomeAjuda);
                objLabel.appendChild(objAjuda);
            }


            var objDivContainerFormFieldSetLegendGroupInputDivCheck = criarDivGrupoEntradaValor();
            objDivContainerFormFieldSetLegendGroupInputDivCheck.setAttribute("class", "checkbox");
            objDivContainerFormFieldSetLegendGroupInputDivCheck.appendChild(objLabel);

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInputDivCheck);

            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarSelectPlugin = function (objeto) {
            var objInicializaSelect = JSON.parse(objeto.urlRecurso);

            //combo = new Combobox();
            //combo.idObjCombo = "id" //id do elemento select
            //combo.url = url; // url pro ajax
            //combo.msgNaoEncontrado = "não encontrou registros"; //mensagem qdo nao encontra registros
            //combo.valorOption = "id"; //nome do atributo do json q ficara no valor do option
            //combo.textoOption = "nome";  //nome do atributo do json q ficara no texto do option
            //combo.nomeObjRetorno = ""; // objeto q retornará do json
            //combo.textoInicial = ""; // texto q aparecera qdo nao tem valor selecionado
            //combo.popularAoIniciar = true; //se é populado ao iniciar ou no click
            //combo.change = ""; //funcao q é executada no change

            var objDivContainerFormFieldSetLegendGroupSelectDiv = criarDivGrupoEntradaValor();
            var idNomeSelect = gerarIdRamdomico();

            var objDivContainerFormFieldSetLegendGroupSelect = document.createElement("select");
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupSelect.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupSelect.disabled = _campoDesabilitado;
            objDivContainerFormFieldSetLegendGroupSelectDiv.setAttribute("class", "un-input-md");

            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "form-control");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }
            if (objInicializaSelect.idObjCombo)
                idNomeSelect = objInicializaSelect.idObjCombo;


            objDivContainerFormFieldSetLegendGroupSelect.id = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.name = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-url", UNINTER.Helpers.montarUrlComPalavrasChave(objInicializaSelect.url));
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-msgnaoencontrado", objInicializaSelect.msgNaoEncontrado);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-valoroption", objInicializaSelect.valorOption);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-textooption", objInicializaSelect.textoOption);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-contract", objInicializaSelect.nomeObjRetorno);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-textoinicial", objInicializaSelect.textoInicial);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-popularaoiniciar", objInicializaSelect.popularAoIniciar);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-autocomplete", "true");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-change", (objInicializaSelect.change) ? objInicializaSelect.change : "");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-successcallback", "null");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-erroobjpai", (objInicializaSelect.erroObjPai) ? objInicializaSelect.erroObjPai : "");
            if (objInicializaSelect.idObjComboPai) {
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-idobjcombopai", objInicializaSelect.idObjComboPai);
            }

            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-ws", objInicializaSelect.ws);

            //se tem valor para o id > 0 esta editando
            if (objeto.id > 0 || objeto.valorEtiqueta) {
                if (!objInicializaSelect.initurl) objInicializaSelect.initurl = objInicializaSelect.url;
                if (!objInicializaSelect.initws) objInicializaSelect.initws = objInicializaSelect.ws;
                if (!objInicializaSelect.initvaloroption) objInicializaSelect.initvaloroption = objInicializaSelect.valorOption;
                if (!objInicializaSelect.inittextooption) objInicializaSelect.inittextooption = objInicializaSelect.textoOption;

                if (objInicializaSelect.usarIniturl)
                    objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-initurl", objInicializaSelect.initurl);
                else
                    objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-initurl", objInicializaSelect.initurl + "/" + objeto.valorEtiqueta + "/Get");
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-initvalor", "id");
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-initws", objInicializaSelect.initws);
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-initvaloroption", objInicializaSelect.initvaloroption);
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-inittextooption", objInicializaSelect.inittextooption);
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-initcontract", objInicializaSelect.initcontract);
            }

            if (objInicializaSelect.multiple === "multiple") {
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("multiple", objInicializaSelect.multiple);
            }

            if (self.registrarOperador == true && objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-operador", params.operador);
                    objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-id", objeto.id);
                } catch (e) {

                }
            }

            objeto.idObjeto = idNomeSelect;
            var fnChange = function (objDivContainerFormFieldSetLegendGroupSelect, objeto) { return function () { registrarFuncao(objDivContainerFormFieldSetLegendGroupSelect, objeto) } };
            objDivContainerFormFieldSetLegendGroupSelect.onchange = fnChange(objDivContainerFormFieldSetLegendGroupSelect, objeto);

            objDivContainerFormFieldSetLegendGroupSelectDiv.appendChild(objDivContainerFormFieldSetLegendGroupSelect);
            return objDivContainerFormFieldSetLegendGroupSelectDiv;
        };


        var montarUrl = function (objInicializaSelect) {
            var keyWordRegex = /\{\w+\}/g;

            if (keyWordRegex.test(objInicializaSelect.url)) {
                var matches = objInicializaSelect.url.match(keyWordRegex);
                var urlAlterada = objInicializaSelect.url;

                for (var i = 0; i < matches.length; i++) {
                    switch (matches[i]) {
                        case "{idSalaVirtual}": {
                            var idSalaVirtual = UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtual;
                            var urlAlterada = urlAlterada.replace(matches[i], idSalaVirtual);
                            break;
                        }
                        case "{idSalaVirtualOferta}": {
                            var idSalaVirtualOferta = UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOferta;
                            var urlAlterada = urlAlterada.replace(matches[i], idSalaVirtualOferta);
                            break;
                        }
                        default: {
                            var urlAlterada = urlAlterada.replace(matches[i], "0");
                            break;
                        }
                    }
                }
                return urlAlterada;
            }

            return objInicializaSelect.url;
        };

        var criarListaPalavras = function (objeto) {
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control select2ListaPalavra");
            objDivContainerFormFieldSetLegendGroupInput.type = "text";

            var idNomeInput = gerarIdRamdomico();

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.value = objeto.valorEtiqueta;
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;
            objeto.idObjeto = idNomeInput;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }

            if (objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    if (self.registrarOperador) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
                    }
                    if (params.tags) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-tags", params.tags);
                    }
                    if (params.tokenSeparators) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-tokenSeparators", params.tokenSeparators);
                    }
                    if (params.placeholder) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("placeholder", params.placeholder);
                    }


                } catch (e) {

                }
            }

            criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);


            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInputPesquisa = function (objeto) {

            var idRandomico = gerarIdRamdomico();
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivPesquisarRecurso = document.createElement("div");
            var objDivPesquisarRecursoInput = document.createElement("div");
            var objDivPesquisarRecursoBotao = document.createElement("button");
            var objPesquisarRecursoBotaoElementoi = document.createElement("i");
            var objPesquisarRecursoSpan = document.createElement("span");

            objDivPesquisarRecurso.id = "DivPesquisarRecurso_" + idRandomico;
            objDivPesquisarRecursoBotao.id = "btnPesquisarRecurso_" + idRandomico;

            objDivPesquisarRecurso.setAttribute("class", "un-input-md");

            objDivPesquisarRecursoInput.setAttribute("class", "input-group");
            objPesquisarRecursoSpan.setAttribute("class", "input-group-btn");

            objDivPesquisarRecursoBotao.setAttribute("class", "btn btn-primary");
            objPesquisarRecursoBotaoElementoi.setAttribute("class", "icon-search-plus");


            var novaJanela = true,
                placeHolder = '';


            if (objeto.urlRecurso != null) {
                try {
                    var params = JSON.parse(objeto.urlRecurso);
                    novaJanela = (params.novaJanela == true) ? true : false;
                    if (params.placeholder)
                        placeHolder = params.placeholder;
                    if (self.registrarOperador == true) {
                        objPesquisarRecursoBotaoElementoi.setAttribute("data-operador", params.operador);
                        objPesquisarRecursoBotaoElementoi.setAttribute("data-id", objeto.id);
                    }

                } catch (e) {

                }
            }

            objDivPesquisarRecursoBotao.type = "button";

            if (novaJanela)
                var funcaoClick = function () { return function () { mostrarTelaPesquisa(objeto); } };
            else
                var funcaoClick = function () { return function () { buscarPesquisa(objeto); } };
            objDivPesquisarRecursoBotao.onclick = funcaoClick();


            var objDivPesquisarRecursoTexto = document.createElement("input");
            objDivPesquisarRecursoTexto.type = "text";
            objDivPesquisarRecursoTexto.id = "txtPesquisarRecurso_" + idRandomico;
            objDivPesquisarRecursoTexto.name = objDivPesquisarRecursoTexto.id;
            objDivPesquisarRecursoTexto.value = (novaJanela) ? objeto.texto : '';
            objDivPesquisarRecursoTexto.disabled = novaJanela;
            objDivPesquisarRecursoTexto.setAttribute("class", "form-control");

            objDivPesquisarRecursoTexto.placeholder = placeHolder;

            objDivPesquisarRecursoTexto.onblur = funcaoClick();

            objeto.idObjeto = objDivPesquisarRecursoTexto.id;
            objDivPesquisarRecursoInput.appendChild(objDivPesquisarRecursoTexto);

            objDivPesquisarRecursoBotao.appendChild(objPesquisarRecursoBotaoElementoi);

            if (!_campoDesabilitado && objeto.ativa !== false)
                objPesquisarRecursoSpan.appendChild(objDivPesquisarRecursoBotao);


            objDivPesquisarRecursoInput.appendChild(objPesquisarRecursoSpan);
            objDivPesquisarRecurso.appendChild(objDivPesquisarRecursoInput);

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivPesquisarRecurso);

            if (!novaJanela) {
                var objDivPesquisarRecursoResultado = document.createElement("div");
                objDivPesquisarRecursoResultado.setAttribute("class", "un-input-md");
                objDivPesquisarRecursoResultado.id = "DivPesquisarRecursoResultado_" + idRandomico;

                var objDivPesquisarRecursoInputResultado = document.createElement("div");
                objDivPesquisarRecursoInputResultado.setAttribute("class", "input-group");

                var objPesquisarRecursoSpanResultado = document.createElement("span");
                objPesquisarRecursoSpanResultado.setAttribute("class", "input-group-btn");

                var objDivPesquisarRecursoBotaoResultado = document.createElement("button");
                objDivPesquisarRecursoBotaoResultado.setAttribute("class", "btn btn-primary");

                var objPesquisarRecursoBotaoElementoiResultado = document.createElement("i");
                objPesquisarRecursoBotaoElementoiResultado.setAttribute("class", "icon-trash-o");

                if (objeto.texto) {
                    objDivPesquisarRecurso.style.display = "none";
                }
                else {
                    objDivPesquisarRecursoResultado.style.display = "none";
                }

                var funcaoClick = function () {
                    return function () {
                        objeto.valorEtiqueta = '';
                        objeto.texto = '';

                        var idResultado = objeto.idObjeto;
                        idResultado = idResultado.replace("txtPesquisarRecurso", "DivPesquisarRecurso");
                        var obj = document.getElementById(idResultado);
                        obj.style.display = "";

                        idResultado = idResultado.replace("DivPesquisarRecurso", "DivPesquisarRecursoResultado");
                        var obj = document.getElementById(idResultado);
                        obj.value = "";
                        obj.style.display = "none";
                    }
                };
                objDivPesquisarRecursoBotaoResultado.onclick = funcaoClick();

                var objDivPesquisarRecursoTextoResultado = document.createElement("input");
                objDivPesquisarRecursoTextoResultado.type = "text";
                objDivPesquisarRecursoTextoResultado.id = "txtPesquisarRecursoResultado_" + idRandomico;
                objDivPesquisarRecursoTextoResultado.setAttribute("class", "form-control");
                objDivPesquisarRecursoTextoResultado.name = objDivPesquisarRecursoTextoResultado.id;
                objDivPesquisarRecursoTextoResultado.value = objeto.texto;
                objDivPesquisarRecursoTextoResultado.disabled = true;
                objDivPesquisarRecursoInputResultado.appendChild(objDivPesquisarRecursoTextoResultado);

                objDivPesquisarRecursoBotaoResultado.appendChild(objPesquisarRecursoBotaoElementoiResultado);
                objPesquisarRecursoSpanResultado.appendChild(objDivPesquisarRecursoBotaoResultado);
                objDivPesquisarRecursoInputResultado.appendChild(objPesquisarRecursoSpanResultado);
                objDivPesquisarRecursoResultado.appendChild(objDivPesquisarRecursoInputResultado);

                objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivPesquisarRecursoResultado);
            }


            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarSelectFixo = function (objeto) {

            var parametros = JSON.parse(objeto.urlRecurso);

            var idNomeSelect = (parametros.idObjCombo) ? parametros.idObjCombo : gerarIdRamdomico();

            var objTextoLabel = document.createTextNode(objeto.nomeRotulo);
            var objDivJanelaCriterioPesquisaDialogoDiv = document.createElement("div");

            var objDivContainerFormFieldSetLegendGroupSelect = document.createElement("select");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "un-input-md");
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupSelect.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupSelect.disabled = _campoDesabilitado;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "form-control");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);

            if (!objeto.valorEtiqueta) {
                var option = document.createElement("option");
                option.innerHTML = "";
                option.setAttribute("value", "");
                option.selected = "selected";
                option.disabled = "disabled";
                objDivContainerFormFieldSetLegendGroupSelect.appendChild(option);
            }

            var url = parametros.url;
            try {
                //verifica se nao tem dependente
                if (parametros.idTabelaColunaPai != null && parametros.idTabelaColunaPai != void (0)) {

                    if (objFiltroGrid.hasOwnProperty(parametros.idTabelaColunaPai)) {

                        url = url.replace("{valor}", objFiltroGrid[parametros.idTabelaColunaPai].valor);
                    }
                    else {
                        return '<p class="text-danger">' + parametros.msgPaiNaoSelecionado + '</p>';

                    }
                }
            }
            catch (e) { console.warn(e); }


            objDivContainerFormFieldSetLegendGroupSelect.id = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.name = idNomeSelect;
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("class", "form-control");
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("placeholder", "Selecione");

            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-id", objeto.id);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-operador", parametros.operador);
            objDivContainerFormFieldSetLegendGroupSelect.setAttribute("data-nome", objeto.nomeRotulo);
            if (parametros.filtroFixo != null && parametros.filtroFixo != "") {
                objDivJanelaCriterioPesquisaDialogoCorpoInput.setAttribute("data-filtrofixo", parametros.filtroFixo);
            }

            for (var i = 0; i < parametros.data.length; i++) {
                var option = document.createElement("option");
                option.setAttribute("value", parametros.data[i].value);
                option.innerHTML = parametros.data[i].label;

                objDivContainerFormFieldSetLegendGroupSelect.appendChild(option);
            }
            if (objeto.valorEtiqueta)
                objDivContainerFormFieldSetLegendGroupSelect.value = objeto.valorEtiqueta;

            if (parametros.multiple === "multiple") {
                objDivContainerFormFieldSetLegendGroupSelect.setAttribute("multiple", parametros.multiple);

                if (objeto.valorEtiqueta) {
                    objeto.valorEtiqueta = objeto.valorEtiqueta.split(", ");

                    objDivContainerFormFieldSetLegendGroupSelect.value = null; // Reset pre-selected options (just in case)
                    var multiLen = objDivContainerFormFieldSetLegendGroupSelect.options.length;
                    for (var i = 0; i < multiLen; i++) {
                        if (objeto.valorEtiqueta.indexOf(objDivContainerFormFieldSetLegendGroupSelect.options[i].value) >= 0) {
                            objDivContainerFormFieldSetLegendGroupSelect.options[i].selected = true;
                        }
                    }
                }
            }

            objeto.idObjeto = idNomeSelect;

            var fnChange = function (objDivContainerFormFieldSetLegendGroupSelect, objeto) { return function () { registrarFuncao(objDivContainerFormFieldSetLegendGroupSelect, objeto) } };
            objDivContainerFormFieldSetLegendGroupSelect.onchange = fnChange(objDivContainerFormFieldSetLegendGroupSelect, objeto);


            objDivJanelaCriterioPesquisaDialogoDiv.appendChild(objDivContainerFormFieldSetLegendGroupSelect);
            /* objDivGrupo.appendChild(objLabel);*/
            var exibirBtnLimpar = false;

            if (parametros.exibirBtnLimpar != null) {
                if (objeto.ativa === true && !_campoDesabilitado)
                    exibirBtnLimpar = (parametros.exibirBtnLimpar) == "true" ? true : false;
            }
            else exibirBtnLimpar = true;

            if (exibirBtnLimpar) {

                objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "un-input-md input-group");
                var a = document.createElement("a");
                a.href = "javascript: void(0);";
                a.innerHTML = '<i class="icon-times" title="limpar dados"></i>';
                a.setAttribute('class', "pull-right");

                a.onclick = limparItemFiltro(objDivContainerFormFieldSetLegendGroupSelect, true);
                var span = document.createElement("span");
                span.setAttribute("class", "input-group-btn");
                span.style.padding = "5px";
                span.style.verticalAlign = "bottom";
                span.appendChild(a);
                objDivJanelaCriterioPesquisaDialogoDiv.appendChild(span);
            }
            else objDivJanelaCriterioPesquisaDialogoDiv.setAttribute("class", "un-input-md");

            var validarSelects = true;

            var objFnValorPesquisar = function (objDivContainerFormFieldSetLegendGroupSelect, idNomeSelect) {
                return function () {
                    filtroFuncaoBotaoOk(objDivContainerFormFieldSetLegendGroupSelect, idNomeSelect, parametros.operador, nome);
                }
            };
            var objDivJanelaCriterioPesquisaDialogoBotaoConfirmar = document.createElement("button");
            objDivJanelaCriterioPesquisaDialogoBotaoConfirmar.onclick = objFnValorPesquisar(objDivContainerFormFieldSetLegendGroupSelect, idNomeSelect);

            return objDivJanelaCriterioPesquisaDialogoDiv;
        };

        var criarUpload = function (objeto) {

            var idNomeInput = "uploadArquivoViewGenerica";
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();

            if (!_campoDesabilitado && objeto.ativa != false) {

                objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
                objDivContainerFormFieldSetLegendGroupInputDiv.id = idNomeInput;

            }
            objeto.idObjeto = idNomeInput;
            //criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);                                    
            //objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);

            if (_nomeFuncaoUploadArquivo != null) {
                _nomeFuncaoUploadArquivo(objeto);
            }

            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };

        var criarInputRadioFixo = function (objeto) {
            var parametros = JSON.parse(objeto.urlRecurso);

            var objDivContainerFormFieldSetLegendGroupInputDivCheck = criarDivGrupoEntradaValor();
            var idNomeInputCheckBox = gerarIdRamdomico();
            for (var i = 0; i < parametros.data.length; i++) {
                var objContainerLabel = criarDivGrupoEntradaValor();
                var objLabel = document.createElement("label");
                var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
                //objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control");
                objDivContainerFormFieldSetLegendGroupInput.type = "radio";
                if (objeto.ativa === false) {
                    objDivContainerFormFieldSetLegendGroupInput.disabled = true;
                }
                else
                    objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;


                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id-recurso", objeto.idRecurso);

                if (self.registrarOperador == true && objeto.urlRecurso != null) {
                    try {
                        var params = JSON.parse(objeto.urlRecurso);
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);

                    } catch (e) {

                    }
                }

                objDivContainerFormFieldSetLegendGroupInput.name = idNomeInputCheckBox;
                objDivContainerFormFieldSetLegendGroupInput.id = idNomeInputCheckBox;

                objDivContainerFormFieldSetLegendGroupInput.value = parametros.data[i].value;

                if (objeto.valorEtiqueta == parametros.data[i].value)
                    objDivContainerFormFieldSetLegendGroupInput.checked = true;

                if (objeto.obrigatorio) {
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
                }
                objeto.idObjeto = idNomeInputCheckBox;

                criarFunctionOnClick(objDivContainerFormFieldSetLegendGroupInput, objeto);

                objLabel.appendChild(objDivContainerFormFieldSetLegendGroupInput);
                var contentLabel = document.createTextNode(parametros.data[i].label);
                objLabel.appendChild(contentLabel);
                if (objeto.nomeAjuda) {
                    var objAjuda = criarAjuda(objeto.nomeAjuda);
                    objLabel.appendChild(objAjuda);
                }


                objContainerLabel.appendChild(objLabel);
                objContainerLabel.setAttribute("class", "radio");
                objDivContainerFormFieldSetLegendGroupInputDivCheck.appendChild(objContainerLabel);
            }



            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInputDivCheck);

            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };
        var criarModal = function (objeto, elemento, classe) {

            objeto.idObjeto = gerarIdRamdomico();

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInputModal = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupLabel = document.createElement(elemento);
            objDivContainerFormFieldSetLegendGroupLabel.setAttribute("class", classe);
            objDivContainerFormFieldSetLegendGroupLabel.innerHTML = objeto.labelAnexarArquivos != null ? objeto.labelAnexarArquivos : 'Anexar Arquivos';
            objDivContainerFormFieldSetLegendGroupLabel.style.cursor = "pointer";

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupLabel);

            var funcaoClick = function (objeto) {

                return function () {
                    if (_nomeFuncaoOpenModal != null) {
                        _nomeFuncaoOpenModal(objeto, criarUploadDinamico(objeto));
                    }
                }
            };

            objDivContainerFormFieldSetLegendGroupLabel.onclick = funcaoClick(objeto);


            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInputModal);
            // objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(criarUploadDinamico(objeto));
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };
        var criarUploadDinamico = function (objeto) {

            var objDivContainerFormFieldSetLegendGroupInputDivPai = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInputDivUpload = criarDivGrupoEntradaValor();
            var objDivContainerFormFieldSetLegendGroupInputDivListaDoc = criarDivGrupoEntradaValor();
            if (!_campoDesabilitado && objeto.ativa != false) {


            }

            objDivContainerFormFieldSetLegendGroupInputDivUpload.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInputDivUpload.id = "divUpload" + objeto.idObjeto;

            objDivContainerFormFieldSetLegendGroupInputDivListaDoc.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInputDivListaDoc.id = "divListaDocumentos" + objeto.idObjeto;

            if (_nomeFuncaoUploadArquivo != null) {
                _nomeFuncaoUploadArquivo(objeto);
            }
            objDivContainerFormFieldSetLegendGroupInputDivPai.appendChild(objDivContainerFormFieldSetLegendGroupInputDivUpload);
            objDivContainerFormFieldSetLegendGroupInputDivPai.appendChild(objDivContainerFormFieldSetLegendGroupInputDivListaDoc);

            return objDivContainerFormFieldSetLegendGroupInputDivPai;
        };
        /*
        var criarInputCheckBoxComListaPalavras = function (objeto) {
            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();

            //lista de palavras            
            var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");            
            objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control select2ListaPalavra");
            objDivContainerFormFieldSetLegendGroupInput.type = "text";
            var idNomeInput = gerarIdRamdomico();            

            objDivContainerFormFieldSetLegendGroupInput.name = idNomeInput;
            objDivContainerFormFieldSetLegendGroupInput.id = idNomeInput;
            

            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md"); 

            if (!objeto.valorEtiqueta) {
                var objCheckbox = document.createElement("input");            
                objCheckbox.type = "checkbox";
                if (objeto.ativa === false) {
                    objCheckbox.disabled = true;
                }
                else
                    objCheckbox.disabled = _campoDesabilitado;

                var idNomeInputCheckBox = gerarIdRamdomico();
                objCheckbox.name = idNomeInputCheckBox;
                objCheckbox.id = idNomeInputCheckBox;

                var funcaoOnBlurCheck = function (objetoC, objDep) {
                    return function () {
                        var check = $(objetoC).is(":checked");
                        if (check) {
                            $(objDep).removeClass("hidden");
                        }
                        else {
                            $(objDep).val("");
                            $(objDep).trigger("blur");
                            $(objDep).addClass("hidden");
                        }
                    }
                };
                objCheckbox.onblur = funcaoOnBlurCheck(objCheckbox, objDivContainerFormFieldSetLegendGroupInput);

                var objLabel = document.createElement("label");
                objLabel.appendChild(objCheckbox);
                var contentLabel = document.createTextNode(objeto.nomeRotulo);
                objLabel.appendChild(contentLabel);

            
                var objDivContainerFormFieldSetLegendGroupInputDivCheck = criarDivGrupoEntradaValor();
                objDivContainerFormFieldSetLegendGroupInputDivCheck.setAttribute("class", "checkbox");
                objDivContainerFormFieldSetLegendGroupInputDivCheck.appendChild(objLabel);
                objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInputDivCheck);
            }
            
            objDivContainerFormFieldSetLegendGroupInput.value = objeto.valorEtiqueta;
            if (objeto.ativa === false) {
                objDivContainerFormFieldSetLegendGroupInput.disabled = true;
            }
            else
                objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;
            objeto.idObjeto = idNomeInput;

            if (objeto.obrigatorio) {
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
            }

            if (objeto.urlRecurso != null) {
                try {                    
                    var params = JSON.parse(objeto.urlRecurso);
                    if (self.registrarOperador) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-operador", params.operador);
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-id", objeto.id);
                    }
                    if (params.tags) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-tags", params.tags);
                    }
                    if (params.tokenSeparators) {
                        objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-tokenSeparators", params.tokenSeparators);
                    }
                    
                } catch (e) {

                }                
            }
            
            criarFunctionOnBlur(objDivContainerFormFieldSetLegendGroupInput, objeto);
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInput);
            
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        };
        */
        var criarListaCheckbox = function (objeto) {
            var parametros = JSON.parse(objeto.urlRecurso);
            
            var objDivContainerFormFieldSetLegendGroupInputDivCheck = criarDivGrupoEntradaValor();
            var idElementoHidden = gerarIdRamdomico();
            for (var i = 0; i < parametros.data.length; i++) {                
                var objContainerLabel = criarDivGrupoEntradaValor();
                var objLabel = document.createElement("label");            
                var objDivContainerFormFieldSetLegendGroupInput = document.createElement("input");
                //objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "form-control");
                objDivContainerFormFieldSetLegendGroupInput.type = "checkbox";
                if (objeto.ativa === false) {
                    objDivContainerFormFieldSetLegendGroupInput.disabled = true;
                }
                else
                    objDivContainerFormFieldSetLegendGroupInput.disabled = _campoDesabilitado;
                

                
                objDivContainerFormFieldSetLegendGroupInput.name = gerarIdRamdomico();
                objDivContainerFormFieldSetLegendGroupInput.id = gerarIdRamdomico();
                objDivContainerFormFieldSetLegendGroupInput.setAttribute("class", "inputCheckboxList" + idElementoHidden);
                objDivContainerFormFieldSetLegendGroupInput.value = parametros.data[i].value;

                if (objeto.valorEtiqueta == parametros.data[i].value)
                    objDivContainerFormFieldSetLegendGroupInput.checked = true;

                if (objeto.obrigatorio) {
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-rule-required", true);
                    objDivContainerFormFieldSetLegendGroupInput.setAttribute("data-msg-required", "Essa informação é obrigatória.");
                }
                

                //criarFunctionOnClick(objDivContainerFormFieldSetLegendGroupInput, objeto);
                var objFnValorPesquisar = function (_idElementoHidden) {
                    return function () {
                        
                        var selecionados = $(".inputCheckboxList" + _idElementoHidden + ":checked").map(function () {
                            return $(this).val();
                        }).get().join(";");
                        if (selecionados != "" && selecionados != null)
                            $("#" + _idElementoHidden).val(selecionados);
                        else $("#" + _idElementoHidden).val("");
                    }
                };
                objDivContainerFormFieldSetLegendGroupInput.onclick = objFnValorPesquisar(idElementoHidden);

                objLabel.appendChild(objDivContainerFormFieldSetLegendGroupInput);
                var contentLabel = document.createTextNode(parametros.data[i].label);
                objLabel.appendChild(contentLabel);
                if (objeto.nomeAjuda) {
                    var objAjuda = criarAjuda(objeto.nomeAjuda);
                    objLabel.appendChild(objAjuda);
                }


                objContainerLabel.appendChild(objLabel);
                objContainerLabel.setAttribute("class", "checkbox");
                objDivContainerFormFieldSetLegendGroupInputDivCheck.appendChild(objContainerLabel);
            }

            objeto.idObjeto = idElementoHidden;
            var inputHidden = document.createElement("input");
            
            inputHidden.type = "hidden";
            inputHidden.setAttribute("class", "form-control inputFiltroGrid inputFiltroCheckbox");
            inputHidden.id = idElementoHidden;
            inputHidden.nome = idElementoHidden;
            
            
            inputHidden.setAttribute("data-id", objeto.id);
            inputHidden.setAttribute("data-id-tipo-rotulo", objeto.idTipoRotulo);
            inputHidden.setAttribute("data-nome-tipo-rotulo", objeto.nomeTipoRotulo);
            inputHidden.setAttribute("data-id-recurso", objeto.idRecurso);
        
            if (self.registrarOperador == true && objeto.urlRecurso != null) {
                try {                    
                    inputHidden.setAttribute("data-operador", parametros.operador);
                
                } catch (e) {

                }
            }            

            var objDivContainerFormFieldSetLegendGroupInputDiv = criarDivGrupoEntradaValor();
            objDivContainerFormFieldSetLegendGroupInputDiv.setAttribute("class", "un-input-md");
            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(objDivContainerFormFieldSetLegendGroupInputDivCheck);

            objDivContainerFormFieldSetLegendGroupInputDiv.appendChild(inputHidden);
            
            return objDivContainerFormFieldSetLegendGroupInputDiv;
        }; 

        var criarFunctionOnBlur = function (objeto, objetoUsr) {

            var funcaoOnBlur = function (objeto) { return function () { if (!objeto.readOnly) registrarFuncao(objeto, objetoUsr); } };
            objeto.onblur = funcaoOnBlur(objeto);
        };

        var criarFunctionOnClick = function (objeto, objetoUsr) {
            var funcaoOnBlur = function (objeto) { return function () { registrarFuncao(objeto, objetoUsr); } };
            objeto.onclick = funcaoOnBlur(objeto);
        };

        var criarFunctionOnChange = function (objeto, objetoUsr) {
            var funcaoOnChange = function (objeto) { return function () { registrarFuncao(objeto, objetoUsr); } };
            objeto.onChange = funcaoOnChange(objeto);
        };

        var registrarFuncao = function (objeto, objetoUsr) {

            var obj = document.getElementById(objeto.id);
            //se for checkbox
            if (objetoUsr.idTipoRecurso == 1) {
                objetoUsr.valorEtiqueta = obj.checked;
            }
            else if (objetoUsr.idTipoRecurso == 6) { //select
                objetoUsr.valorEtiqueta = $("#" + objetoUsr.idObjeto).map(function (item) { if (UNINTER.Helpers.stringValida($(this).val())) return $(this).val() }).get().join(", ");
            }  
            
            else if (objetoUsr.idTipoRecurso == 7) { // se for data hora
                var id = obj.id;
                if (id.indexOf("Hora") === -1) {
                    // se for a data
                    var hora = document.getElementById(obj.id + "Hora");
                    if (obj.value != "" && hora)
                        objetoUsr.valorEtiqueta = obj.value + " " + hora.value;
                    else
                        objetoUsr.valorEtiqueta = obj.value;
                }
                else {
                    //se for hora
                    var data = document.getElementById(id.split("Hora")[0]);
                    if (data.value != "")
                        objetoUsr.valorEtiqueta = data.value + " " + obj.value;
                    else
                        objetoUsr.valorEtiqueta = data.value;
                }
            }
            else if (objetoUsr.idTipoRecurso == 25) { //lista de text
                objetoUsr.valorEtiqueta = $(".inputList_" + objetoUsr.idObjeto).map(function (item) { if (UNINTER.Helpers.stringValida($(this).val())) return $(this).val() }).get().join(", ");
            }
            else if (objetoUsr.idTipoRecurso == 24) { //select fixo
                objetoUsr.valorEtiqueta = $("#" + objetoUsr.idObjeto).map(function (item) { if (UNINTER.Helpers.stringValida($(this).val())) return $(this).val() }).get().join(", ");
            }
            else if (objetoUsr.idTipoRecurso == 38) {//radio                
                objetoUsr.valorEtiqueta = $("input:radio[name=" + obj.name + "]:checked").val();
            }
            else {
                objetoUsr.valorEtiqueta = obj.value;
            }
            objetoUsr.texto = objetoUsr.valorEtiqueta;


            if (!validarObjeto(objetoUsr)) {
                if (_nomeFuncaoErroValidacao != null) {
                    _nomeFuncaoErroValidacao(objetoUsr);
                }
                else {
                    console.error("Erro na validação do formulário");
                }
            }
            else {
                if (_nomeFuncaoBlur != null) {

                    _nomeFuncaoBlur(objetoUsr);
                }
            }
        };

        var gerarIdRamdomico = function () {
            var ramdomicoGerado = "";
            var valorRandomico = "";
            for (var x = 0; x < 10; x++) {
                var valorRandomico = Math.floor((Math.random() * (122 - 97) + 97));
                ramdomicoGerado += String.fromCharCode(valorRandomico);
            }
            return ramdomicoGerado;
        };

        //valida objeto antes do ajax. é possivel uma funcao diferente para cada recurso
        var validarObjeto = function (objetoUsr) {

            //checkbox trata diferente
            if (objetoUsr.idTipoRecurso == 1) {
                var check = document.getElementById(objetoUsr.idObjeto);

                if (check.checked == true || objetoUsr.obrigatorio === false) {
                    return true;
                }
            }
            else {


                if (objetoUsr.obrigatorio === false || objetoUsr.valorEtiqueta != "") {
                    return true;
                }
            }
            return false;

        };

        var criarComponenteEdicao = function (objeto) {
            switch (objeto.idTipoRecurso) {
                case 1:
                    return criarInputCheckBox(objeto);
                    break;
                case 2: //input texto                
                    return criarInputTexto(objeto);
                    break;
                case 3: //input pesquisa capes
                    return criarInputPesquisa(objeto);
                    break;
                case 4: //legenda
                    return criarLegendaForm(objeto);
                    break;
                case 5: //input data
                    return criarInputData(objeto);
                    break;
                case 6: //Select
                    return criarSelectPlugin(objeto);
                    break;
                case 7: //input dataHora
                    return criarInputDataHora(objeto);
                    break;
                case 8: //input palavrapasse
                    return criarListaPalavras(objeto);
                    break;
                case 9: //upload arquivo
                    return criarUpload(objeto);
                    break;
                case 10: //link                    
                    return criarInputTexto(objeto);
                    break;
                case 11: //textarea
                    return criarInputTextarea(objeto, false);
                    break;
                case 12: //tinymce
                    return criarInputTextarea(objeto, true);
                    break;
                case 14: //tinymce
                    return criarInpuHidden(objeto, true);
                    break;
                case 16: //input uppercase
                    return criarInputTexto(objeto);
                    break;

                case 19: //input numerico
                    return criarInputNumerico(objeto);
                    break;
                case 24: //Select fixo
                    return criarSelectFixo(objeto);
                    break;
                case 25: //lista de inputs
                    return criarListaInputTexto(objeto);
                    break;
                case 26: //input readyonly
                    return criarInputTexto(objeto);
                    break;
                case 27: //input cpf
                    return criarInputTexto(objeto);
                    break;
                case 28: //input cnpj
                    return criarInputTexto(objeto);
                    break;
                case 29: //lista de checkbox fixo
                    return criarListaCheckbox(objeto);
                    break;
                case 30: //checkbox com input text... se check selecionado, habilita input text                    
                    break;
                case 31: //checkbox com lista de palavras                    
                    break;
                case 32: //textarea readonly
                    return criarInputTextarea(objeto, false);
                    break;
                case 33: //input tabela de inputs
                    return criarTabelaInputDisciplina(objeto);
                case 34: //input cep
                    return criarInputTexto(objeto);
                    break;
                case 35: //input telefone
                    return criarInputTexto(objeto);
                    break;
                case 36: //input email
                    return criarInputTexto(objeto);
                    break;
                case 38: //radio fixo
                    return criarInputRadioFixo(objeto);
                    break;
                case 39: //linha divisoria
                    return criarLinhaDivisoria(objeto);
                case 40: //input text com situação do lado
                    return criarModal(objeto, "label", "un-label");
                    break;
                case 41: //div de exibicao..
                    return criarRecursoDiv(objeto)
                    break;
                case 42: //ano datepicker
                    return criarInputTexto(objeto)
                    break;
                case 43: //input text com situação do lado
                    return criarModal(objeto, 'button', 'btn-primary');
            }
        };

        this.criar = function () {

            for (var x = 0; x < objObjeto.length; x++) {
                var linha = objObjeto[x];
                var legenda = linha.nomeRotulo;

                var objDivContainerFormFieldSet = criarConjuntoCampo();
                var objDivContainerFormFieldSetLegend = criarLegenda(legenda);

                objDivContainerFormFieldSet.appendChild(objDivContainerFormFieldSetLegend);

                for (var y = 0; y < linha.filhos.length; y++) {
                    var filho = linha.filhos[y];

                    var objFilho = self.criarFilho(filho);
                    objDivContainerFormFieldSet.appendChild(objFilho);
                }

                objDivContainerForm.appendChild(objDivContainerFormFieldSet);
            }

            objDivContainer.appendChild(objDivContainerForm);

            return objDivContainer;
        };

        this.criarFilho = function (filho) {

            var objDivContainerFormFieldSetLegendGroup = criarDivGrupo();

            var tipoRecursoTabela = 33;
            var tipoRecursoHidden = 14;
            var tipoRecursoCheckbox = 1;
            var tipoRecursoLinha = 39;
            var tipoRecursoLegenda = 4;
            var tipoRecursoDiv = 41;
            var tiposRecursoSemRotulo = [tipoRecursoHidden, tipoRecursoTabela, tipoRecursoLinha, tipoRecursoCheckbox, tipoRecursoLegenda, tipoRecursoDiv];

            if (self.exibirRotulo && tiposRecursoSemRotulo.indexOf(filho.idTipoRecurso) < 0) {//diferente de hidden e checkbox

                var objDivContainerFormFieldSetLegendGroupLabel = criarRotuloAjuda(filho.nomeRotulo, filho.nomeAjuda);
                objDivContainerFormFieldSetLegendGroup.appendChild(objDivContainerFormFieldSetLegendGroupLabel);

            }
            var objComponenteEdicao;
            var objMensagemDatas;

            objComponenteEdicao = criarComponenteEdicao(filho);
            objMensagemDatas = document.createElement("div");
            objMensagemDatas.setAttribute("id", "mensagemDatas");

            if (objComponenteEdicao) {
                if (objComponenteEdicao.id == 'divDatas') {
                    objDivContainerFormFieldSetLegendGroup.insertBefore(objMensagemDatas, objDivContainerFormFieldSetLegendGroup.firstChild);
                }
                if (objComponenteEdicao)
                    objDivContainerFormFieldSetLegendGroup.appendChild(objComponenteEdicao);
            }

            if (filho.obrigatorio === true)
                _camposObrigatorios.push(filho);

            arrFilhos.push(filho);
            return objDivContainerFormFieldSetLegendGroup;
        }

        //Chama a tela de pesquisa
        var mostrarTelaPesquisa = function (objeto) {
            try {
                var paramRecurso = JSON.parse(objeto.urlRecurso);
                var url = paramRecurso.url;

                var calback = function () {
                    return functionCallback(objeto);
                }


                var fnCall = function (objeto) { return function () { functionCallback(objeto); } };


                UNINTER.viewGenerica.novaJanela(url, fnCall(objeto));
            }
            catch (e) {
                console.error(e);
            }
        };
        //consulta pesquisa
        var buscarPesquisa = function (objeto) {
            try {

                var obj = document.getElementById(objeto.idObjeto);
                if (obj.value != "") {
                    var paramRecurso = JSON.parse(objeto.urlRecurso);

                    var url = paramRecurso.url;
                    url = url.replace('{valor}', obj.value);

                    var URL = UNINTER.AppConfig.UrlWs(paramRecurso.ws) + url;
                    var opcoes = { url: URL, type: 'GET', data: null, async: false };

                    var retorno = UNINTER.Helpers.ajaxRequestError(opcoes);
                    if (retorno.status == 200) {
                        var contract = retorno.resposta[paramRecurso.contract];
                        objeto.valorEtiqueta = contract[paramRecurso.valor];
                        objeto.texto = contract[paramRecurso.texto];

                        var idResultado = objeto.idObjeto;
                        idResultado = idResultado.replace("txtPesquisarRecurso", "txtPesquisarRecursoResultado");
                        var obj = document.getElementById(idResultado);
                        obj.value = objeto.texto;
                        obj.style.display = '';

                        var idResultado = objeto.idObjeto;
                        idResultado = idResultado.replace("txtPesquisarRecurso", "DivPesquisarRecurso");
                        var obj = document.getElementById(idResultado);
                        obj.style.display = "none";

                        idResultado = idResultado.replace("DivPesquisarRecurso", "DivPesquisarRecursoResultado");
                        var obj = document.getElementById(idResultado);
                        obj.style.display = "";

                        _nomeFuncaoBlur(objeto);
                    }
                    else {
                        var obj = document.getElementById(objeto.idObjeto);
                        setMensagem(obj, "Não há registros com os valores informados");
                    }
                }
                else {
                    var obj = document.getElementById(objeto.idObjeto);
                    setMensagem(obj, "informe um valor");
                }
            }
            catch (e) {
                console.error(e);
            }
        };

        var functionCallback = function (objeto) {
            try {

                var paramRecurso = JSON.parse(objeto.urlRecurso);
                var rotina = paramRecurso.rotina;
                var lbValor = paramRecurso.valor;
                var lbTexto = paramRecurso.texto;

                var retornoPesquisa = UNINTER.objetoSelecionado[rotina];
                if (retornoPesquisa) {
                    var valor = retornoPesquisa[lbValor];
                    objeto.valorEtiqueta = retornoPesquisa[lbValor];
                    objeto.texto = retornoPesquisa[lbTexto];
                    var obj = document.getElementById(objeto.idObjeto);
                    obj.value = objeto.texto;
                    _nomeFuncaoBlur(objeto);
                }
            }
            catch (e) {
                console.error(e);
            }
        };

        var validarInputData = function (objeto) {
            var parametros = JSON.parse(objeto.urlRecurso);

            if (parametros.idRecursoDependente != "" && parametros.validacao != "") {

                var objetoDependente = buscarObjeto(parametros.idRecursoDependente);

                if (objetoDependente) {
                    var verificacao = eval('objeto.valorEtiqueta' + parametros.validacao + 'objetoDependente.valorEtiqueta ');
                }
                else {
                    console.warn("elemento nao encontrado");
                }

                //if(objeto.valorEtiqueta )
            }
            return true;
        };

        var buscarObjeto = function (idProcurado) {

            for (var x = 0; x < objObjeto.length; x++) {
                var linha = objObjeto[x];
                for (var y = 0; y < linha.filhos.length; y++) {
                    var filho = linha.filhos[y];
                    if (filho.idRecurso == idProcurado) {
                        return filho;
                    }
                }
            }

            return false;
        };

        this.validarCamposObrigatorios = function () {
            for (var i = 0; i < _camposObrigatorios.length; i++) {
                var idObjeto = _camposObrigatorios[i].idObjeto;
                if (document.getElementById(idObjeto).value == "")
                    return false
            }
            return true;
        };

        this.getObjetosObrigatorios = function () {
            return _camposObrigatorios;
        };

        this.getFiltro = function (seletor) {

            return this.getFiltrosEFiltrosAmigaveis(seletor).arrayFiltros;

            //var arrayFiltro = Array();

            //var el = $(seletor + ' input,select').each(function (i, obj) {
            //    var item = $(obj);

            //    if (item.data('id') != void (0) && item.data('id') > 0 && item.data('operador') != void (0) && item.data('operador') > 0)
            //    {
            //        var valor = item.val();
            //        if(valor != null && valor != void(0) && valor.length >  0)
            //        {
            //            var filtro = item.data('id') + ',' + item.data('operador') + ',' + valor;
            //            arrayFiltro.push(filtro);
            //        }
            //    }
            //});

            //if (arrayFiltro.length > 0) {
            //    return arrayFiltro.join("|");
            //} else {
            //    return null;
            //}
        };

        this.getFiltrosEFiltrosAmigaveis = function (seletor) {

            var arrayFiltros = Array();
            var arrayFiltrosAmigaveis = Array();

            var el = $(seletor + ' input, ' + seletor + ' select').each(function (i, obj) {
                var item = $(obj);

                if (item.hasClass("ignoreOnFilter")) {
                    return true;
                }

                var itemId = item.attr('id');
                var itemDataId = item.data('id');
                var itemDataOperador = item.data('operador');

                if (itemDataId != void (0) && itemDataId > 0 && itemDataOperador != void (0) && itemDataOperador > 0) {
                    var valor = item.val();
                    if(jQuery(item).attr("type") == "checkbox" ){                                                   
                        if(item.is(":checked"))
                            valor = (item.val()) ? item.val() : "true";
                        else valor = "";
                    }

                    var valorNaoNulo = (valor != null && valor != void (0) && valor.length > 0);



                    if (itemId.indexOf("_DataInicio") > 0) {
                        valor = obterFiltroCompletoDeData(itemId);
                    }

                    if (valorNaoNulo) {
                        var filtro = itemDataId + ',' + itemDataOperador + ',' + valor;
                        arrayFiltros.push(filtro);
                    }

                    try {
                        if (jQuery(item[0]).hasClass('datepicker')) {
                            var labelFiltro = jQuery(item[0].parentElement.parentElement.parentElement).find('label:first').text();
                            var valorDatas = valorNaoNulo ? valor : "Nenhum valor selecionado";

                            arrayFiltrosAmigaveis.push({ label: labelFiltro, valor: valorDatas.replace('♦', ' até ') });
                        }
                        else if (jQuery(item[0]).hasClass('select2-offscreen')) {
                            var labelFiltro = jQuery(item[0].parentElement.parentElement).find('label:first').text();
                            var valorFiltro = "Nenhum valor selecionado";

                            if (valorNaoNulo) {
                                valorFiltro = "";

                                jQuery('#' + item.attr('id') + ' :selected').each(function (i, selected) {
                                    valorFiltro += $(selected).text() + ', ';
                                });

                                valorFiltro = valorFiltro.substring(0, valorFiltro.length - 2)
                            }

                            arrayFiltrosAmigaveis.push({ label: labelFiltro, valor: valorFiltro });
                        }
                        /*else if (jQuery(item[0]).attr("type") == "checkbox") {                                                  
                            var labelFiltro = jQuery(item[0].parentElement.parentElement).find('label:first').text();
                            var valorFiltro = (jQuery(item[0]).is(":checked")) ? 'Sim' : 'Não";
                            

                            if (labelFiltro != null && labelFiltro != "") {
                                arrayFiltrosAmigaveis.push({ label: labelFiltro, valor: valorFiltro });
                            }

                        }*/
                        else {
                            var labelFiltro = jQuery(item[0].parentElement.parentElement).find('label:first').text();
                            var valorFiltro = valorNaoNulo ? valor : "Nenhum valor selecionado";

                            if (labelFiltro != null && labelFiltro != "") {
                                arrayFiltrosAmigaveis.push({ label: labelFiltro, valor: valorFiltro });
                            }

                        }
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            });

            var retorno = {
                arrayFiltros: null,
                arrayFiltrosAmigaveis: null
            };

            if (arrayFiltros.length > 0) {
                retorno.arrayFiltros = arrayFiltros.join("|");
            }
            if (arrayFiltrosAmigaveis.length > 0) {
                retorno.arrayFiltrosAmigaveis = "";
                for (var i = 0; i < arrayFiltrosAmigaveis.length; i++) {
                    retorno.arrayFiltrosAmigaveis += arrayFiltrosAmigaveis[i].label + ": " +
                        arrayFiltrosAmigaveis[i].valor + "|";
                }
            }

            return retorno;
        };

        var obterFiltroCompletoDeData = function (idDataInicio) {
            var id = idDataInicio.substring(0, idDataInicio.indexOf('_DataInicio'));
            var idHoraInicio = id + "_HoraInicio";
            var idDataFim = id + "_DataFim";
            var idHoraFim = id + "_HoraFim";

            var valorDataInicio = jQuery("#" + idDataInicio).val();
            var valorHoraInicio = jQuery("#" + idHoraInicio).val();
            var valorDataFim = jQuery("#" + idDataFim).val();
            var valorHoraFim = jQuery("#" + idHoraFim).val();

            return valorDataInicio + " " + valorHoraInicio + "♦" + valorDataFim + " " + valorHoraFim;
        };

        var setMensagem = function (elemento, mensagem) {

            var element = $(elemento);
            var error = $("<span>").html(mensagem);
            // Define o elemento que receberá a mensagem de erro na validação dos inputs            
            var group = $(element).closest('div.form-group');
            $(group).find('span.help-block').remove();
            error.addClass('help-block').insertAfter(element);
            group.removeClass("has-success").addClass("has-error");

            setTimeout(function () {
                $(group).find('span.help-block').remove();
                group.removeClass("has-success").removeClass("has-error");
            }, 4000);
        }

        this.getFilhos = function () {
            return arrFilhos;
        }
        this.setCampoDesabilitado = function (campoDesabilitado) {
            _campoDesabilitado = campoDesabilitado;
        }


        return true;
    };

    var limparItemFiltro = function (elemento, select) {
        return function () {
            var elem = $(elemento);
            elem.val("");

            if (select === true)
                elem.select2("val", "");

            //
            if (elem.attr("type") == "hidden") {
                var id = elem.attr("id");
                $(".inputCheckboxList" + id).prop("checked", false);
            }
        }
    };



    return clsFormEtiqueta;
})();