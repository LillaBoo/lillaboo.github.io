$(document).ready(function() {

    $(window).scroll(function() {
        // Высота проявления кнопки
        if ($(this).scrollTop() > 100) {
            $('#go-to-top').fadeIn();
            $('#go-to-top').css('z-index', '1000');
        } else {
            $('#go-to-top').css('z-index', '0');
            $('#go-to-top').fadeOut();

        }
    });
    
    $('#go-to-top').click(function() {
        $('body,html').animate({
            scrollTop: 0
        // Скорость подъема
    }, 300);
        return false;
    });

//$(window).resize();


});

$(window).resize(function() {
    var docHeight = $(window).height();
    var footerHeight = $('.footer').height();
    var footerTop = $('.footer').position().top + footerHeight;

    if (footerTop < docHeight) {
        $('.footer').css('margin-top', (docHeight - footerTop) + 'px');

    };

});

function openNav() {
  var docWidth = $(window).width();
  $("#mySidenav").show();
  if (docWidth <= 767) {
  $("#mySidenav").css("width", "95%");
  } else {
  $("#mySidenav").css("width", "300px");
  }
}

function closeNav() {
  $("#mySidenav").css("width", "0");
}