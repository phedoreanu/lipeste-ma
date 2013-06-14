/*!
 * jQuery miniZoomPan 1.1-beta
 * 2009 Gian Carlo Mingati
 * Version: 1.1-beta (02-DECEMBER-2012)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
$.fn.miniZoomPan = function (settings) {
    settings = $.extend({
        sW:10, // small image width
        sH:10, // small image height
        lW:20, // large image width
        lH:20 // large image height
    }, settings);

    return this.each(function () {
        var div = $(this);
        div.css({width:settings.sW, height:settings.sH});
        var ig = div.children('img');
        div.css({overflow:"hidden"});
        ig.css("backgroundColor", ig.attr('color'));

        var zoomed = false;
        div.mousemove(function (e) {
            var divWidth = div.width();
            var divHeight = div.height();
            var igW = ig.width();
            var igH = ig.height();
            var dOs = div.offset();
            if (zoomed) {
                var leftPan = (e.pageX - dOs.left) * (divWidth - igW) / (divWidth + 2);
                var topPan = (e.pageY - dOs.top) * (divHeight - igH) / (divHeight + 2);
                ig.css({left:leftPan, top:topPan});
            }
        });
        div.hover(
            function (e) {
                var divWidth = div.width();
                var divHeight = div.height();
                var dOs = div.offset();
                var leftPan = (e.pageX - dOs.left) * (divWidth - settings.lW) / (divWidth + 2);
                var topPan = (e.pageY - dOs.top) * (divHeight - settings.lH) / (divHeight + 2);
                ig.animate({left:leftPan, top:topPan, width:settings.lW, height:settings.lH}, 80, 'linear', function () {
                    zoomed = true;
                });
            },function () {
                ig.animate({left:"0", top:"0", width:settings.sW, height:settings.sH}, 100, 'swing', function () {
                    zoomed = false;
                });
            }
        );
    });
};