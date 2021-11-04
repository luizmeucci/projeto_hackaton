/* ==========================================================================
   Sliding View
   @author: Thyago Weber (thyago.weber@gmail.com)
   @date: 24/04/2014
   ========================================================================== */

/**
 * Exemplo de utilização:
 * 
 *  var slides = slidingBlocks();
 *  $('#lnks a').click(function () {
 *      var n = $(this).data('block');
 *      slides.setActiveItem(n);
 *      console.log(slides.getActiveItem());
 *  });
 *
 * Exemplo de Markup:
 *
 * <div id="slidingBlocksHolder">
 *     <div class="slidingBlocksContainer">
 *         <div class="block-item block-1"></div>
 *         <div class="block-item block-2"></div>
 *         <div class="block-item block-3"></div>
 *     </div>
 * </div>
 **/

define(function (require) {
    'use strict';
    var $ = require('jquery');
    var _ = require('underscore');

    return function (options) {
        options = options || {};

        // Opções padrão
        var defaults = {
            blockItemClass: 'block-item', // Classe para todos os Blocos
            blockItemIncrementPrefix: 'block', // Prefixo para a classe identificadora de cada Bloco
            blocksContainerId: 'slidingBlocksContainer', // ID do container dos blocos (onde ocorrerá a animação)
            slidingBlocksHolderId: 'slidingBlocksHolder' // ID do Container principal
        };

        var opts = _.defaults(options, defaults);

        var blocksContainer, slidingBlocksHolder, slidingBlocksHolderWidth, blockItemsLength, blockItemWidth, totalWidth, blockClass, blockClassSelector;

        slidingBlocksHolder = '#' + opts.slidingBlocksHolderId;
        blocksContainer = '#' + opts.blocksContainerId;
        blockClass = opts.blockItemIncrementPrefix;
        blockClassSelector = '.'+blockClass;

        // Faz a iteração entre os blocos e atribui as classes identificadoras para os blocos
        function iterate() {
            $(blocksContainer).find('.' + opts.blockItemClass).each(function (i) {
                var blockIdentifier = opts.blockItemIncrementPrefix + '-' + (i + 1);
                $(this).addClass(blockIdentifier).data('block-number', i + 1);
            });
        }

        // Pega a largura do holder menos 1 px
        function getSlidingBlocksHolderWidth () {
            var blocksHolderWidth = $('#' + opts.slidingBlocksHolderId).width();
            return blocksHolderWidth-1;
        }

        // Define a largura do holder
        function setHolderWidth () {
            // Iterando nos elementos e atribuindo as classes
            iterate();
            slidingBlocksHolderWidth = getSlidingBlocksHolderWidth();

            // Atribuindo a cada block-item a largura total do slidingBlocksHolder
            $('.' + opts.blockItemClass, '#' + opts.slidingBlocksHolderId).width( slidingBlocksHolderWidth );

            // Quantidade de block-items
            blockItemsLength = $('.' + opts.blockItemClass).length;

            blockItemWidth = slidingBlocksHolderWidth;

            // Se não há nenhum bloco, a largura total do container deverá ser igual a largura de um único bloco.
            if ( blockItemsLength === 0 ) {
                totalWidth = blockItemWidth;
            }
            // Se houver, a largura total será o resultado do produto da largura do holder pelo número de blocos existentes.
            else {
                totalWidth = blockItemsLength * blockItemWidth;
            }

            // Tornando a largura do container dos blocos igual a soma da largura dos blocos
            $( blocksContainer ).width( totalWidth );
        }


        function prepare () {
            var activeItem = getActiveItem();

            setHolderWidth();
            
            if ( activeItem ) {
                setTimeout(function() {
                    setActiveItem( activeItem );
                }, 500);
            }
        }

        // Define o item visível
        // O número do bloco é informado e o blocksContainer deve deslizar de modo a tornar visível este item.
        function setActiveItem (itemNumber) {
            var positionLeft,
            bCSelector = blockClassSelector+'-'+itemNumber;

            if ( typeof itemNumber !== 'number' ) { throw new TypeError(typeof itemNumber +' recebido; INT esperado.'); }
            if ( !$(bCSelector).length ) {
                throw new Error('O referido item da slidingView não existe: "' + bCSelector + '"');
            }

            positionLeft = $( blocksContainer ).find( bCSelector ).position().left;

            $(slidingBlocksHolder).data('active', itemNumber);

            $(blocksContainer)
                .css({ 'left': '-' + positionLeft + 'px' })
                .find('.block-item').addClass('block-item-idle');

            $(blocksContainer)
                .find('.' + opts.blockItemIncrementPrefix + '-' + $(slidingBlocksHolder).data('active'))
                .removeClass('block-item-idle')
                .addClass('block-item-active');
        }

        // Adiciona um novo bloco
        function addBlockItem(options) {
            var blockWidth = options.blocksHolderWidth || getSlidingBlocksHolderWidth(),
            blockId = options.blockId,
            blocksLength = $('.'+blockClass).length,
            block = $('<div>', {'class': opts.blockItemClass}).width(blockWidth);

            if ( blockId ) { block.attr('id', options.blockId); }

            $( blocksContainer ).append( block );

            iterate();
        }

        function getActiveItem () {
            return $(slidingBlocksHolder).data('active');
        }

        // Listener para o redimensionamento da janela
        // O evento do resize deve ser monitorado para que o container se adapte de acordo com
        // a resolução atual
        function listenToResizeEvent () {
            $(window).off('resize.slidingView');
            $(window).on('resize.slidingView', prepare);
        }

        function initialize () {
            prepare();

           listenToResizeEvent(); 
        }

        return {
            init: initialize,
            addItem: addBlockItem,
            update: prepare,
            setActiveItem: function (itemNumber) {
                // Define o container novamente caso tenha sido adicionado novos items. 
                setHolderWidth();

                // Define o novo item ativo
                setActiveItem(itemNumber);
            },
            getActiveItem: getActiveItem,
            getSliderInfo: function () {
                var info = {};
                _.extend(info, opts);
                return info;
            }
        };
    }
});