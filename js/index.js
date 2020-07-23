// nav
$('.menu').on('click', function(){
    $('.menu-block-mb').stop().fadeToggle(300);
    $(this).toggleClass('active');
});
$('.menu li a').click(function(){
    $('.menu-block-mb').fadeOut();
    $(".menu-m").removeClass("active");
});