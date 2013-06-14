// JavaScript Document

var stickers = [];
var stickerDB = {};
var currency = 'RON';

var ptns = [];
var currentX = 0;
var patternCount = 0;
var patternWidth = 210;
var patternSpacer = 10;
var displacement = 15;

$(document).ready(function () {

    //init menu
    var selectedMenuPosition = $('li:first-child').outerWidth(true) / 2 - 23;
    $('ul').css('background-position', selectedMenuPosition + 'px' + ' 15px');

    //assign actions to buttons
    var caddy = $('#caddy');
    caddy.click(function () {
        showCaddy();
    });
    caddy.hover(
        function () {
            $(this).css({opacity: 0.4});
        },
        function () {
            $(this).css({opacity: 1});
        }
    );

    $('li').click(
        function () {

            //menu selected position
            var ul = $('ul');
            ul.addClass('ul-ease');
            var index = $(this).index();

            var outerWidth = $(this).outerWidth(true);
            var withUntilNow = 0;

            $('li').each(function (i, item) {
                if (i == index) return false;
                withUntilNow += $(this).outerWidth(true);
            });
            var selectedMenuPosition = withUntilNow + outerWidth / 2 - 23;

            ul.css({'backgroundPosition': selectedMenuPosition + 'px 15px'});

            //change banner
            changeBanner(index);

        }
    );

    //add pattern
    $.getJSON('data/patternData.json', {format: "json"},function (data) {

        var ptn = [];
        var text = [];
        var topLeft = '';
        var pos = [];
        var posx = 0;
        var posy = 0;

        $.each(data.patterns, function (i, item) {

            ptn = [];

            $.each(item.stickers, function (i, sticker) {

                topLeft = sticker.topLeft;
                pos = topLeft.split(', ');
                posx = Number(pos[0]);
                posy = Number(pos[1]);

                ptn.push('<div class="ptn" style="position: absolute; top:' + posy + 'px; left:' + posx + 'px;">' +
                    '<img src="img/ptns/' + sticker.url + '" />' +
                    '</div>');

            });

            $.each(item.texts, function (i, text) {
//                alert(text);
            });

            ptns.push(ptn);
        });

        //add pattern to DOM
        $('<div/>', {
            class: 'pattern',
            html: ptns[0].join('')
        }).appendTo('#banner');

        patternCount = ptns[0].length;

    }).success(function () {
            updateBannerSize();
            updateBannerHighlights();
        }
    );

    //add images
    $.getJSON('data/decalsData.json', {format: "json"},function (data) {
        var items = [];

        $.each(data.decals, function (i, item) {
            stickerDB[item.code] = item;
            var colors = [];
            $.each(item.colors, function (i, color) {
                colors.push('<div class="color"><div class="color-mini" style="background-color:' + color + ';"></div></div>');
            });

            var sizez = [];
            $.each(item.size, function (i, size) {
                sizez.push('<div class="size" price="' + item.price[i] + '"><div class="size-text">' + size + '</div></div>');
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
                    '<div class="price-container"><div id="' + item.code + '" class="price">' + item.price[0] + ' ' + currency + '</div></div>' +
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

        var totalHeight = Math.ceil(items.length / 4) * 250 + 430;
        $('footer').css({top: totalHeight + 'px'});
        //$('#content').css({height: totalHeight+'px'});

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
            addSizer('.sizez', '.size', {}, {}, '.price-container');

            var priceContainer = $('.price-container');
            priceContainer.click(function () {
                var price = $(this).children('.price');
                // code
                var stickerCode = price.attr('id');
                // color
                var stickerColor = $(this).parent().next().css('backgroundColor');
                // size
                var stickerSize = $(this).next().children('[selected="selected"]').text();
                // price
                var text = price.text().toString();
                var stickerPrice = text.substring(0, text.indexOf(' '));

                addStickerToCaddy({
                    code: stickerCode, color: stickerColor, size: stickerSize, q: 1, price: stickerPrice
                });
            });
            priceContainer.hover(function () {
                $(this).children('.price').css({display: 'none'});
                $(this).append('<div class="caddy-over"></div>');
            }, function () {
                $(this).children('.price').css({display: 'block'});
                $(this).children('.caddy-over').remove();
            });


        }); //end succes function

    //onResize
    $(window).resize(function () {

        $('#shoppingCart').css({'top': $(window).height() / 2 - 200,'left': $(window).width() / 2 - 300});

        $('#orderForm').css({'top': $(window).height() / 2 - 200,'left': $(window).width() / 2 - 300,opacity:1});//.animate({opacity:1},500);

        $('#zoomedImage').css({top: $(window).height() / 2 - 327, left: $(window).width() / 2 - 500});

        var startPosition = ($(window).width() - 996) / 2 + 30;
        var endPosition = ($(window).width() - 996) / 2 + $('li:eq(4)').position().left;

    });

    //onResizeEnd
    $(window).resizeend({
            onDragEnd: function () {
                updateBannerSize();
                updateBannerHighlights();
            },
            runOnStart: false
        }
    );
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

} //end function

function addStickerToCaddy(sticker) {

    var code = sticker.code;
    var color = sticker.color;
    var size = sticker.size;
    if (stickers.length == 0) stickers.push(sticker);
    else {
        var add = true;
        var index = -1;
        $.each(stickers, function (i, item) {
            if (code == item.code && $.Color(color).toRgbaString() == $.Color(item.color).toRgbaString() && size == item.size) {
                add = false;
                index = i;
            }
        });
        if (add) stickers.push(sticker);
        else stickers[index].q++;
    }
    updateCaddyCount();

} //end function

function showCaddy() {
    if ($('#caddyCount').css('display') == 'block') {
        $.get('caddy.html', function (data) {
            $('#detail').html(data);
            var stickerCartItems = [];

            $.each(stickers, function (i, item) {
                var code = item.code;
                var color = item.color;
                var size = item.size;
                var q = item.q;
                var price = item.price;

                var sticker = stickerDB[code];

                var colors = [];
                $.each(sticker.colors, function (i, color) {
                    // max 9 colors - for design purposes
                    if(i == 9) return false;
                    var colorItem = '<div class="item-color"><div class="color-mini" style="background-color:' + color + ';"></div></div>';
                    if ($.Color(color).toRgbaString()  == $.Color(item.color).toRgbaString()) {
                        // add to the begining - color "0"
                        colors.unshift(colorItem);
                    } else {
                        colors.push(colorItem);
                    }
                });

                var sizez = [];
                $.each(sticker.size, function (i, size) {
                    sizez.push(
                        '<div class="item-size" price="' + sticker.price[i] + '"' + (size == item.size ? ' selected="selected" ' : '') + '>' +
                            '<div class="size-text">' + size + '</div>' +
                            '</div>');
                });

                var qs = [];
                for (var k = 1; k < 6; k++) {
                    qs.push(
                        '<div class="item-q" ' + (q == k ? ' selected="selected" ' : '') + '>' +
                            '<div class="size-text">' + k + '</div>' +
                            '</div>');
                }

                stickerCartItems.push(
                    '<div class="cart-item">' +
                        '<div class="item-title">' + sticker.name + '</div>' +
                        '<div class="points">...................................................</div>' +
                        '<div class="item-picker">' +
                        colors.reverse().join('') +
                        '</div>' +
                        '<div class="points" style="margin-left:20px;">...</div>' +
                        '<div class="item-sizez">' +
                        sizez.join('') +
                        '</div>' +
                        '<div class="points">.............</div>' +
                        '<div class="item-q-container">' +
                        qs.join('') +
                        '</div>' +
                        '<div class="points">.............</div>' +
                        '<div class="item-price"><div>' + price + '</div></div>' +
                        '<div class="item-delete"></div>' +
                        '</div>');
            });
            $('#shoppingCart').children('#cartItems').html(stickerCartItems.join(''));

            // show picker -- TODO:can be extracted
            var itemPicker = $('.item-picker');
            itemPicker.children(':last-child').mouseenter(function () {
                $(this).parent().prev().css({opacity:0});

                $(this).parent().children('.item-color').slice(0, $(this).children('.item-color').length - 1).css({opacity: 1, display: 'block'});
            }).css({opacity: 1, display: 'block'});

            itemPicker.mouseleave(function () {
                var picker = $(this);
                // fuck off
                picker.children('.item-color').slice(0, $(this).children('.item-color').length - 1).css({opacity: 0, display: 'none'});

                // switch colors
                // color "0"
                var colorZero = picker.children('.item-color:last-child').children(':only-child');
                var oldColor = colorZero.css('backgroundColor');
                var newColor = picker.attr('selectedcolor');
                colorZero.css({'backgroundColor': newColor});
                // replacing
                picker.children().slice(0, $(this).children('.item-color').length - 1).children('.color-mini').filter(function () {
                    if ($(this).css('backgroundColor') == newColor) {
                        $(this).css('backgroundColor', oldColor);
                    }
                });

                // showing the points
                picker.prev().css({opacity:1});
            });

            // select color
            $('.item-color').click(function () {
                var itemColor = $(this);

                // setting new color
                var color = itemColor.children().css('backgroundColor');
                itemColor.parent().attr('selectedcolor', color);

                // sticker index
                var index = itemColor.parent().parent().index();
                stickers[index].color = color;
            });
            /*end extraction*/


            $('.item-price').on('caddyCount', function () {
                var index = $(this).parent().index();
                stickers[index].price = $(this).children().text();
                updateCaddyCount();
            });

            $('.item-q').on('caddyCount', function () {
                var index = $(this).parent().parent().index();
                stickers[index].q = Number($(this).children().text());
                updateCaddyCount();
            });

            $('.item-delete').click(function () {
                var cartItem = $(this).parent();
                var index = cartItem.index();
                cartItem.remove();
                stickers.splice(index, 1);
                updateCaddyCount();
            });

            var next = $('.next');
            next.click(function () {
                if (stickers.length > 0) {
                    showOrderForm();
                }
            });
            next.hover(function () {
                if (stickers.length > 0) {
                    $(this).css({opacity:1});
                }
            }, function() {
                if (stickers.length > 0) {
                    $(this).css({opacity:0.6});
                }
            });
            $('.close').click(function () {
                overOut();
            });
            updateCaddyCount();
            overOn();

            $(window).resize();

            addSizer('.item-sizez', '.item-size', {top: -8}, {top: 0}, '.item-price', true);
            addSizer('.item-q-container', '.item-q', {top: -10, zIndex: 4}, {top: 0, zIndex: 3});
        });
    }

} //end function

function showOrderForm() {
    $('#shoppingCart').empty();

    $.get('client.html', function (data) {
        $('#detail').html(data);

        $('.prev').click(function () {
            showCaddy();
        });

        $('.next').click(function () {
//            TODO:completeOrder();
        });

        $('.close').click(function () {
            overOut();
        });

        $(window).resize();
    });
}

function updateCaddyCount() {
    var caddyCount = $('#caddyCount');
    if (stickers.length > 0) {
        caddyCount.css({display: 'block'});

        var q = 0;
        var total = 0;
        $.each(stickers, function (i, item) {
            q += item.q;
            total += item.price * item.q;
        });
        caddyCount.text(q);

        $('#cartTotal').text('Total : ' + total + ' ' + currency);
    } else {
        caddyCount.css({display: 'none'});
        $('#cartTotal').text('Total : 0 ' + currency);
    }

} //end function

function updateBannerHighlights() {

    var startPosition = ($(window).width() - 996) / 2 + 30;
    var endPosition = ($(window).width() - 996) / 2 + $('li:eq(4)').position().left;

    $('.ptn').each(function (index, element) {
        p = $(this).position();
        if (p.left > startPosition && p.left < endPosition) $(this).delay(Math.random() * 500).fadeTo(Math.random() * 200 + 300, .4);
        else $(this).delay(Math.random() * 500).fadeTo(Math.random() * 200 + 300, .1);
    });

} //end function

function updateBannerSize() {

    var maxX = $(window).width() + displacement;

    if (currentX < maxX) {
        while (currentX < maxX) {
            currentX = $('.ptn').filter(':eq(' + ($('.ptn').length - patternCount) + ')').position().left + patternWidth + patternSpacer;
            if (currentX < maxX) $('.ptn').filter(':eq(' + ($('.ptn').length - patternCount) + ')').clone().css({left: currentX, opacity: 0}).appendTo('.pattern');
        }
    }
    else {
        while (currentX > maxX) {
            currentX = $('.ptn').filter(':eq(' + ($('.ptn').length - 1) + ')').position().left;
            if (currentX > maxX) $('.ptn').filter(':eq(' + ($('.ptn').length - 1) + ')').remove();
        }
    }

} //end function

function changeBanner(index) {

    var bannerCount = $('.ptn').length;
    $(ptns[index].join('')).appendTo('.pattern');
    currentX = 0;
    updateBannerSize();
    $('.ptn').each(function (index) {
        if (index < bannerCount) {
            var newX = $(this).position().left - $(window).width() - patternSpacer - displacement;
            $(this).delay(index * 30 + Math.random() * 10).animate({left: newX + 'px'}, 1470 + Math.random() * 30, 'swing', function () {
                $(this).remove()
            });
        }
        else {
            var newX = $(this).position().left + $(window).width() + patternSpacer + displacement;
            $(this).css({left: newX, opacity: .1});
            var newX = $(this).position().left - $(window).width() - patternSpacer - displacement;
            if (index >= bannerCount && index < $('.ptn').length - 1) $(this).delay(index * 30 + Math.random() * 10).animate({left: newX + 'px'}, 1470 + Math.random() * 30, 'swing', function () {
            });
            else if (index == $('.ptn').length - 1) $(this).delay(index * 30 + Math.random() * 10).animate({left: newX + 'px'}, 1470 + Math.random() * 30, 'swing', function () {
                updateBannerHighlights();
            });
        }
    });

} //end function

function addSizer(containerClass, itemClass, customCssOn, customCssOff, priceClass, hideCurrency) {
    $(containerClass).hover(function () {
        var defaultCss = {backgroundImage: 'url(img/arrow90.png)', backgroundPosition: '18px 3px',
            height: $(this).children(itemClass).length * 10.4, borderRadius: 6
        };
        // merging the two objects customCssOn in defaultCss
        $.extend(defaultCss, customCssOn);
        $(this).css(defaultCss);

        $(this).children(itemClass).show(200);
    }, function () {
        var sizez = $(this);
        var defaultCss = {height: 13, backgroundImage: 'url(img/arrow.png)', backgroundPosition: '15px 4px', borderRadius: 13
        };
        // merging the two objects customCssOn in defaultCss
        $.extend(defaultCss, customCssOff);
        sizez.css(defaultCss);
        var size = sizez.children('[selected="selected"]');
        if (size.length == 0) {
            sizez.children(':gt(0)').hide();
        } else {
            sizez.children('[selected!="selected"]').hide();
            size.children('.size-text').css({fontSize: 11, color: 'rgb(255, 255, 255)'});

            if (priceClass) {
                var newPrice = size.attr('price') + (hideCurrency ? ' ' : ' ' + currency);
                size.parent().siblings(priceClass).children().text(newPrice).trigger("caddyCount");
            }
        }
    });

    var size = $(itemClass);
    size.mouseenter(function () {
        var size = $(this);
        size.parent().css({backgroundPosition: '18px ' + (size.index() * 10 + 2) + 'px'});

        if (priceClass) {
            var newPrice = $(this).attr('price') + (hideCurrency ? ' ' : ' ' + currency);
            $(this).parent().siblings(priceClass).children().text(newPrice);
        }
    });

    size.click(function () {
        $(this).siblings().attr('selected', null);

        $(this).attr('selected', 'selected');

        if (priceClass) {
            var newPrice = $(this).attr('price') + (hideCurrency ? ' ' : ' ' + currency);
            $(this).parent().siblings(priceClass).children().text(newPrice).trigger("caddyCount");
        } else {
            $(this).trigger("caddyCount");
        }
    });

    // show sizez
    if (size.siblings('[selected="selected"]').length == 0) {
        size.siblings(':first-child').attr('selected', 'selected').show();
    } else {
        size.siblings('[selected="selected"]').show();
    }
} // end function
// eof