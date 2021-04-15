'use strict'

import $ from 'jquery';

//BS4 components
// import bootstrap from 'bootstrap';
import Util from 'bootstrap/js/dist/util.js'
import Modal from 'bootstrap/js/dist/modal'
import Tab from 'bootstrap/js/dist/tab'
import ScrollSpy from 'bootstrap/js/dist/scrollspy'

import '../js/slick.min.js';
import select2 from 'select2';
import Inputmask from "inputmask";

//styles
import '../scss/style.scss';

var showMeat = false;
var showGreen = false;
var showCheese = false;
var showAdditional = false;

$(document).ready(function(){

    // $('.modal').on('shown.bs.modal', function (e) {
    //     $('html').addClass('disable-scroll-ios'); 
    //     $('body').addClass('disable-scroll-ios');
    // });
    // $('.modal').on('hidden.bs.modal', function (e) {
    //     $('html').removeClass('disable-scroll-ios');
    //     $('body').removeClass('disable-scroll-ios');
    // });

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

            var newUrl = window.location.href.split('?')[0]; 
            window.history.pushState('name', '', newUrl);
            return b;
        }    
    })();

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

    console.log($('.header').outerHeight());

    $('body').scrollspy({ 
        target: '#navbar-example',
        offset:  150,
    })

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

    $('.main-slider .slick-item').on('click', function(){
        if($(window).outerWidth() < 768) {
            $('.modal-sales').modal('show')
        }
    })

    var activeSlide = 0;

    $('.main-slider .slick-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        activeSlide = nextSlide;
    });
    
    
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
        $('.sales-slider').slick('slickGoTo', activeSlide, true);
    })

    $('.sales-slider').on('init', function(event){
        $('#modal-sales .modal-body').addClass('init')
    });

    $('#modal-sales').on('hidden.bs.modal', function (event) {
        $('.sales-slider').slick('unslick');
        $('#modal-sales .modal-body').removeClass('init')
    })

    $(window).on('orientationchange', function() {
        if($('.sales-slider').length) {
            var slider = $('.sales-slider')[0].slick;
            console.log(slider);
            if(slider && $('body').hasClass('modal-open')) {
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
        offset = offset - $('.header').outerHeight() - (($(window).outerHeight() - $('.header').outerHeight() - $(this).closest('.product-pizza').outerHeight())/2);
        console.log(offset);
        console.log($(window).outerHeight())
        var currScroll =  $(window).scrollTop();
        var scrollLenght = Math.ceil(Math.abs(offset - currScroll));
        var animationTime = scrollLenght * 1.2;

        $('body,html').animate({scrollTop: offset}, animationTime).promise().then(function() {
            console.log('end animate');
            var scrollBarWidth = getScrollbarWidth()
            document.body.style.paddingRight = scrollBarWidth + 'px';
            document.body.style.overflow = 'hidden';
            $('.editor').addClass('open')
            $('html').addClass('disable-scroll-ios');
            $('body').addClass('disable-scroll-ios');
        });
    })

    //скрытие редактирования пиццы
    $('.btn-close-editor').on('click', function(){
        $('.editor').removeClass('open');
        document.body.removeAttribute('style');
        $('html').removeClass('disable-scroll-ios');
        $('body').removeClass('disable-scroll-ios');
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

    // var isResize = false;
    $(window).resize(function() {
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function(){
            console.log('Resized finished.');
            var scrollLenght = $(window).scrollTop();
            console.log(scrollLenght)
            if($(window).outerWidth() < 768) {
                var height = $('.product-group-set').outerHeight() + 'px';
                $('.product-list').css('height', height)
                if(scrollLenght >= 100) { // что б не скролилось к наборам если юзер смотрит слайдер
                    currentSlide = 0;
                    getProductGroup(currentSlide) 
                }
            }
            else {
                $('.product-list').css('height', 'auto')
            }
        }, 250);
    });

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
        // $('.smooth').removeClass('active');
        // $(this).addClass('active');
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
    
    /* ORDERS */

    var addressSlider = $('.address-slider');
    var fillialSlider = $('.fillial-slider');
    addressSlider.slick({
        dots: false,
        arrows: true,
        autoplay: false,
        draggable: false,
        swipe: false,
        variableWidth: true,
        speed: 300,
        infinite: false,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    draggable: true,
                    swipe: true,
                }
            },
        ]
    }); 

    fillialSlider.slick({
        dots: false,
        arrows: true,
        autoplay: false,
        draggable: false,
        swipe: false,
        variableWidth: true,
        speed: 300,
        infinite: false,
        slidesToScroll: 1,
        // slidesToShow: 2,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    draggable: true,
                    swipe: true,
                    variableWidth: false,
                    slidesToShow: 1,
                }
            },
        ]
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
        event.target // newly activated tab
        event.relatedTarget // previous active tab

        //доставка
        if (event.target.id == 'delivery-tab') {
            console.log('delivery')
        }
        // самовывоз
        else if(event.target.id == 'pickup-tab') {
            $('.detail-address-wrap').removeClass('active');
            console.log('pickup')
        }        
    })

    $('.address-add').on('click', function(){
        $('.detail-address-wrap').addClass('active');
    })

    $('.radio-input').on('change', function(){
        $('.detail-address-wrap').removeClass('active');
    })
    
    
    /* END ORDERS */

    /*CONSTRUCTOR*/
    $('.constructor__help__toogle').on('click', function(){
        if($(this).hasClass('off')) {
            $(this).removeClass('off');
            $('.constructor__help__toogle__text').html('ВКЛ.');
        }
        else {
            $(this).addClass('off')
            $('.constructor__help__toogle__text').html('ВЫКЛ.');
        }
    })

    var pizzulkinStep = 0;
    var sauces = [
        {
            id: '368',
            name: 'Соус «Дижонский сметанный»',
            img: '/img/constructor/sauces/dijonskiy.jpg',
            zIndex: 10,
        },
        {
            id: '367',
            name: 'Соус «Классический»',
            img: '/img/constructor/sauces/classic.jpg',
            zIndex: 10,
        },
        {
            id: '569',
            name: 'Соус «Цезарь»',
            img: '/img/constructor/sauces/cesar.jpg',
            zIndex: 10,
        },
        {
            id: '369',
            name: 'Соус «Пикантный томатный»',
            img: '/img/constructor/sauces/tomat.jpg',
            zIndex: 10,
        },
        {
            id: '1618810',
            name: 'Соус «Сырный»',
            img: '/img/constructor/sauces/cheese.jpg',
            zIndex: 10,
        },
        {
            id: '1069218',
            name: 'Соус «Грибной»',
            img: '/img/constructor/sauces/mushroom.jpg',
            zIndex: 10,
        },
    ];

    var meats = [
        {
            id: '375',
            name: 'Сервелат',
            img: '/img/constructor/meat/servelat.png',
            weight: 60,
            price: 105,
            zIndex: 10,
            quantity: 1,
        },
        {
            id: '376',
            name: 'Салями',
            img: '/img/constructor/meat/salami.png',
            weight: 50,
            price: 100,
            zIndex: 10,
            quantity: 1,
        },
        {
            id: '377',
            name: 'Ветчина',
            img: '/img/constructor/meat/vetchina.png',
            weight: 60,
            price: 70,
            zIndex: 10,
            quantity: 1,
        },
        {
            id: '378',
            name: 'Бекон',
            img: '/img/constructor/meat/bacon.png',
            weight: 60,
            price: 80,
            zIndex: 10,
            quantity: 1,
        },
        {
            id: '379',
            name: 'Охотничьи колбаски',
            img: '/img/constructor/meat/oh-kolbaski.png',
            weight: 60,
            price: 90,
            zIndex: 10,
            quantity: 1,
        },
        {
            id: '380',
            name: 'Куриное филе',
            img: '/img/constructor/meat/chiken-file.png',
            weight: 60,
            price: 90,
            zIndex: 10,
            quantity: 1,
        },
    ]

    $('.constructor__help__next').on('click', function(e) {
        pizzulkinStep++;
        getPizzulkinStep(e, pizzulkinStep)
    });

    $('.constructor__help__prev').on('click', function(e) {
        pizzulkinStep--;
        getPizzulkinStep(e, pizzulkinStep)
    })

    $('.constructor__nav-tabs .constructor-nav__btn').on('click', function(e){
        if($(this).hasClass('active')) {
            e.preventDefault();
            $(this).removeClass('active');
            var target = $(this).attr('href');
            $(target).removeClass('active show');
            if($(window).outerWidth() >= 1024) {
                getBubleHeight();
                
            }
            showComposition();
            return false;
        } 
        else {
            showIngridients();
        }
    })

    $('.constructor__nav-tabs .constructor-nav__btn').on('shown.bs.tab', function (event) {
        event.target // newly activated tab
        event.relatedTarget // previous active tab
        console.log(event.target)
        // соусы
        if (event.target.id == 'constructor-nav-sauces') {
            if($(window).outerWidth() >= 1024) {
                getBubleHeight();
            }
            else {
                showIngridients();
            }
            $('.constructor__pizza__weil').css('display', 'none');
        }
        // мясо
        else if(event.target.id == 'constructor-nav-meat') {
            pizzulkinStep = 6
            if($(window).outerWidth() >= 1024) {
                getBubleHeight();
            }
            else {
                showIngridients();
            }
            if(!showMeat) {
                // $('.constructor__help__text').html('Ммм...мясо! Чтобы пицца была идеальной, советую добавить 3 порции одного или разного вида мяса - суммарно 150 - 180 грамм!')
                $('.constructor__help__message').removeClass('hidden');
                $('.constructor__help__next').removeClass('constructor__help__finish')
                $('.constructor__help__prev').css('display', 'none');
                getPizzulkinStep(event, pizzulkinStep)
                showPizzulkin();
            }
            showMeat = true;
        }        
    });

    // добавление соуса
    var selectSauce = '';
    $('.btn-sauces').on('click', function() {
        var name = $(this).attr('data-name');
        let sauce = sauces.find(sauce => sauce.name == name);
        selectSauce = sauce.name;
        console.log(sauce);
        $('.constructor__result__btn').removeClass('start');
        if($('#img-sauces').length) {
            $('#img-sauces').remove()
        }
        $('.constructor__pizza').append(`<img src="${sauce.img}" class="pizza-ingridient" alt="" id="img-sauces" style="z-index: ${sauce.zIndex}">`)
        $('.btn-sauces').removeClass('active');
        $(this).addClass('active');
        $('#composition-sauces').html(sauce.name);
        $('#constructor-nav-sauces').find('.constructor-nav-count').html('<img src="img/constructor/icon-check.svg">')
        $('.constructor-nav__btn').removeAttr('disabled');
    })

    // добавление мяса
    var meatList = [];
    var meatGroup = [];
    $('.btn-meat').on('click', function(){
        if(meatList.length >= 3) {
            return false;
        } 
        var name = $(this).attr('data-name');
        let meat = meats.find(meat => meat.name == name);
        meatList.push(meat)
        var groupItem = meatGroup.find(meat => meat.name == name);
        if(groupItem) {
            // var groupItem = Object.assign({}, item)
            groupItem.quantity++;
            console.log(groupItem.quantity)
        }
        else {
            meatGroup.push(meat)
        }

        console.log(meatList);
        if($(this).hasClass('select-1')) {
            $(this).removeClass('select-1').addClass('select-2')
            $(this).find('.btn-ingridient__check').eq(2).addClass('active');
            $(this).find('.btn-ingridient__check').eq(1).addClass('active');
        }
        else if($(this).hasClass('select-2')) {
            $(this).removeClass('select-2').addClass('active')
            $(this).find('.btn-ingridient__check').addClass('active');
        }
        else if($(this).hasClass('active')) {
            return false;
        }
        else {
            $(this).addClass('select-1');
            $('.constructor__pizza').append(`<img src="${meat.img}" class="pizza-ingridient" alt="" id="${meat.id}" style="z-index: ${meat.zIndex}">`)
            $(this).find('.btn-ingridient__check').eq(2).addClass('active');
        }

        var compositionMeat = '';
        console.log(meatGroup);
        meatGroup.map((item) => {
            compositionMeat += `, ${item.name} (${item.weight * item.quantity})`
        })
        $('#composition-meat').html(compositionMeat)
    })

    // удаление мяса
    $('.btn-ingridient__check').on('click', function(e){
        if($(this).hasClass('active')) {
            e.preventDefault();
            e.stopPropagation();
            var name = $(this).closest('.constructor-ingridient').attr('data-name');
            let meat = meats.find(meat => meat.name == name);
            for(var i = 0; i < meatList.length; i++) {
                if(meatList[i].id == meat.id) {
                    meatList.splice(i, 1)
                    break;
                }
            }

            meatGroup = [];
            var groupItem = meatGroup.find(meat => meat.name == name);
            if(groupItem) {
                // var groupItem = Object.assign({}, item)
                groupItem.quantity++;
                console.log(groupItem.quantity)
            }
            else {
                meatGroup.push(meat)
            }

            var compositionMeat = '';
            console.log(meatGroup);
            meatGroup.map((item) => {
                compositionMeat += `, ${item.name} (${item.weight * item.quantity})`
            })
            // meatList.push(meat)
            console.log(meatList);
            // $(this).removeClass('active');
            var btn = $(this).closest('.constructor-ingridient');
            console.log(meat);
            if(btn.hasClass('active')) {
                btn.removeClass('active').addClass('select-2')
                btn.find('.btn-ingridient__check').eq(0).removeClass('active');
            }
            else if(btn.hasClass('select-2')) {
                btn.removeClass('select-2').addClass('select-1')
                btn.find('.btn-ingridient__check').eq(1).removeClass('active');
            }
            else if(btn.hasClass('select-1')) {
                btn.removeClass('select-1')
                btn.find('.btn-ingridient__check').eq(2).removeClass('active');
                document.getElementById(meat.id).remove();
            }
        }   
    })

    /*END CONSTRUCTOR*/
    
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
    if($(window).outerWidth() < 768) {
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
}

