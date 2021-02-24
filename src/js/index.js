'use strict'

import $ from 'jquery';

//BS4 components
// import bootstrap from 'bootstrap';
import Modal from 'bootstrap/js/dist/modal'
import Tab from 'bootstrap/js/dist/tab'

import '../js/slick.min.js';
import select2 from 'select2';
import Inputmask from "inputmask";

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
    $('.product-pizza .product-item__picture').on('click', function(){
        var offset = $(this).closest('.product-pizza').offset().top;
        $('.editor').css('top', offset + 'px');
        offset = offset - $('.header').outerHeight();
        var currScroll =  $(window).scrollTop();
        var scrollLenght = Math.ceil(Math.abs(offset - currScroll));
        var animationTime = scrollLenght * 1.2;

        // console.log(offset)
        // console.log($(window).scrollTop(), 'scroll');
        // console.log(scrollLenght)
        $('body,html').animate({scrollTop: offset}, animationTime).promise().then(function() {
            console.log('end animate');
            var scrollBarWidth = getScrollbarWidth()
            document.body.style.paddingRight = scrollBarWidth + 'px';
            document.body.style.overflow = 'hidden';
            $('.editor').addClass('open')
        });
    })

    //скрытие редактирования пиццы
    $('.btn-close-editor').on('click', function(){
        $('.editor').removeClass('open');
        document.body.removeAttribute('style');
    })
     

    $('#editor-sauces').select2({
        width: '100%',
        selectionCssClass: 'editor-select',
        dropdownCssClass: 'editor-select__dropdown'
    });

    $('.editor-slider .slick-slider').slick({
        dots: false,
        arrows: true,
        autoplay: false,
        draggable: false,
        speed: 300,
        infinite: false,
        slidesToScroll: 1,
        slidesToShow: 1,
        variableWidth: true,
        prevArrow: $('.editor-slider-prev'),
        nextArrow: $('.editor-slider-next'),
    });

    $('.editor-slider__item').on('click', function(){
        if($(this).hasClass('active')) {
            $(this).removeClass('active')
        } else {
            $(this).addClass('active')
        }
    })

    var cartSlick;

    $('#modal-cart').on('shown.bs.modal', function (event) {
        cartSlick = $('.cart-slider .slider').slick({
            dots: false,
            arrows: true,
            autoplay: false,
            draggable: false,
            speed: 300,
            infinite: false,
            slidesToScroll: 1,
            slidesToShow: 3,
            prevArrow: $('.cart-slider-prev'),
            nextArrow: $('.cart-slider-next'),
        });
    })

    $('#modal-cart').on('hidden.bs.modal', function (event) {
        // cartSlick.destroy();
        $('.cart-slider .slick-slider').slick('unslick');
    });

    var phoneInput = document.querySelector("#order-phone");
    if(phoneInput) {
        Inputmask({"mask": "+7(999) 999-99-99"}).mask(phoneInput);
    }

    $('#without-contact').on('change', function() {
        if($(this).is(':checked')) {
            console.log('checked')
            $(this).closest('.order-option').find('.order-option__text').removeClass('dark')
        }
        else {
            $(this).closest('.order-option').find('.order-option__text').addClass('dark')
            console.log('unchecked')
        }
    })

    $('.select-delivery').select2({
        width: '100%',
        selectionCssClass: 'select-delivery',
        dropdownCssClass: 'select-delivery__dropdown'
    });
});

function getScrollbarWidth() { 
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv)
    var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    console.log(scrollbarWidth);
    return scrollbarWidth
}

