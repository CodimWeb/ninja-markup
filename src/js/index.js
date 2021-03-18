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

    // GET params
    var getParams = (function() {
        var params = window.location.href.split('?')[1];
        if(params) {
            var b = new Object();
            params = params.split("&");
            for (var i = 0; i < params.length; i++) {
                var c = params[i].split("=");
                b[c[0]] = c[1];
            }
            return b;
        }    
    })();

    // если есть get параметры скролим или свайпим
    if(getParams) {
        if($(window).outerWidth() > 767) {
            smoothScroll(getParams['target'])
        }
        else {
            getProductGroup(getParams['slide'])
            closeNav()
        }
    }

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
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    swipe: false,
                }
            },
        ]
    });

    $('.main-slider .slick-item').on('click', function(){
        if($(window).outerWidth() < 768) {
            $('.modal-sales').modal('show')
        }
    })
    
    
    $('#modal-sales').on('shown.bs.modal', function (event) {
        $('.sales-slider').slick({
            dots: true,
            arrows: true,
            prevArrow: $('.sales-slider-prev'),
            nextArrow: $('.sales-slider-next'),
            autoplay: true,
            autoplaySpeed: 4000,
            speed: 300,
            infinite: true,
            slidesToScroll: 1,
            slidesToShow: 1,
            asNavFor: '.main-slider .slick-slider'
        });
    })

    $('.sales-slider').on('init', function(event){
        $('#modal-sales .modal-body').addClass('init')
        console.log(event, 'edge was hit')
    });

    $('#modal-sales').on('hidden.bs.modal', function (event) {
        $('.sales-slider').slick('unslick');
        $('#modal-sales .modal-body').removeClass('init')
    })

    $(window).on('orientationchange', function() {
        if($('.sales-slider').length) {
            var slider = $('.sales-slider')[0].slick;
            // console.log(slider);
            if(slider) {
                $('.sales-slider')[0].slick.refresh();
            }
        }    
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
        $('body').addClass('filter-open');
    })

    //скрытие фильтров
    $('.btn-close-filter').on('click', function(){
        $('.filter').fadeOut(250);
        $('body').removeClass('filter-open');
    })

    // показ редактирования пиццы
    $('.product-pizza .product-item__picture').on('click', function(){
        var offset = $(this).closest('.product-pizza').offset().top;
        // $('.editor').css('top', offset + 'px');
        // offset = offset - ($('.header').outerHeight() / 2) - ($(window).outerHeight() / 2) + ($(this).closest('.product-pizza').outerHeight(true) / 2); //
        offset = offset - $('.header').outerHeight() - (($(window).outerHeight() - $('.header').outerHeight() - $(this).closest('.product-pizza').outerHeight())/2);
        console.log(offset);
        console.log($(window).outerHeight())
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
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        variableWidth: true,
                    }
                },
                // {
                //     breakpoint: 600,
                //     settings: {
                //         slidesToShow: 2,
                //         slidesToScroll: 2
                //     }
                // },
                // {
                //     breakpoint: 480,
                //     settings: {
                //         slidesToShow: 1,
                //         slidesToScroll: 1
                //     }
                // }
            ]
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
            $('.modal-auth .modal-title--desktop').html('РАДЫ ВАС ВИДЕТЬ!')
            $('.modal-auth .modal-body').removeClass('confirm');
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
            if(phone.indexOf('_') == -1 && phone.length > 0) {
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
        $('.modal-auth .modal-title--desktop').html('ПОДТВЕРЖДЕНИЕ')
        $('.modal-auth .modal-body').addClass('confirm');
    })

    $('.confirm-change-phone').on('click', function(e){
        e.preventDefault();
        $('.modal-auth .modal-title--desktop').html('РАДЫ ВАС ВИДЕТЬ!')
        $('.modal-auth .modal-body').removeClass('confirm');
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


    var header = $('.header');
    var homeSlider = $('.main-slider');
    var productNav = $('.product-nav');
    var offsetTop = 0;
    var horizontalStartPoint;
    var horizontalEndPoint;
    var horizontalDelta = 0;
    var verticalStartPoint;
    var verticalEndPoint;
    var verticalDelta = 0;
    var currentSlide = 0;

    if(document.querySelector('.product-list-wrap')) {
        document.querySelector('.product-list-wrap').addEventListener('touchstart', function (event) {
            horizontalStartPoint = event.changedTouches[0].pageX;
            verticalStartPoint = event.changedTouches[0].pageY;
        }, false);
    
        document.querySelector('.product-list-wrap').addEventListener('touchend', function (event) {
            horizontalEndPoint = event.changedTouches[0].pageX;
            verticalEndPoint = event.changedTouches[0].pageY;
            horizontalDelta = horizontalEndPoint - horizontalStartPoint;
            verticalDelta = verticalEndPoint - verticalStartPoint ;
            
            if (horizontalDelta > 80) {
                console.log(Math.abs(horizontalDelta), 'horizontalDelta')
                console.log(Math.abs(verticalDelta), 'verticalDelta')
                if(Math.abs(horizontalDelta) > Math.abs(verticalDelta)) {
                    console.log('right');
                    if(currentSlide > 0) {
                        currentSlide--;
                        getProductGroup(currentSlide)
                    }
                    
                }
                else {
                    console.log('verical')
                }
            }
            else if (horizontalDelta < -80) {
                console.log(Math.abs(horizontalDelta), 'horizontalDelta')
                console.log(Math.abs(verticalDelta), 'verticalDelta')
                if(Math.abs(horizontalDelta) > Math.abs(verticalDelta)) {
                    console.log('left');
                    if(currentSlide < 6) {
                        currentSlide++;
                        getProductGroup(currentSlide)
                    }    
                    
                }
                else {
                    console.log('vertical')
                }
            }
        }, false);
    }

    if($(window).outerWidth() < 768) {
        var height = $('.product-group-set').outerHeight() + 'px';
        $('.product-list').css('height', height)
    }

    var isResize = false;
    $(window).resize(function(){
        if($(window).outerWidth() < 768) {
            if(!isResize) {
                isResize = true;
                var height = $('.product-group-set').outerHeight() + 'px';
                $('.product-list').css('height', height)
                currentSlide = 0;
                getProductGroup(currentSlide)
            }    
        }
        else {
            $('.product-list').css('height', 'auto')
            isResize = false;
        }
    })

    $('.product-nav__item').on('click', function(){
        $('.product-nav__item').removeClass('active');
        $(this).addClass('active');
        var target = $(this).attr('data-target');
        if(target == 'show-set') {
            currentSlide = 0;
            getProductGroup(currentSlide)
        }
        else if(target == 'show-pizza') {
            currentSlide = 1;
            getProductGroup(currentSlide)
        }
        else if(target == 'show-hot') {
            currentSlide = 2;
            getProductGroup(currentSlide)
        }
        else if(target == 'show-salads') {
            currentSlide = 3;
            getProductGroup(currentSlide)
        }
        else if(target == 'show-deserts') {
            currentSlide = 4;
            getProductGroup(currentSlide)
        }
        else if(target == 'show-sauces') {
            currentSlide = 5;
            getProductGroup(currentSlide)
        }
        else if(target == 'show-drinks') {
            currentSlide = 6;
            getProductGroup(currentSlide)
        }
        
        document.querySelector('.product-list').setAttribute('class', 'product-list' + ' ' + target);
    })

    $('.smooth').on('click', function(e) {
        e.preventDefault();
        $('.smooth').removeClass('active');
        $(this).addClass('active');
        var target = $(this).attr('data-target');
        var currentSlide = $(this).attr('data-slide');
        if($(window).outerWidth() > 767) {
            smoothScroll(target)
        }
        else {
            getProductGroup(currentSlide)
            closeNav()
        }
    })
    

    if(productNav.length > 0) {
        $(window).scroll(function() {
            var scrollLength = $(this).scrollTop();
            // offsetTop = homeSlider.offset().top + homeSlider.outerHeight() - productNav.outerHeight() - header.outerHeight();
            offsetTop = homeSlider.offset().top - (homeSlider.offset().top / 2);
        
            if(scrollLength >= offsetTop) {
                productNav.addClass('visible')
            } else {
                productNav.removeClass('visible') 
            }
        });
    }    
    
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

function getProductGroup(currentSlide) {
    if(currentSlide == 0) {
        var height = $('.product-group-set').outerHeight() + 'px';
        var target = 'show-set';
    }
    else if(currentSlide == 1) {
        var height = $('.product-group-pizza').outerHeight() + 'px';
        var target = 'show-pizza';
    }
    else if(currentSlide == 2) {
        var height = $('.product-group-hot').outerHeight() + 'px';
        var target = 'show-hot';
    }
    else if(currentSlide == 3) {
        var height = $('.product-group-salads').outerHeight() + 'px';
        var target = 'show-salads';
    }
    else if(currentSlide == 4) {
        var height = $('.product-group-deserts').outerHeight() + 'px';
        var target = 'show-deserts';
    }
    else if(currentSlide == 5) {
        var height = $('.product-group-sauces').outerHeight() + 'px';
        var target = 'show-sauces';
    }
    else if(currentSlide == 6) {
        var height = $('.product-group-drinks').outerHeight() + 'px';
        var target = 'show-drinks';
    }
    else if(currentSlide == 7) {
        var height = $('.product-group-pizza').outerHeight() + 'px';
        var target = 'show-combo';
    }
    
    $('.product-list').attr('class', 'product-list' + ' ' + target);
    $('.product-list').css('height', height)
    $('.product-nav__item').removeClass('active');
    $('[data-target='+target+']').addClass('active');

    setTimeout(function() {
        scrollToProduct();
    }, 250)
}

function scrollToProduct() {
    var header = $('.header');
    var homeSlider = $('.main-slider');
    var productNav = $('.product-nav');
    var offsetTop = 0;
    offsetTop = homeSlider.offset().top + homeSlider.outerHeight() - productNav.outerHeight() - header.outerHeight();
    $('body,html').animate({scrollTop: offsetTop}, 200);
};

function smoothScroll(target) {
    console.log(target);
    var offsetTop = $(target).offset().top - $('.header').outerHeight();
    $('body,html').animate({scrollTop: offsetTop}, 800);
}

