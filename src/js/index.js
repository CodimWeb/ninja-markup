'use strict'

import $ from 'jquery';

//BS4 components
// import bootstrap from 'bootstrap';

import '../js/slick.min.js';
import select2 from 'select2';

//styles
import '../scss/style.scss';

$(document).ready(function(){
    $('.main-slider .slick-slider').slick({
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 300,
        infinite: true,
        slidesToScroll: 1,
        slidesToShow: 1,
    });

    var header = $('.header');
    $(window).scroll(function() {
        var scrollLength = $(this).scrollTop();
        if(scrollLength > 0) {
             header.addClass('scrolled')
        } else {
            header.removeClass('scrolled') 
        }
    });


    // показ сотава
    var toggleProduct = $('#toggle-product');
    var products = $('.product-item');

    toggleProduct.on('change', function() {
        if(toggleProduct.is(":checked")) {
            products.addClass('show-composition')
        } else {
            products.removeClass('show-composition')
        }
    })

    //показ фильтров
    $('.toggle-filter').on('click', function(){
        $('.filter').fadeIn(250);
    })

    //скрытие фильтров
    $('.btn-close-filter').on('click', function(){
        $('.filter').fadeOut(250);
    })

    // показ редактирования пиццы
    // $('.product-pizza .product-item__picture').on('click', function(){
    //     var offset = $(this).closest('.product-pizza').offset().top;
    //     $('.editor').css('top', offset + 'px');
    //     offset = offset - $('.header').outerHeight(); 
    //     console.log(offset)
    //     $('body,html').animate({scrollTop: offset}, 350);

    //     setTimeout(() => {
    //         document.body.style.overflow = 'hidden';
    //     }, 400);
        
    // })

    // скрытие редактирования пиццы
    // $('.btn-close-editor').on('click', function(){
    //     $('.editor').fadeOut(300);
    //     document.body.removeAttribute('style');
    // })
     

    $('#editor-sauces').select2({
        width: '100%',
        selectionCssClass: 'editor-select',
        dropdownCssClass: 'editor-select__dropdown'
    });

    $('.editor').fadeIn(300, function() {
        console.log('asdasd')
        $('.editor-slider .slick-slider').slick({
            dots: false,
            arrows: true,
            autoplay: false,
            speed: 300,
            infinite: false,
            slidesToScroll: 1,
            slidesToShow: 2,
            prevArrow: $('.editor-slider-prev'),
            nextArrow: $('.editor-slider-next'),
        });
    });
});

