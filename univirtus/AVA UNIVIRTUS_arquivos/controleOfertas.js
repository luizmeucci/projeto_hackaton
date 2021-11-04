var controleOferta = (function () {
    var classOferta = function ()
    {
        this.idSalaVirtualOfertaInicializar = 0;
        this.ajaxUrlConsumo = UNINTER.AppConfig.UrlWs("AVA") + "SalaVirtualOferta/{valor}/SalaVirtual";
        this.ajaxUrlConsumoCriptografado = UNINTER.AppConfig.UrlWs("AVA") + "SalaVirtualOferta/0/SalaVirtual?id={valor}";
        this.idObjDOM = "divComboSalaVirtualOferta";
        

        this.atributoJSONLista = "salaVirtualOfertas";
        this.atributoJSONId = "id";
        this.atributoJSONcId = "cIdSalaVirtualOferta";
        this.atributoJSONNomePrimario = "codigoOferta";
        this.atributoJSONNomeSecundario = "modulo";
        this.atributoJSONNomeSeparador = " - ";
        this.atributoJSONNome = "ofertaModulo";
        
        this.fnBuscarDadosErro = null;
        this.fnBuscarDadosSucesso = null;
        this.fnBuscarDadosSessaoErro = null;
        this.fnChange = null;
        this.fnClick = null;

        var oferta = this;
        var retornoConsumo = null;
        var idSalaVirtual = null;
        var lista = null;
        var totalRegistros = 0;
        var $idObjDOM = null;
        var idComboSalaVirtualOferta = null;
        var comboSalaVirtualOferta = null;
        var iconeOfertaFilha = '<span title="oferta vinculada" data-toggle="tooltip" data-placement="bottom" data-delay=\'{"hide":2500}\' class="badge-master badge bg-default">V</span>',
        iconeOfertaMaster = '<span  title="oferta mestre" data-toggle="tooltip" data-placement="bottom" class="badge-master badge bg-danger">M</span>',
        iconeOfertaMasterInterdisciplinar = '<span title="oferta mestre interdisciplinar" data-toggle="tooltip" data-placement="bottom" class="badge-master badge bg-danger">M I</span>';
        this.Inicializar = function ()
        {
            $idObjDOM = "#" + oferta.idObjDOM;
        }


        this.SetIdSalaVirtual = function (id) {
            idSalaVirtual = id;
        };

        this.GetIdSalaVirtual = function () {
            if(idSalaVirtual == null || idSalaVirtual == 0)
            {
                idSalaVirtual = oferta.GetIdSalaVirtualSessao();
            }
            return idSalaVirtual;
        };

        this.SetIdComboSalaVirtualOferta = function (id) {
            idComboSalaVirtualOferta = id;
        };

        this.GetIdComboSalaVirtualOferta = function () {

            if (idComboSalaVirtualOferta == null) {
                idComboSalaVirtualOferta = "comboSalaVirtualOferta" + GetStringRandomica();
            }
            return idComboSalaVirtualOferta;
        };

        this.SetComboSalaVirtualOferta = function (combo) {
            comboSalaVirtualOferta = new combo;
        };

        this.GetComboSalaVirtualOferta = function () {
            if(comboSalaVirtualOferta == null || comboSalaVirtualOferta == void(0) )
            {
                comboSalaVirtualOferta = new (UNINTER.viewGenerica.getCombobox());
            }
            return comboSalaVirtualOferta;
        };

        this.SetFnChange = function (fn) {
            oferta.fnChange = fn;
            oferta.RegistrarEventoCombo();
        };

        this.GetTotalRegistros = function () {
            if (totalRegistros == null || totalRegistros == 0) {
                try {
                    totalRegistros = lista.length;
                } catch (e) {
                    totalRegistros = 0;
                }
            }
            return totalRegistros;
        };

        this.GetLista = function () {
            if (lista == null || lista == void (0)) {
                oferta.BuscarDados();
            }

            return lista;
        };

        this.GetUrlConsumo = function () {
           
            var url = null;

            if (!isNaN(oferta.GetIdSalaVirtual())) {
                url = oferta.ajaxUrlConsumo.replace("{valor}", oferta.GetIdSalaVirtual());
            }
            else{
                url = oferta.ajaxUrlConsumoCriptografado.replace("{valor}", encodeURIComponent(oferta.GetIdSalaVirtual()));
            }

            return url;
        };        

        this.BuscarDados = function () {
            var opcoes = { url: oferta.GetUrlConsumo() };
            retornoConsumo = UNINTER.Helpers.ajaxRequestError(opcoes);
            if (retornoConsumo.status == 200) {
                
                lista = retornoConsumo.resposta[oferta.atributoJSONLista];
                totalRegistros = lista.length;
                if (typeof oferta.fnBuscarDadosSucesso == "function") {
                    oferta.fnBuscarDadosSucesso();
                }
            } else {
                if (typeof oferta.fnBuscarDadosErro == "function") {
                    oferta.fnBuscarDadosErro();
                }
            }
        };

        this.GetIdSalaVirtualSessao = function () {
            var idSalaVirtualSessao = 0;
            try{
                idSalaVirtualSessao = UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtual;
            }catch(e){
                if (typeof oferta.fnBuscarDadosSessaoErro == "function")
                {
                    oferta.fnBuscarDadosSessaoErro();
                }
            };
            return idSalaVirtualSessao;
        };

        this.GetIdSalaVirtualOfertaSessao = function () {
            var idSalaVirtualOfertaSessao = 0;
            try {
                idSalaVirtualOfertaSessao = UNINTER.StorageWrap.getItem("leftSidebarItemView").idSalaVirtualOferta;
            } catch (e) {
                idSalaVirtualOfertaSessao = 0;
            };
            return idSalaVirtualOfertaSessao;
        };

        this.RegistrarEventoCombo = function () {
            $("#" + oferta.GetIdComboSalaVirtualOferta()).off("change.oferta");
            $("#" + oferta.GetIdComboSalaVirtualOferta()).on("change.oferta", function () {

                try {
                    oferta.AtualizarSession();
                    $('#idTotalAvisos').trigger('change.atualizarTotaisSala');
                    if (typeof oferta.fnChange == "function") {
                        
                        oferta.fnChange();
                        
                    } else {
                        eval(oferta.fnChange + "();");
                    }
                } catch (e) { }
                
                oferta.ValidarUrlAvaliacao();
                salvarHistoricoNavegacao();
            });
        };

        this.AtualizarSession = function () {
            console.log('AtualizarSession');
   
            var objSelecionado = oferta.GetObjSelecionado();
            if(objSelecionado != void(0))
            {
                var session = UNINTER.StorageWrap.getItem('leftSidebarItemView');
                session.idSalaVirtualOferta = objSelecionado[oferta.atributoJSONId];
                session.codigoOferta = objSelecionado.codigoOferta;
                session.idSalaVirtualOfertaPai = objSelecionado.idSalaVirtualOfertaPai;
                session.totalFilhas = objSelecionado.totalFilhas;
                session.idCurso = objSelecionado.idCurso;
                session.idCursoModalidade = objSelecionado.idCursoModalidade;
                session.nomeCurso = objSelecionado.nomeCurso;
                session.ofertaMaster = (objSelecionado.totalFilhas > 0) ? true : false;
                session.usuarioInscrito = (objSelecionado.usuarioInscrito) ? true : false;
                session.idSalaVirtualOfertaAproveitamento = objSelecionado.idSalaVirtualOfertaAproveitamento;
                session.idMultidisciplinar = objSelecionado.idMultidisciplinar;
                session.utilizaPesoMedia = objSelecionado.utilizaPesoMedia;
                session.utilizaTrabalho = objSelecionado.utilizaTrabalho;
                session.cIdSalaVirtualOferta = objSelecionado.cIdSalaVirtualOferta;

                UNINTER.StorageWrap.setItem('leftSidebarItemView', session);

                //mostra icone de oferta master/vinculada
                var ofertaMaster = '';                
                if (session.idSalaVirtualOfertaPai > 0) {
                    var span = $(iconeOfertaFilha).clone();

                    if (objSelecionado.codigoOfertaPai > 0) {
                        var title = span.prop("title");
                        span.prop("title", title + " à oferta " + objSelecionado.codigoOfertaPai);
                    }
                    var div = $("<div>").html(span);

                    ofertaMaster = div.html();
                    
                }
                else if (session.totalFilhas > 0 && session.idMultidisciplinar > 0)
                    ofertaMaster = iconeOfertaMasterInterdisciplinar;
                else if (session.totalFilhas > 0)
                    ofertaMaster = iconeOfertaMaster;

                $("#sidebarCurrentArea #divOfertaMaster").html(ofertaMaster);
                
                
            }

        };

        this.CriarSelectHtml = function () {
            //var $label = $("<label>").attr("for", oferta.GetIdComboSalaVirtualOferta()).html("Oferta");
            var $select = $("<select>").addClass("form-control").attr("id", oferta.GetIdComboSalaVirtualOferta());
            $($idObjDOM).append($select);
        };

        this.IniciarCombobox = function ()
        {           
            oferta.GetComboSalaVirtualOferta();
            comboSalaVirtualOferta.autoComplete = true;
            //comboSalaVirtualOferta.change = oferta.fnChange;
            comboSalaVirtualOferta.idObjCombo = oferta.GetIdComboSalaVirtualOferta();
            comboSalaVirtualOferta.idOption = "id";
            comboSalaVirtualOferta.inicializar = false;
            comboSalaVirtualOferta.msgNaoEncontrado = "Nenhum registro encontrado.";
            comboSalaVirtualOferta.popularAoIniciar = true;
            comboSalaVirtualOferta.textoInicial = "Selecione";
            comboSalaVirtualOferta.textoOption = oferta.atributoJSONNome;
            comboSalaVirtualOferta.tituloOption = oferta.atributoJSONNome;
            comboSalaVirtualOferta.valorOption = !isNaN(this.idSalaVirtualOfertaInicializar) ? oferta.atributoJSONId : oferta.atributoJSONcId;
            comboSalaVirtualOferta.formatResult = function (state) {
                var texto = state.text;
                if (state.css == "optionOfertaMaster") texto += " " + iconeOfertaMaster;
                else if (state.css == "optionOfertaVinculada") texto += " " + iconeOfertaFilha;
                else if (state.css == 'optionOfertaMasterInterdisciplinar') texto += " " + iconeOfertaMasterInterdisciplinar;
                return texto;
            };
            comboSalaVirtualOferta.render();
            oferta.RegistrarEventoCombo();

        }

        this.PopularCombobox = function () {
           
            var ajustarDados = function () {

                var arrayPai = [
                    {
                        nomeGrupo: "ATUAIS",
                        valor: 0,
                        itens: []
                    },
                    {
                        nomeGrupo: "FUTURAS",
                        valor: 1,
                        itens: []
                    },
                    {
                        nomeGrupo: "ANTERIORES",
                        valor: -1,
                        itens: []
                    }
                ];

                $(oferta.GetLista()).each(function (i, item) {
                    switch (item.vigencia) {
                        case 0:
                            arrayPai[0].itens.push(item);
                            break;
                        case 1:
                            arrayPai[1].itens.push(item);
                            break;
                        case -1:
                            arrayPai[2].itens.push(item);
                            break;
                    }
                });

                return arrayPai;
            };
            
            var idSalaVirtualOfertaSessao = oferta.GetIdSalaVirtualOfertaSessao();


            if(oferta.idSalaVirtualOfertaInicializar == null || PodeSelecionar(oferta.idSalaVirtualOfertaInicializar) === false )
            {
                if (PodeSelecionar(idSalaVirtualOfertaSessao)) {
                    oferta.idSalaVirtualOfertaInicializar = idSalaVirtualOfertaSessao;
                } else {
                    oferta.idSalaVirtualOfertaInicializar = 0;
                }
            }

            var data = ajustarDados();
            $(data).each(function (y, grupo) {
                var objGrupo = $("<optgroup>", { label: grupo.nomeGrupo });

                if ((oferta.idSalaVirtualOfertaInicializar == 0 || oferta.idSalaVirtualOfertaInicializar == null) && grupo.itens.length > 0)
                {
                        oferta.idSalaVirtualOfertaInicializar = grupo.itens[0].id;
                }

                $(grupo.itens).each(function (i, item) {
                    item[oferta.atributoJSONNome] = item[oferta.atributoJSONNomePrimario] + oferta.atributoJSONNomeSeparador + item[oferta.atributoJSONNomeSecundario];
                    //if ( PodeSelecionar(idSalaVirtualOfertaSessao) == true && item.idSalaVirtualOferta == idSalaVirtualOfertaSessao) {
                    //    oferta.idSalaVirtualOfertaInicializar = item[oferta.atributoJSONId];
                    //}

                    if (item[oferta.atributoJSONNome] == '0 - null')
                    {
                        item[oferta.atributoJSONNome] = 'Sem vínculo com sistema acadêmico (5E)';
                    }
                    
                    var classe = '';                    
                    
                    if (item.idSalaVirtualOfertaPai > 0)
                        classe = 'optionOfertaVinculada';
                    else if (item.totalFilhas > 0 && item.idMultidisciplinar > 0)
                        classe = 'optionOfertaMasterInterdisciplinar';
                    else if (item.totalFilhas > 0)
                        classe = 'optionOfertaMaster';

                    objGrupo.append($("<option>", { id: item.id, value: item[!isNaN(oferta.idSalaVirtualOfertaInicializar) || oferta.idSalaVirtualOfertaInicializar==null ? oferta.atributoJSONId : oferta.atributoJSONcId], 'class': classe }).html(item[oferta.atributoJSONNome]));
                });

                $("#" + oferta.GetIdComboSalaVirtualOferta()).append(objGrupo);
            });

            //$.each(oferta.GetLista(), function (i, item) {
            //    item[oferta.atributoJSONNome] = item[oferta.atributoJSONNomePrimario] + oferta.atributoJSONNomeSeparador+ item[oferta.atributoJSONNomeSecundario];
            //    comboSalaVirtualOferta.adicionarValor(item);
            //    if (i == (oferta.GetTotalRegistros() - 1) || (PodeSelecionar(idSalaVirtualOfertaSessao) == true && item.idSalaVirtualOferta == idSalaVirtualOfertaSessao))
            //    {
            //        oferta.idSalaVirtualOfertaInicializar = item[oferta.atributoJSONId];
            //    }
            //});           

            comboSalaVirtualOferta.ajaxCompleto();
        };

        this.AlterarValorSelecionado = function (valor) {
            if (valor != undefined) {
                comboSalaVirtualOferta.alterarValorSelecionado(valor);
                oferta.AtualizarSession();
                try {
                    oferta.fnChange();
                } catch (e) { }
            } else {
               
                //valor = ;
                var cIdSalaVirtualOferta = UNINTER.StorageWrap.getItem("leftSidebarItemView").cIdSalaVirtualOferta
                valor = cIdSalaVirtualOferta != null ? encodeURIComponent(cIdSalaVirtualOferta) : oferta.GetIdSalaVirtualOfertaSessao();
                //Se esta na sessão, usamos o que está armazenado.
                if (/*parseInt(valor) > 0 &&*/ PodeSelecionar(valor) == true ) {
                    comboSalaVirtualOferta.alterarValorSelecionado(valor);
                    oferta.AtualizarSession();
                    try { oferta.fnChange(); } catch (e) { }
                } else {
                    //Não passou no parametro e não achou na sessão, usamos o que foi enviado na instancia.
                    if (oferta.idSalaVirtualOfertaInicializar != null && oferta.idSalaVirtualOfertaInicializar != void (0) && PodeSelecionar(oferta.idSalaVirtualOfertaInicializar) == true) {

                        comboSalaVirtualOferta.alterarValorSelecionado(oferta.idSalaVirtualOfertaInicializar);
                        oferta.AtualizarSession();
                        try { oferta.fnChange(); } catch (e) { }
                    }
                }
            }
        };

        this.ValidarUrlAvaliacao = function () {
            
            var objSelecionado = oferta.GetObjSelecionado();

            var urlAtual = window.location.hash;
            var permissao = $("#leftSidebarItemView header a[data-permissaoavaliacao]").attr("data-permissaoavaliacao");

            var ehAvaliacao = false;
            var ehAvaliacaoUsuario = false;

            if (urlAtual.toLowerCase() == "#/ava/avaliacaousuario") { ehAvaliacaoUsuario = true; }
            if (urlAtual.toLowerCase() == "#/ava/avaliacao") { ehAvaliacao = true; }
            
            if (objSelecionado != null && objSelecionado != 'undefined') {

                if (objSelecionado.usuarioInscrito == 1 || permissao.toLowerCase() == "avaliacaousuario") {
                    $("#leftSidebarItemView header a[data-permissaoavaliacao]").attr("href", "#/ava/AvaliacaoUsuario");
                } else {

                    var objSalaSession = UNINTER.StorageWrap.getItem('leftSidebarItemView');

                    if (objSalaSession == void (0) || objSalaSession.utilizaPesoMedia == false) {
                        $("#leftSidebarItemView header a[data-permissaoavaliacao]").attr("href", "#/ava/Avaliacao");
                    } else {
                      
                        $("#leftSidebarItemView header a[data-permissaoavaliacao]").attr("href", '#/ava/AvaliacaoTipoCurso/' + UNINTER.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOferta + '/novo/salavirtualoferta');
                        $("#leftSidebarItemView header a[data-permissaoavaliacao]").attr("data-permissaoavaliacao", 'AvaliacaoTipoCurso/' + UNINTER.StorageWrap.getItem('leftSidebarItemView').idSalaVirtualOferta + '/novo/salavirtualoferta');

                    }
                }

                if (objSelecionado.usuarioInscrito == 1 && ehAvaliacao == true) {
                    window.location = "#/ava/AvaliacaoUsuario";
                }

                if (objSelecionado.usuarioInscrito == 0 && ehAvaliacaoUsuario == true && permissao.toLowerCase() == "avaliacao") {
                    window.location = "#/ava/Avaliacao";
                }
            }
        };

        this.GetObjSelecionado = function () {
            
            
            var stringJson;
                if(!isNaN(comboSalaVirtualOferta.valorSelecionado)){

                    stringJson ='{"' +  oferta.atributoJSONId + '":' + comboSalaVirtualOferta.valorSelecionado + '}';
                }
                else{
                    stringJson = '{"' + oferta.atributoJSONcId + '":"' + comboSalaVirtualOferta.valorSelecionado + '"}';
                }
            return _.findWhere(oferta.GetLista(), JSON.parse(stringJson));
        };

        this.GetIdSalaVirtualOferta = function () {
            return comboSalaVirtualOferta.valorSelecionado;
        };

        this.Render = function () {
            oferta.Inicializar();
            oferta.CriarSelectHtml();
            oferta.IniciarCombobox();
            oferta.PopularCombobox();           
            oferta.AlterarValorSelecionado();
            oferta.ValidarUrlAvaliacao();
            $('#idTotalAvisos').trigger('change.atualizarTotaisSala');
        };

        var GetStringRandomica = function(){
            var string = Math.random();
            return string.toString().replace("0.", "X").substring(0,4);
        };

        var PodeSelecionar = function (id) {

            var strTemp;
            if (!isNaN(id)) {

                strTemp = '{"id":' + id + '}';
                var obj = _.findWhere(oferta.GetLista(), JSON.parse(strTemp));
                if (obj != void (0) && obj.id > 0) {
                    return true;
                } else {
                    return false;
                }
            }
            else {
                strTemp = '{"cIdSalaVirtualOferta":"' + id + '"}';
                var obj = _.findWhere(oferta.GetLista(), JSON.parse(strTemp));
                
                if (obj != void (0) && obj.id > 0) {
                    return true;
                } else {
                    return false;
                }
            }

        };

        //Salva oferta no historico de navegacao
        var salvarHistoricoNavegacao = function () {
            var objSelecionado = oferta.GetObjSelecionado();
            var idEscola = objSelecionado.idEscola,
                idCurso = objSelecionado.idCurso,
            idSalaVirtual = objSelecionado.idSalaVirtual,
            idSalaVirtualOferta = objSelecionado.id,
            idSalaVirtualOfertaAproveitamento = objSelecionado.idSalaVirtualOfertaAproveitamento,
            usuarioInscrito = objSelecionado.usuarioInscrito,
            user = UNINTER.StorageWrap.getItem('user');

            console.log('idEscola: ' + idEscola + ' idCurso: ' + idCurso + ' idSalaVirtual: ' + idSalaVirtual + ' idSalaVirtualOferta ' + idSalaVirtualOferta);
            if ((user.idUsuarioSimulador == 0 || user.idUsuarioSimulador == null) && idEscola > 0 && idCurso > 0 && idSalaVirtual > 0 && idSalaVirtualOferta > 0) {
                var data = {
                    idEscola: idEscola,
                    idCurso: idCurso,
                    idSalaVirtual: idSalaVirtual,
                    idSalaVirtualOferta: idSalaVirtualOferta,
                    idSalaVirtualOfertaAproveitamento: idSalaVirtualOfertaAproveitamento,
                    usuarioInscrito: usuarioInscrito
                };

                UNINTER.Helpers.ajaxRequestError({
                    type: 'POST',
                    url: UNINTER.AppConfig.UrlWs('sistema') + "UsuarioHistoricoCursoOferta",
                    async: true,
                    'data': data
                });
                
            }
        };


    };
    return classOferta;
})();