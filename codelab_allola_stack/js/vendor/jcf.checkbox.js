!function(t) {
    function e(e) {
        t.each(e, function(t, e) {
            "function" == typeof e && e()
        })
    }
    var i = {
        $page: t("#page"),
        $body: t("body")
    }
        , a = []
        , n = []
        , o = []
        , s = {
        init: function() {
            t("[data-drawer-open]").on("click", function(e) {
                e.preventDefault();
                var i = t(this).data("drawer-open")
                    , a = t('[data-drawer="' + i + '"]')
                    , n = t("[data-drawer-container]")
                    , o = a.outerHeight();
                t(this).hasClass("active") ? (n.height(0),
                    t(this).removeClass("active"),
                    a.removeClass("active")) : (n.height(o),
                    a.siblings().removeClass("active"),
                    t(this).closest("li").siblings().find("[data-drawer-open]").removeClass("active"),
                    t(this).addClass("active"),
                    a.addClass("active"))
            })
        }
    };
    n.push(function() {
        s.init()
    });
    var r = {
        init: function() {
            jcf.setOptions("Select", {
                wrapNative: !1
            }),
                jcf.replaceAll(),
                this.dynamicInputs()
        },
        dynamicInputs: function() {
            t(".form-default__dynamic-sets a").on("click", function(e) {
                e.preventDefault();
                var i = t(this)
                    , a = i.siblings("div");
                i.hasClass("active") && a.find("input").val(""),
                    i.toggleClass("active"),
                    a.toggleClass("active").slideToggle(300)
            })
        }
    };
    n.push(function() {
        r.init()
    });
    var c = {
        vars: {
            $header: t(".header__main-wrapper")
        },
        init: function() {
            var t = this;
            t.movePage(),
                t.fadeSlider()
        },
        movePage: function() {
            var t = this;
            i.$page.css("padding-top", t.vars.$header.innerHeight())
        },
        fadeSlider: function() {
            var e = t(".header__fade-slider");
            setInterval(function() {
                var t = e.find(".header__fade-slider__slide.active").removeClass("active");
                t.is(":last-child") ? e.find(".header__fade-slider__slide:first-child").addClass("active") : t.next().addClass("active")
            }, 3e3)
        }
    };
    n.push(function() {
        c.init()
    }),
        a.push(function() {
            c.movePage()
        }),
        o.push(function() {
            c.movePage()
        });
    var d = {
        init: function() {
            this.moveThumbWOTD()
        },
        resize: function() {
            this.moveThumbWOTD()
        },
        moveThumbWOTD: function() {
            var e = t(".home-wotd__thumbnail")
                , i = t(".home-wotd__scores__top");
            e.css("margin-bottom", -i.innerHeight())
        }
    };
    n.push(function() {
        d.init()
    }),
        a.push(function() {
            d.resize()
        }),
        o.push(function() {
            d.resize()
        });
    var l = {
        vars: {
            $trigger: t("[data-modal-open]"),
            $close: t(".modal__close")
        },
        init: function() {
            var e = this
                , a = e.vars.$trigger
                , n = e.vars.$close
                , o = i.$body
                , s = 0;
            a.click(function(e) {
                e.preventDefault();
                var i = t(this).data("modal-open");
                t('.modal[data-modal="' + i + '"]').addClass("active"),
                    s = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
                    o.css("top", -s),
                    o.addClass("no-scroll")
            }),
                n.click(function(e) {
                    e.preventDefault(),
                        t(this).closest(".modal").removeClass("active"),
                        setTimeout(function() {
                            o.css("top", ""),
                                o.removeClass("no-scroll"),
                                t(window).scrollTop(s)
                        }, 550)
                })
        }
    };
    n.push(function() {
        l.init()
    });
    var v = {
        vars: {
            $timerWrapper: t("[data-timer]"),
            time: 0,
            timerSeparator: ":"
        },
        init: function() {
            var t = this;
            t.vars.$timerWrapper.length && t.countdownTimer()
        },
        countdownTimer: function() {
            var e = this;
            e.timerParseData();
            var i = setInterval(function() {
                --e.vars.time <= 0 && (clearInterval(i),
                    t(".vote__circle__button").off("click"),
                    t(".votes .vote__item").addClass("disabled"),
                    t(".vote__circle .vote__circle__button").remove(),
                    t(".vote__circle").append('<div class="vote__circle__icon"></div>')),
                    e.timerUpdateWrapper()
            }, 1e3)
        },
        timerUpdateWrapper: function() {
            var t = this
                , e = t.vars.time
                , i = t.vars.$timerWrapper
                , a = Math.floor(e / 60 / 60)
                , n = Math.floor(e / 60 % 60)
                , o = Math.floor(e % 60);
            i.find(".timer-js__hours").text(t.formatTime(a)),
                i.find(".timer-js__minutes").text(t.formatTime(n)),
                i.find(".timer-js__seconds").text(t.formatTime(o))
        },
        formatTime: function(t) {
            var e = "";
            return t < 10 && (e += "0"),
            e + t
        },
        timerParseData: function() {
            for (var t = this, e = t.vars.timerSeparator, i = t.vars.$timerWrapper.data("timer").split(e), a = 0; a < i.length; a++)
                t.vars.time += i[a] * Math.pow(60, i.length - a - 1)
        }
    };
    n.push(function() {
        v.init()
    });
    var u = {
        init: function() {
            t(".smsc-button").on("click", function(e) {
                e.preventDefault(),
                    t("html, body").animate({
                        scrollTop: 0
                    }, 1e3, "swing")
            })
        }
    };
    n.push(function() {
        u.init()
    });
    var f = function() {
        function e(e) {
            var i = this;
            if (i.$element = t(e),
                i.data = {
                    score: parseInt(i.$element.find(".vote__circle").attr("data-ini-score")),
                    total: parseInt(i.$element.find(".vote__circle").attr("data-total")),
                    precentage: parseInt(i.$element.find(".vote__circle").attr("data-count")),
                    siteID: parseInt(i.$element.find(".vote__circle").attr("data-site-id")),
                    catID: parseInt(i.$element.find(".vote__circle").attr("data-cat-id"))
                },
            i.data.score === i.data.total)
                return i.$element.addClass("disabled"),
                    this.$element.find(".vote__circle .vote__circle__button").remove(),
                    void this.$element.find(".vote__circle").append('<div class="vote__circle__icon trophy"></div>');
            i.$element.find(".vote__circle__button").one("click", function() {
                i.request()
            })
        }
        return e.prototype.request = function() {
            var e = this;
            t.ajax({
                method: "post",
                dataType: "json",
                url: "/public-vote.php",
                data: {
                    siteID: e.data.siteID,
                    catID: e.data.catID
                },
                success: function(t) {
                    "OK" === t.status && "YES" === t.response ? e.changeFrontState() : "OK" === t.status && "NO" === t.response && e.displayMessage()
                }
            })
        }
            ,
            e.prototype.changeFrontState = function() {
                this.data.score++,
                    this.data.precentage = Math.floor(this.data.score / this.data.total * 100),
                    this.$element.find(".vote__score__count").text(this.data.score),
                    this.$element.find(".vote__circle").attr("data-count", this.data.precentage),
                    this.$element.addClass("disabled voted")
            }
            ,
            e.prototype.displayMessage = function() {
                this.$element.addClass("disabled"),
                    this.$element.find(".vote__circle .vote__circle__button").remove(),
                    this.$element.find(".vote__circle").append('<div class="vote__circle__icon"></div>'),
                    this.$element.find(".vote__circle").append('<small class="vote__message">Already voted</small>')
            }
            ,
            e
    }();
    n.push(function() {
        t(".votes .vote__item").each(function() {
            new f(this)
        })
    }),
        t(document).ready(function() {
            e(n)
        }),
        t(window).on("load", function() {
            e(a)
        }),
        t(window).on("resize", function() {
            e(o)
        })
}(jQuery);
