var ajaxsearching = false;
var FORM = {
  init: function () {
    $('.form__group .form__title').unbind('click');
    $('.form__group .form__title').on('click', function () {
      //$('.page__nav .title').removeClass('active');
      $(this).parent().toggleClass('open');
      return false;
    });
    $('.card__readmore').unbind('click');
    $('.card__readmore').on('click', function (e) {
      $(this).next("#more-information").toggleClass('open');

      if ($(this).next("#more-information").hasClass('open')) {
        $(this).text('Hide -');
      } else {
        $(this).text('Show more +');
      }

      return false;
    });
  },
  ajaxRequests: function () {
    // Products: Search, filters and pagination
    $('.form__submit').unbind('click');
    $('.form__submit').on('click', function (e) {
      var data = $('#form-data');
      var cpt = data.data('cpt');
      data.data('current_page', 0);
      $('#form-clear-search').addClass('show');
      $('#form-orderby').val('relevance');
      $('#relevance').removeAttr('disabled');
      var query = getFormData(data, cpt);
      FORM.ajaxWP('ajax_form_search_terms', query);
      e.stopPropagation();
      return false;
    });
    $('.form__select').unbind('change');
    $('.form__select').on('change', function (e) {
      var data = $('#form-data');
      var cpt = data.data('cpt');
      data.data('current_page', 0);
      $('#form-clear-filters').addClass('show');
      var query = getFormData(data, cpt);
      FORM.ajaxWP('ajax_form_search_terms', query);
      e.stopPropagation();
      return false;
    });
    $('.form__checkboxes input').unbind('change');
    $('.form__checkboxes input').on('change', function (e) {
      var data = $('#form-data');
      var cpt = data.data('cpt');
      data.data('current_page', 0);
      $('#form-clear-filters').addClass('show');
      var query = getFormData(data, cpt);
      FORM.ajaxWP('ajax_form_search_terms', query);
      e.stopPropagation();
      return false;
    });
    $('#form-clear-filters').unbind('click');
    $('#form-clear-filters').on('click', function (e) {
      var data = $('#form-data');
      var cpt = data.data('cpt');
      $('#form-clear-filters').removeClass('show');
      data.data('current_page', 0); // CPT: Post

      $('#form-category').val('*'); //$('input[name="product_brand[]"]').prop('checked', false);
      // CPT: Publications

      $('#form-author').val('*');
      $('input[name="types[]"]').prop('checked', false);
      var query = getFormData(data, cpt);
      FORM.ajaxWP('ajax_form_search_terms', query);
      FORM.init();
      e.preventDefault();
      return false;
    });
    $('#form-clear-search').unbind('click');
    $('#form-clear-search').on('click', function (e) {
      var data = $('#form-data');
      var cpt = data.data('cpt');
      $('#form-clear-search').removeClass('show');
      data.data('current_page', 0);
      $('#form-search').val('');
      $('#form-orderby').val('newest');
      $('#relevance').prop('disabled', true);
      var query = getFormData(data, cpt);
      FORM.ajaxWP('ajax_form_search_terms', query);
      e.preventDefault();
      return false;
    });
    $('#form-pagination a').unbind('click');
    $('#form-pagination a').on('click', function (e) {
      var data = $('#form-data');
      var cpt = data.data('cpt');
      data.data('current_page', $(this).data('paged') - 1);
      var query = getFormData(data, cpt);
      FORM.ajaxWP('ajax_form_search_terms', query);
      e.preventDefault();
      return false;
    });

    function getFormData(data, type) {
      var new_url = {};
      var page = parseInt(data.data('current_page')) + 1;
      new_url.paged = page;
      var fields = {
        post_type: data.data('cpt'),
        post_status: 'publish',
        posts_per_page: data.data('posts_per_page'),
        paged: page,
        offset: parseInt(data.data('current_page')) * data.data('posts_per_page'),
        tax_query: []
      };

      if ($('#form-search').val() != '') {
        fields.s = $('#form-search').val();
        new_url.search = $('#form-search').val();
      }
      /*if($('#form-orderby').val() == 'relevance') {
          fields.orderby = 'relevance';
          fields.order = 'ASC';
      } else*/


      if ($('#form-orderby').val() == 'newest') {
        fields.orderby = 'published';
        fields.order = 'DESC';
      } else if ($('#form-orderby').val() == 'oldest') {
        fields.orderby = 'published';
        fields.order = 'ASC';
      }

      new_url.orderby = fields.orderby;
      new_url.order = fields.order; // CPT: Post

      if (type == 'post') {
        if ($('#form-category').val() != '*') {
          fields.tax_query = [];
          fields.tax_query.push({
            taxonomy: 'category',
            field: 'slug',
            terms: [$('#form-category').val()]
          });
          new_url.category = $('#form-category').val();
        }
      } // Publication


      if (type == 'publication') {
        fields.post_parent = '0'; // Types

        var types = [];
        $.each($('input[name="types[]"]:checked'), function () {
          types.push($(this).val());
        });

        if (types.length > 0) {
          fields.tax_query = [];
          fields.tax_query.push({
            taxonomy: 'publication_type',
            field: 'slug',
            terms: types
          });
          new_url.types = types.join(',');
        } // Author

        /*var authors = [];
        $.each($('input[name="authors[]"]:checked'), function(){
            authors.push($(this).val());
        });*/


        var author = $('#form-author').val();

        if (author != '*') {
          fields.meta_query = [];
          fields.meta_query.push({
            meta_key: 'fellow_author',
            compare: 'IN',
            value: [author]
          });
          new_url.authors = author;
        }
      }

      var query = {
        url: new_url,
        partial: data.data('partial'),
        fields: fields,
        page: page
      }; //console.log(query);

      return query;
    }
  },
  ajaxWP: function (action, query) {
    if (!ajaxsearching) {
      ajaxsearching = true;
      $.ajax({
        type: 'POST',
        url: nshcsdata.ajax_url,
        data: {
          action: action,
          query: query,
          nonce: nshcsdata.nonce
        },
        dataType: 'JSON',
        beforeSend: function () {
          var url = $.param(query.url);

          if (query.fields.post_type == 'post') {
            history.pushState({}, null, '/news/?' + url);
          } else if (query.fields.post_type == 'publication') {
            history.pushState({}, null, '/digital-fellowships/publications/?' + url);
          }

          $('#form-results').html("Loading...");
        },
        success: function (ret) {
          //console.log(ret);
          $('#form-results').html(ret.results);
          $('#form-count').html(ret.count);
          $('#form-pagination').html(ret.pagination); // Return results, count and pagination (eventually tags too)
        },
        complete: function () {
          FORM.ajaxRequests();
          FORM.init();
          ajaxsearching = false;
        },
        error: function (response) {
          console.log(response);
          console.log("error...");
        }
      });
    }
  }
};
$(document).ready(function () {
  FORM.init();
});
$(function () {
  FORM.ajaxRequests();
});
var ajaxloading = false;
var APP = {
  init: function () {
    APP.ajaxRequests(); //$(".card").removeClass("fadeIn");
  },
  cookieNotice: function () {
    $('.cookie').on('click', function (e) {
      if (!$(e.target).is("a")) {
        e.preventDefault();
      }

      $.cookie('topol_cookie_ok', true, {
        path: '/'
      });
      $(this).fadeOut("slow", function () {
        $("body").removeClass("body--cookie");
      });
    });
  },
  googleAnalytics: function () {
    $('a,.btn,button').on("click", function () {
      if ($(this).data("ga") == true) {
        gtag('event', 'clicked', {
          'event_category': 'Downloads',
          'event_label': $(this).data("tracking")
        });
      }
    });
  },
  trackingHistory: function () {
    if ($(".page--single-fellows").length) {
      var cohort = $(".page--single-fellows").data('cohort');
      var cur_href = $(".bc-fellows").attr('href');
      $(".bc-fellows").attr('href', cur_href + '?filter=' + cohort);
    }
  },
  toggleMenu: function () {
    $(".nav__toggle").on("click", function () {
      $(".nav--header").toggleClass("nav--open");
      $(".header").toggleClass("header--open");
      $(".nav__toggle").toggleClass("nav__toggle--close");
      return false;
    });
  },
  toggleSections: function () {
    $(".filters--sections .filter").on("click", function (e) {
      $(".filter").removeClass("active");
      $(this).addClass("active");
      var hash = $(this).attr("href");
      var parentTracking = $(".filters--sections").attr('data-tracking');
      window.localStorage.setItem(parentTracking, hash);
      var query_url = {
        filter: hash.replace("#", "")
      };
      var url = $.param(query_url);
      history.pushState({}, null, '/digital-fellowships/alumni/?' + url);
      $(".sections .section").hide();
      $(hash).show();
      return false;
      e.preventDefault();
    }); //$(".filters--section .filter.active").trigger('click');
  },
  isotope: function () {
    $('#isotope').isotope({
      itemSelector: '.card',
      layoutMode: 'fitRows'
    });
    $('.filter--isotope li').unbind('click');
    $('.filter--isotope li').on('click', function (e) {
      console.log("here...");

      if ($(this).hasClass("active") && !$(this).hasClass("first")) {
        $(this).find('i').removeClass('la-check-square').addClass('la-stop');
        $(this).removeClass("active");
        $('#isotope').isotope({
          filter: '*'
        });
      } else {
        $(this).removeClass("first");
        $('.filter--isotope li i').removeClass('la-check-square').addClass('la-stop');
        $(this).find('i').removeClass('la-stop').addClass('la-check-square');
        $('.filter--isotope li').removeClass("active");
        $(this).addClass("active");
        var filters = [];
        $('.filter--isotope li.active').each(function (e) {
          var category = $(this).attr("data-filter");
          filters.push(category);
        });
        var filters_list = filters.join('');
        $('#isotope').isotope({
          filter: filters_list
        });
      }

      return false;
    });
    $(".filter--isotope li.active.first").trigger('click');
  },
  ajaxRequests: function () {
    $(".widget--filter li").unbind('click');
    $(".widget--filter li").on("click", function (e) {
      e.preventDefault();
      $(".widget--filter li").removeClass("active");
      $(this).addClass("active");
      var parent = $(this).parent(".widget__filter");
      APP.ajaxFilterAction("filter", "ajax_filters", parent);
    });
    $(".section__loadmore a").unbind('click');
    $(".section__loadmore a").on("click", function (e) {
      e.preventDefault();
      var parent = $(this);
      $(".section__loadmore").addClass("remove");
      APP.ajaxFilterAction("loadmore", "ajax_filters", parent);
    });
  },
  ajaxFilterAction: function (func, action, parent) {
    var query = {
      post_type: $(parent).data("posttype"),
      posts_per_page: $(parent).data("postsperpage"),
      paged: $(parent).data("paged")
    };

    if ($(".widget--filter ul").data("field") == 'blog_author') {
      if ($(".widget--filter ul li.active").data("filter") != "all") {
        query['meta_query'] = {
          key: 'blog_author',
          value: $(".widget--filter ul li.active").data("filter"),
          compare: '=='
        };
      }
    } else if ($(".widget--filter ul").data("taxonomy") == 'category') {
      if ($(".widget--filter ul li.active").data("filter") != "all") {
        query['tax_query'] = {
          taxonomy: $(".widget--filter ul").data('taxonomy'),
          terms: $(".widget--filter ul li.active").data("filter"),
          field: 'slug'
        };
      }
    }

    APP.ajaxWP(func, action, query);
  },
  ajaxWP: function (func, action, query) {
    if (!ajaxloading) {
      ajaxloading = true;
      $.ajax({
        url: ajaxdata.ajax_url,
        type: 'POST',
        dataType: '',
        data: {
          action: action,
          query: query
        },
        beforeSend: function () {
          if (func == 'loadmore') {} else {
            $("#ajax").html("");
          }
        },
        success: function (ret) {
          //console.log(ret);
          ajaxloading = false;

          if (func == 'loadmore') {
            $("#ajax").append(ret);
            $(".section__loadmore.remove").remove();
          } else {
            $("#ajax").html(ret).show();
          }

          $(".fadeIn").fadeIn(200).removeClass("fadeIn");
          APP.ajaxRequests();
        },
        error: function () {
          console.log("error...");
        }
      });
    }
  },
  toggleTabs: function () {
    $(".tabs__list li a").on("click", function () {
      $(".tabs__list li a").removeClass("active");
      $(this).addClass("active");
      var active_tab = $(this).attr("href");
      $(".tabs__item").removeClass("active");
      $(active_tab).addClass("active");
      return false;
    });
  },
  toggleAccordion: function () {
    $(".accordion__title a").on("click", function () {
      $(this).parent().parent().toggleClass("active");
      return false;
    });
  },
  scrollTo: function () {
    //scroll-to
    $('.scroll-to').click(function () {
      var loc = $(this).attr("href");

      if (loc == "#top") {
        $(window).scrollTo(0, 800, {
          offset: 0
        });
      } else {
        $(window).scrollTo(loc, 800, {
          offset: -60
        });
      }

      return false;
    });
  },
  owlCarousel: function () {
    //if(typeof $().owlCarousel !== 'function') return;
    var banners_carousel = $('.page--home .page__header .owl-carousel').owlCarousel({
      loop: false,
      margin: 0,
      nav: true,
      autoHeight: false,
      navText: ['<i class="las la-arrow-left"></i>', '<i class="las la-arrow-right"></i>'],
      items: 1
    });
    var fellows_carousel = $('.section--fellows .owl-carousel').owlCarousel({
      loop: true,
      margin: 0,
      nav: false,
      autoHeight: false,
      autoplay: 500,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 3
        },
        1024: {
          items: 3
        }
      }
    });
  },
  waypoints: function () {// Quick jump

    /*$('.page--standard .page__header').waypoint(function(direction) {
        if(direction == "down") {
            $(".page__quickjump").addClass("fixed");
        } else {
            $(".page__quickjump").removeClass("fixed");
        }
    }, {
        offset: function() {
            return -$('.page__header').height()+$(".page__quickjump").height();
        }
    });
    // Subnav highlighting
    $('.page--standard .section').waypoint(function(direction) {
        $(".link--"+this.element.id).toggleClass('selected', direction === 'down');
    }, {
        offset: '60px'
    });
    
    $('.page--standard .section').waypoint(function(direction) {
            $(".link--"+this.element.id).toggleClass('selected', direction === 'up');
    }, {
        offset: function() { 
            return -this.element.clientHeight + 60; 
        }
    });*/
  },
  particles: function () {
    if (!APP.isMobile()) {
      particlesJS("particles-js", {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 600
            }
          },
          "color": {
            "value": "#FFF"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": false
            },
            "resize": false
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    }
  },
  isBeta: function () {
    var is_beta;

    if ($('.is-beta').css('display') == 'block') {
      is_beta = true;
    } else {
      is_beta = false;
    }

    return is_beta;
  },
  isLive: function () {
    var is_live;

    if ($('.is-live').css('display') == 'block') {
      is_live = true;
    } else {
      is_live = false;
    }

    return is_live;
  },
  isMobile: function () {
    var is_mobile;

    if ($('.is-mobile').css('display') == 'block') {
      is_mobile = true;
    } else {
      is_mobile = false;
    }

    return is_mobile;
  },
  isTablet: function () {
    var is_tablet;

    if ($('.is-tablet').css('display') == 'block') {
      is_tablet = true;
    } else {
      is_tablet = false;
    }

    return is_tablet;
  }
};
$(document).ready(function () {
  APP.init();
});
$(function () {
  if (!APP.isMobile()) {
    APP.waypoints();
  }

  APP.toggleMenu();
  APP.toggleSections();
  APP.trackingHistory();
  APP.toggleTabs();
  APP.toggleAccordion();
  APP.scrollTo();
  APP.owlCarousel();
  APP.isotope();
  APP.googleAnalytics();
});

function gup(name, url) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  return results == null ? null : results[1];
}