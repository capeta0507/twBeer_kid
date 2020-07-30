// nav
$('.menu').on('click', function(){
    $('.menu-block-mb').stop().fadeToggle(300);
    $(this).toggleClass('active');
});
$('.menuBlock li a').click(function(){
    $('.menu-block-mb').fadeOut();
    $(".menu").removeClass("active");
});
// 快速移動到該區塊
// mb
$(".menuBlock li a").click(function () {
    var typename = $(this).attr('href');
    $('html,body').animate({
        scrollTop: $(typename).offset().top
    }, 1000);
});
// pc
$(".menuPc div a").click(function () {
    var typename = $(this).attr('href');
    $('html,body').animate({
        scrollTop: $(typename).offset().top
    }, 1000);
});