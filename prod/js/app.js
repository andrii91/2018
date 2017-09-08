
;(function ($) {
    'use strict';

    function setUp($el, settings) {
        var width = $el.data('width'),
            height = $el.data('height'),
            ratio = ($el.data('ratio')) ? $el.data('ratio') : settings.default_ratio,
            id = $el.data('youtube-id'),
            padding_bottom,
            innerHtml = [],
            $thumb,
            thumb_img,
            loading_text = $el.text() ? $el.text() : settings.loading_text,
            youtube_parameters = $el.data('parameters') || '';
        
        ratio = ratio.split(":");
        
        // width and height might override default_ratio value
        if (typeof width === 'number' && typeof height === 'number') {
          $el.width(width);
          padding_bottom = height + 'px';
        } else if (typeof width === 'number') {
          $el.width(width);
          padding_bottom = (width * ratio[1] / ratio[0]) + 'px';
        } else {
          width = $el.width();
		      
          // no width means that container is fluid and will be the size of its parent
          if (width == 0) {
            width = $el.parent().width();
          }
		      
          padding_bottom = (ratio[1] / ratio[0] * 100) + '%';
        }
        
        //
        // This HTML will be placed inside 'lazyYT' container
        
        innerHtml.push('<div class="ytp-thumbnail">');
        
          // Play button from YouTube (exactly as it is in YouTube)
          innerHtml.push('<div class="ytp-large-play-button"');

          innerHtml.push('</div>'); // end of .ytp-large-play-button
        
        innerHtml.push('</div>'); // end of .ytp-thumbnail
        
        // Video title (info bar)
        innerHtml.push('<div class="html5-info-bar">');
        innerHtml.push('<div class="html5-title">');
        innerHtml.push('<div class="html5-title-text-wrapper">');
        innerHtml.push('<a id="lazyYT-title-', id, '" class="html5-title-text" target="_blank" tabindex="3100" href="//www.youtube.com/watch?v=', id, '">');
        innerHtml.push(loading_text);
        innerHtml.push('</a>');
        innerHtml.push('</div>'); // .html5-title
        innerHtml.push('</div>'); // .html5-title-text-wrapper
        innerHtml.push('</div>'); // end of Video title .html5-info-bar

        $el.css({
            'padding-bottom': padding_bottom
        })
          .html(innerHtml.join(''));
        
        if (width > 640) {
          thumb_img = 'maxresdefault.jpg';
        } else if (width > 480) {
          thumb_img = 'sddefault.jpg';
        } else if (width > 320) {
          thumb_img = 'hqdefault.jpg';
        } else if (width > 120) {
          thumb_img = 'mqdefault.jpg';
        } else if (width == 0) { // sometimes it fails on fluid layout
          thumb_img = 'hqdefault.jpg';
        } else {
          thumb_img = 'default.jpg';
        }
        
        $thumb = $el.find('.ytp-thumbnail').css({
            'background-image': ['url(//img.youtube.com/vi/', id, '/', thumb_img, ')'].join('')
        })
          .addClass('lazyYT-image-loaded')
          .on('click', function (e) {
            e.preventDefault();
            if (!$el.hasClass('lazyYT-video-loaded') && $thumb.hasClass('lazyYT-image-loaded')) {
              $el.html('<iframe src="//www.youtube.com/embed/' + id + '?autoplay=1&' + youtube_parameters + '" frameborder="0" allowfullscreen></iframe>')
                .addClass('lazyYT-video-loaded');
            }
          });



    }

    $.fn.lazyYT = function (newSettings) {
      var defaultSettings = {
        loading_text: '',
        default_ratio: '16:9',
        callback: null, // ToDO execute callback if given
        container_class: 'lazyYT-container'
      };
      var settings = $.extend(defaultSettings, newSettings);
      
      return this.each(function () {
          var $el = $(this).addClass(settings.container_class);
          setUp($el, settings);
      });
    };

}(jQuery));


$(document).ready(function() { 
  $('.js-lazyYT').lazyYT();
  
  $('.reviews-carousel').owlCarousel({
    loop:true,
    margin:37,
    nav:true,
    navText:false,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:3
        },
        1000:{
            items:5
        }
    }
  });
  $('.slide-carousel').owlCarousel({
    loop:true,
    margin:0,
    nav:true,
    navText:false,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    smartSpeed: 450,
    responsive:{
        0:{
            items:1
        }
    }
  });
  
  $('.modal-btn').click(function (e) {
    e.preventDefault;
    $('#' + $(this).data('modal')).show('1000');
    $('#' + $(this).data('modal')).animate({
      opacity: 1,
    });
    $('body').addClass('overl-h');
    $('.overlay').show('1000');
  });
  
  $('.price-list li').click(function(){
    var $from = $(this);
    $from.parent().find('li').removeClass('active');
    $from.parents('.price-box').find('.box-title').removeClass('active');
    $from.addClass('active');
    $from.parents('.price-box').find('.box-title.' + $from.data('variant')).addClass('active');
  })
  
  $('.reviews .item').click(function() {
    $('#reviews iframe').attr('src', 'https://www.youtube.com/embed/' + $(this).data('link_id'));
  });
  
  $('.overlay, .popup__close').click(function () {
    $('body').removeClass('overl-h');
    $('.modal').hide('1000');
    $('.overlay').hide('1000');
    $('#reviews iframe').attr('src', 'https://www.youtube.com/embed/');
    $('.modal').animate({
      opacity: 0,
    });
  });
  $('.head-img img').click(function(){
    var destination = $(".program").offset().top - 0;
    $("body,html").animate({ scrollTop: destination}, 500 );
  });
  $('.price-btn').click(function(){
      $('input[name="variant"]').val($(this).parents('.price-box').find('h3').text());
      $('input[name="type"]').val($(this).parents('.price-box').find('.price-list li.active').text());
      $('input[name="price"]').val($(this).parents('.price-box').find('.box-title.active').text());
  });


});