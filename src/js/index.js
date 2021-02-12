'use strict'

import $ from 'jquery';

//BS4 components
// import bootstrap from 'bootstrap';

import '../js/slick.min.js';

//styles
import '../scss/style.scss';

$(document).ready(function(){
    $('.slick-slider').slick({
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 300,
        infinite: true,
        slidesToScroll: 1,
        slidesToShow: 1,
    });
});

