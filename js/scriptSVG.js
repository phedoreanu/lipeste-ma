// JavaScript Document

/*
 var proj;
 var heights = [];
 var tn;
 var itemsNo;
 var slides;
 var slider;
 var page = 0;
 */

var stickers = [];
var stickerDB = {};

$(document).ready(function () {

    //init menu
    var selectedMenuPosition = $('li:first-child').outerWidth(true) / 2 - 18;
    $('ul').css('background-position', selectedMenuPosition + 'px' + ' 15px');

    //init RaphaelPaper
    var paper = Raphael('banner', '100%', '100%');
    //var paper = Raphael(0, 115, '100%', 281);

    //onResize
    $(window).resize(function () {

        var shoppingCart = $('#shoppingCart');
        shoppingCart.css('top', $(window).height() / 2 - 200);
        shoppingCart.css('left', $(window).width() / 2 - 300);

        var zoomedImage = $('#zoomedImage');
        zoomedImage.css({top: $(window).height() / 2 - 327});
        zoomedImage.css({left: $(window).width() / 2 - 500});

    });

    //init resize
    $(window).resize();

    //assign actions to buttons
    $('#caddyCount').click(function () {
        showCaddy();
    });

    $('li').click(
        function () {
            var ul = $('ul');
            ul.addClass('ul-ease');
            var index = $(this).index();
            var outerWidth = $(this).outerWidth(true);
            var withUntilNow = 0;

            $('li').each(function (i, item) {
                if (i == index) return false;
                withUntilNow += $(this).outerWidth(true);
            });
            var selectedMenuPosition = withUntilNow + outerWidth / 2 - 18;

            ul.css({'backgroundPosition': selectedMenuPosition + 'px 15px'});

//          paper.clear();
            /*
             paper.forEach(function (el, index) {

             var newX = Math.floor((Math.random() * 1000) + 1);

             var hue = 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ','
             + (Math.floor(Math.random() * 256)) + ')';
             //                   + ',' + Math.random() + ')';

             el.animate({'fill':hue, 'transform':'t' + newX + ',0'}, 700);
             });
             */

        }
    );

    // loading SVGZs
    if (Raphael.svg) {

//      $('#banner').vectron({'src':'img/pattern.svg'});

        $.ajax({
            type: "GET",
//            headers: { 'Content-Encoding' : 'gzip', 'Content-Type': 'image/svg+xml' },
            url: "img/pattern.svg",
//            url:"img/a.svg",
            contentType: "text/xml; charset=utf-8;",
            dataType: "xml",
            success: function (svgXML) {
                /*var pattern = paper.importSVG(svgXML);


                 //init banner v.0
                 var bBox = pattern.getBBox();
                 var patternWidth = Math.round(bBox.width);
                 var multiplicator = Math.round($(window).width() / patternWidth);
                 var patterns = [];
                 patterns[0] = pattern;
                 for(i=1; i<multiplicator; i++) {
                 patterns[i] = pattern.clone();
                 tmp = i*patternWidth+i*10;
                 patterns[i].attr({transform: 't' + tmp + ',0'});
                 }

                 //set opacity for random elements within chosen area (left)
                 paper.forEach(function (el, index) {
                 if(el.id > 6 && el.id < 18) el.attr({opacity: .4, fill: "#000"});
                 else el.attr({opacity: .1, fill: "#000"});
                 el.click(function () {
                 alert(el.getBBox().x);
                 });
                 }); //end each*/


                /*
                 //init banner v.1
                 var patternWidth = Math.round(pattern.getBBox().width);
                 //var currentX = - 20;
                 var currentX = 0;
                 var patternSpacer = 10;
                 var maxX = $(window).width();

                 //pattern.attr({transform: 't' + currentX + ',0'});

                 var steps = 0;
                 var numberOfElements = 8;

                 while(currentX < maxX) {

                 for(i=steps; i<steps+numberOfElements; i++) {
                 currentX = pattern[i].getBBox().x + patternWidth + patternSpacer;
                 newEl = pattern[i].clone();
                 newEl.attr({transform: 't' + currentX + ',0'});
                 pattern.push(newEl);

                 }

                 steps += numberOfElements;
                 }
                 */
                /*
                 paper.forEach(function (el, index) {
                 if(el.id > 6 && el.id < 18) el.attr({opacity: .4, fill: "#000"});
                 else el.attr({opacity: .1, fill: "#000"});
                 el.click(function () {
                 alert(el.getBBox().x);
                 });
                 }); //end each
                 */
            } //end function
        }); //end ajax

    } else {
        alert('Get yourself a decent browser!')
    }


    // adding images
    $.getJSON('data/decalsData.json', {format: "json"},function (data) {
        var items = [];

        $.each(data.decals, function (i, item) {
            stickerDB[item.code] = item;
            var colors = [];
            $.each(item.colors, function (i, item) {
                colors.push('<div class="color"><div class="color-mini" style="background-color:' + item + ';"></div></div>');
            });

            var sizez = [];
            $.each(item.size, function (i, item) {
                sizez.push('<div class="size"><div class="size-text">' + item + '</div></div>');
            });

            items.push(
                '<div class="thumb-wrap' + ( (i + 1) % 4 == 0 ? '-odd' : '') + '">' +
                    '<div class="thumb">' +
                    '<div class="thumb-zoom">' +
                    '<div class="infos-off">' +
                    '<div class="title">' + item.name + '</div>' +
                    '<div class="zoom">+</div>' +
                    '<div class="picker">' +
                    colors.reverse().join('') +
                    '</div>' +
                    '<div class="price-container"><div id="' + item.code + '" class="price">' + item.price + ' RON</div></div>' +
                    '<div class="sizez">' +
                    sizez.join('') +
                    '</div>' +
                    '</div>' +
                    '<img color="' + item.colors[0] + '" src="img/decals/' + item.url + '"/>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
        });

        $('<div/>', {
            id: 'decals',
            html: items.join('')
        }).appendTo('#content');

    }).success(function () {
            // adding hover
            $('.thumb-zoom').hover(
                function () {
                    $(this).addClass('thumb-over');

                    // show title
                    var infos = $(this).children(':first-child');
                    infos.show(200);

                    // show picker
                    infos.children('.picker').children('.color:last-child').css({opacity: 1, display: 'block'});

                    // show sizez
                    if (infos.children('.sizez').children('.size[selected="selected"]').length == 0) {
                        infos.children('.sizez').children('.size:first-child').show();
                    }
                }, function () {
                    $(this).children(':first-child').hide(200);
                    $(this).removeClass('thumb-over');
                });

            // zoom
            $('.zoom').click(function () {
                var zoom = $(this);

                var src = zoom.parent().next().attr('src');
                var backgroundColor = zoom.parent().next().css('backgroundColor');
                var name = src.substring(0, src.lastIndexOf('.')) + '_mare.png';


                var detail = $('#detail');
                var zoomedImage = $('<div id="zoomedImage">').css({position: 'absolute'});
                var fullImage = $('<img>');
                fullImage.attr('src', name);
                fullImage.css('backgroundColor', backgroundColor);
                detail.append(zoomedImage.append(fullImage));

                overOn();
                detail.click(function () {
                    overOut();
                });
                $(window).resize();
            });

            // miniPanZoom
            setTimeout(function () {
                if ($.browser.mozilla) {
                    $(".thumb-zoom").miniZoomPan({sW: 230, sH: 230, lW: 330, lH: 330 });
                } else {
                    $(".thumb-zoom").miniZoomPan({sW: 230, sH: 230, lW: 500, lH: 500 });
                }
            }, 13);

            // colors
            var picker = $('.picker');
            picker.children(':last-child').mouseenter(function () {
                $(this).parent().children('.color').slice(0, $(this).children('.color').length - 1).css({opacity: 1, display: 'block'});
            });

            picker.mouseleave(function () {
                var picker = $(this);
                // fuck off
                picker.children('.color').slice(0, $(this).children('.color').length - 1).css({opacity: 0, display: 'none'});

                // switch colors
                // color "0"
                var colorZero = picker.children('.color:last-child').children(':only-child');
                var oldColor = colorZero.css('backgroundColor');
                var newColor = picker.parent().next().css('backgroundColor');
                colorZero.css({'backgroundColor': newColor});
                // replacing
                picker.children().slice(0, $(this).children('.color').length - 1).children('.color-mini').filter(function () {
                    if ($(this).css('backgroundColor') == newColor) {
                        $(this).css('backgroundColor', oldColor);
                    }
                });
            });

            // select color
            $('.color').click(function () {
                var color = $(this);
                // image backgroundColor
                color.parent().parent().next().css({'backgroundColor': color.children().css('backgroundColor')});
            });

            // select size
            $('.sizez').hover(function () {
                $(this).css({backgroundImage: 'url(img/arrow90.png)', backgroundPosition: '17px 1px',
                    height: $(this).children('.size').length * 10.3, borderRadius: 5
                }, 100);
                $(this).children('.size').show(200);
            }, function () {
                var sizez = $(this);
                sizez.css({height: 13, backgroundImage: 'url(img/arrow.png)', backgroundPosition: '15px 4px'
                }, 80);
                var selectedChildren = sizez.children('[selected="selected"]');
                if (selectedChildren.length == 0) {
                    sizez.children(':gt(0)').hide();
                } else {
                    sizez.children('[selected!="selected"]').hide();
                    selectedChildren.children('.size-text').css({fontSize: 11, color: 'rgb(255, 255, 255)'});
                }
            });

            var size = $('.size');
            size.mouseenter(function () {
                var size = $(this);
                size.parent().css({backgroundPosition: '17px ' + (size.index() * 10 + 1) + 'px'}, 10);
            });

            size.click(function () {
                $(this).siblings().attr('selected', null);

                $(this).attr('selected', 'selected');
            });

            $('.price-container').hover(function () {
                var price = $(this).children('.price');
                price.css({display: 'none'});

                var priceContainer = $(this);
                priceContainer.append('<div class="caddyOver"></div>');

                $('.caddyOver').click(function () {
                    // code
                    var stickerCode = price.attr('id');
                    // color
                    var stickerColor = priceContainer.parent().next().css('backgroundColor');
                    // size
                    var stickerSize = priceContainer.next().children('[selected="selected"]').text();
                    // price
                    var text = price.text().toString();
                    var stickerPrice = text.substring(0, text.indexOf(' '));

                    addStickerToCaddy({
                        code: stickerCode, color: stickerColor, size: stickerSize, q:1, price: stickerPrice
                    });
                })
            }, function () {
                $('.price').css({display: 'block'});
                $(this).children('.caddyOver').remove();
            });
        });

});

//functions
function overOn() {
    var cover = $('#cover');
    cover.show();
    cover.fadeTo(300, 0.95);
    var detail = $('#detail');
    detail.show();
    detail.fadeTo(300, 1);
} //end function

function overOut() {
    var detail = $('#detail');
    detail.unbind('click');
    detail.empty();
    var cover = $('#cover');
    cover.fadeTo(300, 0, function () {
        $('#cover').hide();
    });
    detail.fadeTo(300, 0, function () {
        $('#detail').hide();
    });
//    $('body').bind('scroll');
} //end function

function addStickerToCaddy(sticker) {
    var code = sticker.code;

    if (stickers.length == 0) {
        stickers.push(sticker);
    } else {
        var add = true;
        var index = -1;
        $.each(stickers, function (i, item) {
            if (code == item.code) {
                add = false;
                index = i;
            }
        });

        if (add) {
            stickers.push(sticker);
        } else {
            //  quantity++
            stickers[index].q++;
        }
    }
    updateCaddyCount();
} // end function

function showCaddy() {
    $.get('caddy.html', function (data) {
        $('#detail').html(data);
        var stickerTemplates = [];

        $.each(stickers, function (i, item) {
            var code = item.code;
            var color = item.color;
            var size = item.size;
            var q = item.q;
            var price = item.price;

            var sticker = stickerDB[code];
            if (color) sticker.color = color;
            if (size) sticker.size = [size];
            if (price) sticker.price = price;

            stickerTemplates.push(
                '<div class="cartItem">' +
                    '<div class="itemTitle">' + sticker.name + '</div>' +
                    '<div class="points">..............................................</div>' +
                    '<div class="itemSize">' + sticker.size[0] + '</div>' +
                    '<div class="points">.</div>' +
                    '<div class="itemPicker">' +
                    '<div class="itemColor" style="background-color:' + sticker.color + '"></div>' +
                    '</div>' +
                    '<div class="points">.............</div>' +
                    '<div class="itemQ">' + q + '</div>' +
                    '<div class="points">.............</div>' +
                    '<div class="itemPrice">' + sticker.price + '</div>' +
                    '<div class="itemDelete"></div>' +
                    '</div>');
        });
        $('#shoppingCart').children('#cartItems').html(stickerTemplates.join(''));

        $('.itemDelete').click(function() {
            var cartItem = $(this).parent();
            var index = cartItem.index();
            cartItem.remove();
            stickers.splice(index, 1);
            updateCaddyCount();
        });

        $('#next').click(function(){

        });
        updateCaddyCount();

        overOn();
        $('#close').click(function () {
            overOut();
        });
        $(window).resize();
    });
} // end function

function updateCaddyCount() {
    var caddyCount = $('#caddyCount');
    if (stickers.length > 0) {
        caddyCount.css({display: 'block'});

        var q = 0;
        var total = 0;
        $.each(stickers, function(i, item) {
            q += item.q;
            total += item.price * q;
        });
        caddyCount.text(q);

        $('#cartTotal').text('Total : ' + total + ' RON');
    } else {
        caddyCount.css({display: 'none'});
        $('#cartTotal').text('Total : 0 RON');
    }
} // end function
