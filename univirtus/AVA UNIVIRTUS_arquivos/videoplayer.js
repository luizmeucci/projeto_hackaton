define([
    'jquery' ,
    'videojs'
], function($) {

    var VideoPlayer = function () {
        this.formato = null;
        this.sourceMP4 = null;
        this.cover = null;
        this.domId = null;
        this.videoId = null;
        this.width = "600px";
        this.height = "450px";
        this.player = null;
        this.embedYoutube = null;
        this.univirtusVOD = false;
        this.SalvarResposta = false;
        this.idUsuario = 0;
        var vp = this;
        
        this.render = function () {
            
            if (vp.ehYoutube()) {
                vp.playerYoutube();
            } else {
                var video = vp.tagVideo();
                $(vp.domId).html(video);
                vp.inicializar();
            }
        };

        this.inicializar = function () {
            if(vp.ehYoutube())
            {
                vp.playerYoutube();
                return;
            }

            vp.destroy();
            var config = {
                width: vp.width,
                height: vp.height,
                autoplay: true,
                controls: true,
                preload: "auto"
            };
            console.log('domId: ' + vp.domId);
            if (vp.formato == "video/flv") {
                config.techOrder = ['flash', 'html5'];
            } else {
                config.techOrder = ['html5', 'flash'];
            }

            this.player = videojs(document.getElementById(vp.videoId), config, function (e) {

                var video = this;

                BuscarQuestoes(video);

                this.play();
            });

            if (this.univirtusVOD == true) {
                $('.video-js').on('contextmenu', function () { return false; });
                setTimeout(function () {
                    $('.video-js').on('contextmenu', function () { return false; });
                }, 300);
            }
        };

        this.ehYoutube = function () {
            var eh = false;
            var temp = vp.sourceMP4.replace("https://", "");
            temp = temp.replace("http://", "");
            temp = temp.replace("www.", "");
            var tempUrl = temp.split(".");

            if ($.inArray('youtube', tempUrl) >  -1 ) {
                var temp = tempUrl[tempUrl.length - 1].split("v=")
                vp.embedYoutube = temp[temp.length-1];
                eh = true;
            }

            if ($.inArray('youtu', tempUrl) > -1) {
                var temp = tempUrl[tempUrl.length - 1].split("/")
                vp.embedYoutube = temp[temp.length - 1];
                eh = true;
            }

            if (eh)
            {
                var embedID = vp.getIdYoutube(vp.sourceMP4);
                if (embedID) {
                    vp.embedYoutube = embedID;
                }
            }

            return eh;
        };

        this.playerYoutube = function () {
            $(vp.domId).html(vp.getEmbedYoutube());
        };

        this.getEmbedYoutube = function () {
            //<iframe width="854" height="510" src="https://www.youtube.com/embed/clyLp_EPzGE" frameborder="0" allowfullscreen></iframe>
            //var iframe = $("<iframe>").addClass("embed-responsive-item").attr("src", "https://www.youtube.com/embed/" + vp.embedYoutube + "??enablejsapi=1&autoplay=1&autohide=1&rel=0").attr("allowfullscreen", "1");
            var iframe = $("<iframe>").addClass("embed-responsive-item").attr("src", "https://www.youtube.com/embed/" + vp.embedYoutube).attr("allowfullscreen", "1");
            return divContainer = $("<div>").attr("id", "iframeyoutube").addClass("embed-responsive embed-responsive-16by9").append(iframe);
        }

        this.tagVideo = function () {

            vp.buscarFormato();

            var div = $('<div>');
            div.addClass("video-js vjs-default-skin player2 vjs-controls-enabled vjs-user-inactive");
            div.css("width", vp.width);
            div.css("height", vp.height);

            var tag = $("<video>");
            tag.attr("id", vp.videoId);
            tag.attr("data-setup", '{ "playbackRates": [0.5, 1, 1.5, 2, 2.5, 3] }');
            //tag.addClass("vjs-tech");
            //tag.css("width", vp.width);
            //tag.css("height", vp.height);
            
            var source = $("<source>");

            if (vp.sourceMP4 && vp.sourceMP4.indexOf('univirtusvod') > -1) {
                vp.univirtusVOD = true;
            }

            source.attr("src", vp.sourceMP4);                       
            source.attr("type", vp.formato);

            tag.append(source);
            div.append(tag);
            return div;

        };

        this.pause = function () {
            var player = _V_(vp.domId);
            player.pause();
        };

        this.destroy = function () {
            try{ delete _V_.players[vp.videoId]; }catch(e){  }
            try{ vp.player.dispose(); }catch(e){  }
        };

        this.buscarFormato = function () {
            if (vp.formato == null || vp.formato == void (0)) {
                var temp = vp.sourceMP4.split(".");
                var extensao = temp[(temp.length - 1)];
                extensao = extensao.trim().toLowerCase();

                switch(extensao) {
                    case "flv":
                        vp.formato = "video/flv"
                        break;
                    case "ogg":
                        vp.formato = "video/ogg";
                        break;
                    default:
                        vp.formato = "video/mp4";
                }
            }
            return vp.formato;
        }

        this.getIdYoutube = function (url) {
            var temp = url.split("?");

            if (temp.length > 1) {
                url = temp[1];
            }

            url = url.split('+').join(' ');

            var params = {},
                tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(url)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            if (params.v != void (0)) {
                return params.v;
            } else {
                return void (0);
            }
            
        }

        this.currentTime = function () {
            if (vp.player == null)
                return 0;
            return vp.player.currentTime();
        };

        var BuscarQuestoes = function (video) {

            //var urlBase = 'http://localhost:54384/';
            var urlBase = UNINTER.AppConfig.UrlWs('roa');

            UNINTER.Helpers.ajaxRequest({
                url: urlBase + '/VideoInterativoQuestao/0/GetByURL',
                type: 'GET',
                data: { urlVideo: vp.sourceMP4, idUsuario: vp.idUsuario },
                async: true,
                successCallback: function (data) {
                    console.log(data);

                    var questions = [];

                    jQuery.each(data.questoes, function (index, item) {

                        var alternatives = [];

                        jQuery.each(item.alternativas, function (indexA, itemA) {
                            var alternat = {
                                text: itemA.valor,
                                idQuestaoAlternativa: itemA.idQuestaoAlternativa,
                                correct: itemA.correta == 'true' 
                            };

                            alternatives.push(alternat);
                        });

                        var quest = {
                            time: item.tempoEmSegundos,
                            text: item.enunciado,
                            displayCorrection: true,
                            showAlways: item.aparecerMesmoRespondida,
                            alternatives: alternatives,
                            idVideoInterativoQuestao: item.id,
                        };

                        if (item.idVideoInterativoQuestaoResposta != null && !item.aparecerMesmoRespondida) {
                            quest.expose = true;
                        }

                        if (vp.SalvarResposta) {
                            quest.callback = function () { SalvarRespostaAluno(item); };
                        }

                        questions.push(quest);
                    });

                    if (questions.length > 0) {
                        CarregarPluginQuestoes(video, questions);
                    }
                },
                errorCallback: function (error) {
                    console.error(error.responseJSON.Message);
                }
            });
        };

        var CarregarPluginQuestoes = function (video, questions) {

            var json = {
                questions: questions,
                textContinue: 'Continuar',
                textCorrect: 'correta',
                textIncorret: 'errada',
                classNameContinue: 'btn btn-success',
            };

            if (typeof (QuestionPlugin) != 'undefined') {

                video.QuestionPlugin(json);
                return;
            }

            var indexWeb = window.location.href.indexOf('web/');
            var urlCarregamento = window.location.href.substring(0, indexWeb + 4)

            jQuery.getScript(urlCarregamento + '/js/libraries/videojs-question.js', function () {

                video.QuestionPlugin(json);
            });
        };

        var SalvarRespostaAluno = function (item) {

            var idVideoInterativoQuestaoResposta = item.idVideoInterativoQuestaoResposta;
            var idVideoInterativoQuestao = item.id;
            var idQuestaoAlternativa = jQuery('input[type=radio]:checked', '#table_alternatives_' + idVideoInterativoQuestao).val();

            console.log("idVideoInterativoQuestao: " + idVideoInterativoQuestao + " - idQuestaoAlternativa: " + idQuestaoAlternativa + " - idVideoInterativoQuestaoResposta: " + idVideoInterativoQuestaoResposta);

            var urlMetodo = '/0/Post';
            var metodo = 'POST';

            if (idVideoInterativoQuestaoResposta > 0) {
                urlMetodo = '/' + idVideoInterativoQuestaoResposta + '/Put';
                metodo = 'PUT';
            }

            //var urlBase = 'http://localhost:54384/';
            var urlBase = UNINTER.AppConfig.UrlWs("roa");

            UNINTER.Helpers.ajaxRequest({
                url: urlBase + 'VideoInterativoQuestaoResposta' + urlMetodo,
                type: metodo,
                async: true,
                data: { idVideoInterativoQuestao: idVideoInterativoQuestao, idQuestaoAlternativa: idQuestaoAlternativa, idUsuario: vp.idUsuario, id: idVideoInterativoQuestaoResposta },
                successCallback: function (data) {
                    if (metodo == 'POST') {
                        item.idVideoInterativoQuestaoResposta = data.id;
                    }
                    console.log('Salvo com sucesso');
                },
                errorCallback: function (error) {
                    console.error(error.responseJSON.Message);
                }
            });
        };

    }
    return VideoPlayer;
});