function scrollToProduct() {
    if($('.product-list-wrap').length > 0) {
        var header = $('.header');
        var homeSlider = $('.main-slider');
        var productNav = $('.product-nav');
        var offsetTop = 0;
        offsetTop = homeSlider.offset().top + homeSlider.outerHeight() - productNav.outerHeight() - header.outerHeight();
        $('body,html').animate({scrollTop: offsetTop}, 200);
    }    
};

function smoothScroll(target) {
    console.log(target);
    var offsetTop = $(target).offset().top - $('.header').outerHeight();
    $('body,html').animate({scrollTop: offsetTop}, 800);
}

function getPizzulkinStep(e, pizzulkinStep) {
    var pizzulkinMessage = ''

    if(pizzulkinStep == 0) {
        pizzulkinMessage = 'Привет! Меня зовут Пицулькин и я буду помогать Вам создавать пиццу! <span class="new-line">Ниндзяпиццу!</span>';
        $('.constructor__help__prev').css('display', 'none');
    }
    else if(pizzulkinStep == 1) {
        pizzulkinMessage = 'Минимальный состав для приготовления пиццы - это ее основа - тесто, сыр Гауда и соус на Ваш выбор.';
        $('.constructor__help__prev').css('display', 'inline-block');
    }
    else if(pizzulkinStep == 2) {
        pizzulkinMessage = 'Эти базовые ингридиенты включены в базовую стоимость - <span class="constructor__help__price">300 &#8381;!</span>';
    }
    else if(pizzulkinStep == 3) {
        pizzulkinMessage = 'Ну что же, приступим к созданию пиццы! <span class="new-line">Заходите в раздел «Соусы»!</span>';
        if($(window).outerWidth() >= 1024) {
            $('.constructor__help__next').addClass('constructor__help__finish');
        }
        $('.constructor__help__next').removeClass('constructor__help__finish');
    }
    else if(pizzulkinStep == 4) {
        if($(window).outerWidth() >= 1024) {
            $('.constructor__help__message').addClass('hidden');
            $('#constructor-nav-sauces').removeAttr('disabled');
            $('.constructor').removeClass('constructor-start');
            $('.constructor__result__btn').removeAttr('disabled').addClass('start');
        } else {
            pizzulkinMessage = '.... чтобы посмотреть состав «Своей пиццы», необходимо просто отжать иконку раздела, в котором Вы находитесь!';
            $('.constructor__help__next').addClass('constructor__help__finish');
        }
    }
    // for tablet and mobile
    else if(pizzulkinStep == 5) {
        $('.constructor__help__message').addClass('hidden');
        $('#constructor-nav-sauces').removeAttr('disabled');
        $('.constructor').removeClass('constructor-start');
        $('.constructor__result__btn').removeAttr('disabled').addClass('start');
    }
    // для мяса
    else if(pizzulkinStep == 6) {
        pizzulkinMessage = 'Ммм...мясо! Чтобы пицца была идеальной, советую добавить 3 порции одного или разного вида мяса - суммарно 150 - 180 грамм!';
        $('.constructor__help__prev').css('display', 'none');
    }
    else if(pizzulkinStep == 7) {
        pizzulkinMessage = 'Но, если хочется, можно ограничиться одной или двумя порициями! <span class="new-line">И кстати на будущее...</span>';
        $('.constructor__help__prev').css('display', 'inline-block');
        $('.constructor__help__next').removeClass('constructor__help__finish');
    }
    else if(pizzulkinStep == 8) {
        pizzulkinMessage = '... чтобы добавить ту же самую порцию мяса, нужно нажать на наименовании. Чтобы убрать порцию мяса - нужно отжать «галочку»!';
        $('.constructor__help__next').addClass('constructor__help__finish');
    }

    else if(pizzulkinStep == 9) {
        $('.constructor__help__message').addClass('hidden');
        showMeat = true;
        showIngridients();
    }

    $('.constructor__help__text').html(pizzulkinMessage);
    console.log('step', pizzulkinStep)
}

function getBubleHeight() {
    var constructorHeight = $('.constructor').outerHeight();
    var pizzulkinHeight = $('.constructor__help__img').outerHeight();
    var btnsHeight = $('.constructor-action').outerHeight();
    var bubleHeight = constructorHeight - pizzulkinHeight - btnsHeight;
    $('.constructor__help__message').css('height', bubleHeight + 'px');
}

function showPizzulkin() {
    $('.constructor').removeClass('tablet-open-ingridients tablet-open-composition').addClass('tablet-open-pizzulkin');
}

function showIngridients() {
    $('.constructor').removeClass('tablet-open-composition tablet-open-pizzulkin').addClass('tablet-open-ingridients');
}

function showComposition() {
    $('.constructor').removeClass('tablet-open-pizzulkin tablet-open-ingridients').addClass('tablet-open-composition');
}
