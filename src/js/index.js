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

    $('.loader-wrap').fadeOut(1);

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

    // фиксим шапку при открытии модалки
    $('.modal').on('show.bs.modal', function (e) {
        var scrollBarWidth = getScrollbarWidth();
        $('.header').css('right', scrollBarWidth + 'px');
    })
    $('.modal').on('hidden.bs.modal', function (e) {
        var scrollBarWidth = getScrollbarWidth();
        $('.header').removeAttr('style');
    })
     

    // селект в редакторе пицц
    $('#editor-sauces').select2({
        width: '100%',
        selectionCssClass: 'editor-select',
        dropdownCssClass: 'editor-select__dropdown'
    });

    // слайдер редактора пицц
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

    // слайдер в редакторе заказа
    $('#modal-cart').on('shown.bs.modal', function (event) {
        $('.cart-slider .slider').slick({
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
        $('.cart-slider .slick-slider').slick('unslick');
    });

    var phoneInput = document.querySelector("#order-phone");
    if(phoneInput) {
        Inputmask({"mask": "+7(999) 999-99-99"}).mask(phoneInput);
    }

    $('#without-contact').on('change', function() {
        if($(this).is(':checked')) {
            $(this).closest('.order-option').find('.order-option__text').removeClass('dark')
        }
        else {
            $(this).closest('.order-option').find('.order-option__text').addClass('dark')
        }
    })

    $('.select-delivery').select2({
        width: '100%',
        selectionCssClass: 'select-delivery',
        dropdownCssClass: 'select-delivery__dropdown'
    });

    $('.cart-btn-send').on('click', function(){
        $('#modal-cart').css('opacity', '0');
        $('.modal-backdrop').css('opacity', '0');
        $('#modal-auth').modal('show')
    })

    $('#modal-auth').on('hide.bs.modal', function (e) {
        $('#modal-cart').modal('hide');
        $('#modal-cart').removeAttr('style')
        $('.modal-backdrop').removeAttr('style');
        setTimeout(() => {
            $('.modal-auth .modal-title').html('РАДЫ ВАС ВИДЕТЬ!')
            $('.modal-body__content').removeClass('confirm');
        }, 150);
        
    })

    var authInput = document.querySelector("#auth-phone");
    if(authInput) {
        Inputmask({"mask": "+7(999) 999-99-99"}).mask(authInput);
    }

    $('#auth-agreement').on('change', function(){
        var phone = $('#auth-phone').val();
        console.log($(this).is(':checked'))
        console.log(phone)
        if($(this).is(':checked')) {
            if(phone.indexOf('_') == -1) {
                $('#btn-auth-send').removeAttr('disabled');
            }
            else {
                $('#btn-auth-send').attr('disabled', 'disabled');
            }
        }
        else {
            $('#btn-auth-send').attr('disabled', 'disabled');
        }
    })

    $('#auth-phone').on('input', function(e){
        console.log(e.target.value);
        console.log(e.target.value.length);
        console.log($('#auth-agreement').is(':checked'));
        if(e.target.value.indexOf('_') != -1 || !$('#auth-agreement').is(':checked')) {
            $('#btn-auth-send').attr('disabled', 'disabled');
        } else {
            $('#btn-auth-send').removeAttr('disabled');
        }
    });

    $('#btn-auth-send').on('click', function(){
        $('.modal-auth .modal-title').html('ПОДТВЕРЖДЕНИЕ')
        $('.modal-body__content').addClass('confirm');
    })

    $('.confirm-change-phone').on('click', function(e){
        e.preventDefault();
        $('.modal-auth .modal-title').html('РАДЫ ВАС ВИДЕТЬ!')
        $('.modal-body__content').removeClass('confirm');
    })

    $('.mobile-burger-menu').on('click', function(){
        openNav();
    })

    $('.mobile-nav-close').on('click', function(){
        closeNav();
    })

    $('.nav-backdrop').on('click', function(){
        closeNav();
    })
    
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

function openNav() {
    $('.nav-wrap').addClass('visible open');
    $('body').addClass('modal-open')
}

function closeNav() {
    $('.nav-wrap').removeClass('open');
    $('body').removeClass('modal-open')
    if(window.innerWidth > 767) {
        setTimeout(() => {
            $('.nav-wrap').removeClass('visible');
        }, 200);
    }
    else {
        $('.nav-wrap').removeClass('visible');
    }
    
}

