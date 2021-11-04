var PopupView = (function (opts) {

    var classe = function (opts) {

        var close = '<div class="text-right" style="padding: 3px;"><button type="button" class="btn btn-success" id="naoExibirMais" title="Entendi. Não mostre-me novamente">Entendi. Não mostre-me novamente</button>&nbsp;<button type="button" class="btn btn-warning" id="fecharModalPopup" title="Lembre-me mais tarde desta pop-up">Lembre-me mais tarde</button></div>';

        var templateFooter = '<div id="containerNaoExibirMais"><div class="nav-slider-popup"></div></div>';

        var modalAberta = false;

        var avisos = null;

        var session = false;

        var maiorWidth = 0;

        var size = 'modal-md';

        var exibirHeader = false;

        var exibirFooter = true;

        var AjustarAtributos = function () {

            $(avisos).each(function (i, aviso) {

                var $container = $("<div>").html(aviso.texto);

                aviso.totalImagens = $container.find('img').length;
                aviso.totalImagemTratadas = 0;
                aviso.size = 'modal-md';
                aviso.maiorWidth = 0;
                aviso.container = $container.html();
                aviso.tratado = aviso.totalImagens == 0 ? true : false;

                $container.find('img').addClass('img-responsive').attr('tabindex', '0');


                if (aviso.totalImagens > 0) {

                    $container.find('img').each(function (i, item) {

                        var img = new Image();
                        img.src = $(item).attr('src');
                        img.onload = function () {

                            if (img.width > aviso.maiorWidth) {
                                aviso.width = img.width;
                                aviso.height = img.height;
                                aviso.maiorWidth = img.width;
                            }

                            var title = $container.find('[title]').attr('title');

                            if (title == void (0) || title == '') {
                                title = 'Imagem da pop-up sem descrição.';
                            }

                            aviso.title = title;

                            if (aviso.maiorWidth >= 900) {
                                size = "modal-lg";
                            }

                            aviso.totalImagemTratadas++;

                            if(aviso.totalImagemTratadas == aviso.totalImagens)
                            {
                                aviso.tratado = true;
                            }
                            
                            var tmp = _.findWhere(avisos, { tratado: false });

                            if(tmp == void(0) || tmp.length == 0)
                            {
                                self.Show();
                            }
                        };

                    });
                }

            });
        };

        var GetAvisoAtual = function () {
            var $el = $('#carousel-popup .item.active');
            var idAvisoDestinatarioPopup = $el.data('dest');

            var aviso = _.findWhere(avisos, { idAvisoDestinatarioPopup: idAvisoDestinatarioPopup });
            return aviso;
        };

        var Eventos = function (modalElement) {

            $("#fecharModalPopup").off('click').on('click', function () {

                // Se não é a última popup, não fecha a modal, vai para proxima.:
                if ($('.nav-slider-popup a.active').next().length == 0) {
                    $(modalElement).modal('hide');
                    $('.home-header h1').focus()
                } else {
                    $('.nav-slider-popup a.active').next().trigger('click');
                    $('#fecharModalPopup').focus();
                }
                
            });

            $('#carousel-popup').carousel({
                interval: false
            });

            $('.nav-slider-popup a').off('click').on('click', function (e) {

                var $el = $(e.currentTarget);

                $('.nav-slider-popup a').removeClass('active');

                $el.addClass('active');

                $('#carousel-popup').carousel($el.data('posicao'));

                $("#naoExibirMais").prop('checked', false);
                setTimeout(function () {
                    $("#naoExibirMais").prop('checked', GetAvisoAtual().lido);
                }, 600);
                

            });

            $("#naoExibirMais").off('click').on('click', function (e) {

                var aviso = GetAvisoAtual();
                aviso.lido = true;

                if (aviso.idAvisoDestinatarioPopup > 0)
                {
                    UNINTER.Helpers.ajaxRequest({
                        url: UNINTER.AppConfig.UrlWs('Sistema') + 'AvisoDestinatarioPopup/' + aviso.idAvisoDestinatarioPopup + '/Lido/true',
                        async: true
                    });
                }

                $("#fecharModalPopup").trigger('click');

            });

            $("#dialogModal .carousel-inner a").off('click').on('click', function (e) {
                var $el = $(e.currentTarget);

                if ($el.attr('target') == void (0) || $el.attr('target') != '_blank') {
                    $("#dialogModal").modal('hide');
                }
            });

        };

        this.Show = function () {

            if(avisos == void(0) || avisos.length == 0)
            {
                return;
            }

            var $carrouselContainer = $('<div>', { class: 'carousel slide', id: 'carousel-popup' });

            var $slideContainer = $("<div>", { class: 'carousel-inner' });
            
            var $footer = $(templateFooter).clone(true);

            if (avisos.length == 1) {
                $footer.find('.nav-slider-popup').hide();
                exibirFooter = false;
            }

            $(avisos).each(function (i, item) {
                var el = $(item.container).clone(true);
                $(el).attr('title', item.title).attr('tabindex', 0);
                var $imgContainer = $("<div>", { 'data-dest': item.idAvisoDestinatarioPopup, 'data-posicao': i, class: (i > 0) ? 'item' : 'item active' }).append(el);
                $slideContainer.append($imgContainer);

                $footer.find('.nav-slider-popup').append($('<a>', { 'data-dest': item.idAvisoDestinatario, 'data-posicao': i, href: 'javascript:void(0)', class: (i == 0) ? 'active' : '' }).html(('')));

            });

            $carrouselContainer.append($slideContainer);

            var $container = $('<div>').html(close).append($carrouselContainer);


            UNINTER.Helpers.showModalAdicionarFila({
                size: 'modal-popup ' + size,
                title: '',
                body: $container,
                header: exibirHeader,
                footer: exibirFooter,
                footerContent: $footer,
                modal: {
                    backdrop: 'static'
                },
                buttons: [],
                callback: function (modalElement) {
                    Eventos(modalElement);
                }
            });


        };

        this.SetAvisos = function (addAvisos) {
            avisos = addAvisos;
            AjustarAtributos();
        };

        var self = this;

        var Init = function () {
            if (opts != void (0) && opts.avisos != void(0)) {                
                self.SetAvisos(opts.avisos);
                //self.Show();
            }

            if (opts != void (0) && opts.exibirHeader != void (0))
            {
                exibirHeader = opts.exibirHeader;
            }


            if (opts != void (0) && opts.exibirFooter != void (0)) {
                exibirFooter = opts.exibirFooter;
            }

        };

        Init();


    };

    return classe;

})();