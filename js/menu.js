/* toggle menu */
$(document).ready(function() {
    //toggle menu
    $(".hamburger-container").click(function() {
        $(".navi").slideToggle();
        $('.overlay').toggleClass('open');
    });
    /* click outside to close */
    $('.overlay').click(function() {
        $('.hamburger-container').trigger('click');
    });
    //to fix issue that toggle adds style(hides) to nav
    $(window).resize(function() {
        if (window.innerWidth > 882) {
            $(".navi").removeAttr("style");
        }
    });
    /* sticky nav bar */
    $(window).scroll(function() {
        if ($(this).scrollTop()) {
            $('nav').addClass('sticky')
        } else {
            $('nav').removeClass('sticky')
        }
    });
    //icon animation
    var topBar = $(".hamburger li:nth-child(1)"),
        middleBar = $(".hamburger li:nth-child(2)"),
        bottomBar = $(".hamburger li:nth-child(3)");

    $(".hamburger-container").on("click", function() {
        if (middleBar.hasClass("rot-45deg")) {
            topBar.removeClass("rot45deg");
            middleBar.removeClass("rot-45deg");
            bottomBar.removeClass("hidden");
        } else {
            bottomBar.addClass("hidden");
            topBar.addClass("rot45deg");
            middleBar.addClass("rot-45deg");
        }
    });
});