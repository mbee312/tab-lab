/**
 * Created by albertllavore on 11/19/14.
 */
jQuery(function($) {

    $('a.panel').click(function() {
        var $target = $($(this).attr('href')),
            $other = $target.siblings('.active'),
            animIn = function () {
                $target.addClass('active').show().css({
                    left: -($target.width())
                }).animate({
                    left: 0
                }, 500);
            };

        if (!$target.hasClass('active') && $other.length > 0) {
            $other.each(function(index, self) {
                var $this = $(this);
                $this.removeClass('active').animate({
                    left: -$this.width()
                }, 500, animIn);
            });
        } else if (!$target.hasClass('active')) {
            animIn();
        }
    });

});