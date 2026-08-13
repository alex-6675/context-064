// Конфигурация адаптера для портала VK.RU (новая версия с VKUI)
// Основано на исследовании от 13.08.2026

let vkruInstruct = {
    "shortname": "vkru",
    "urls": ["vk.ru", "m.vk.ru", "vkvideo.ru", "vk.com", "m.vk.com"],
    "title": "ВК (vk.ru)",

    "procedure": [
        // ============================================
        // Профиль 1: Заголовок поста (десктоп/мобайл)
        // ============================================
        {
            "queryaz": 'a[data-testid="post-header-title"]',
            "username": [
                {"name": "func", "param": "usernamebyhref"}
            ],
            "eventype": [{"name": "const", "param": "2"}],
            "isModifiable": [{"name": "const", "param": true}],
            "attachBadgeMode": [{"name": "const", "param": "after"}],
            "attachMenuDomElement": [
                {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkuiFlex__directionColumn"}]}}
            ],
            "url": [
                {"name": "attr", "param": "href"}
            ]
        },

        // ============================================
        // Профиль 2: Владелец комментария (десктоп)
        // ============================================
        {
            "queryaz": 'div[data-testid="comment-owner"]',
            "username": [
                {"name": "func", "param": "usernamebyhref"}
            ],
            "eventype": [{"name": "const", "param": "1"}],
            "isModifiable": [{"name": "const", "param": true}],
            "attachBadgeMode": [{"name": "const", "param": "after"}],
            "attachMenuDomElement": [
                {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkitCommentBase__in--9swaG"}]}}
            ],
            "url": [
                {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkitCommentBase__in--9swaG"}]}},
                {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkitComment__date--6PSiG"}]}},
                {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkitLink__link--b0dQw"}]}},
                {"name": "attr", "param": "href"},
                {"name": "concatbefore", "param": "https://vk.ru"}
            ],
            "totalblock": [
                {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkitCommentBase__root--tipbq"}]}}
            ]
        },

        // ============================================
        // Профиль 3: Ссылка имени владельца (альтернатива)
        // ============================================
        {
            "queryaz": 'a[class~="vkitCommentBaseOwnerName__ownerNameLink--eqBxt"]',
            "username": [
                {"name": "func", "param": "usernamebyhref"}
            ],
            "eventype": [{"name": "const", "param": "1"}],
            "isModifiable": [{"name": "const", "param": true}],
            "attachBadgeMode": [{"name": "const", "param": "after"}],
            "url": [
                {"name": "attr", "param": "href"}
            ],
            "totalblock": [
                {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkitCommentBase__root--tipbq"}]}}
            ]
        },

        // ============================================
        // Профиль 4: Мобильная версия - имя автора
        // ============================================
        {
            "queryaz": 'div[data-testid="comment-owner"][mode="primary"]',
            "username": [
                {"name": "func", "param": "usernamebyhref"}
            ],
            "eventype": [{"name": "const", "param": "1"}],
            "isModifiable": [{"name": "const", "param": true}],
            "attachBadgeMode": [{"name": "const", "param": "after"}],
            "url": [
                {"name": "up", "param": {"case": [{"name": "attr", "param": "class"}, {"name": "test", "param": "mv_comments"}]}},
                {"name": "iseq", "param": null},
                {"name": "if",
                    "altparam": [{"name": "const", "param": ""}],
                    "param": [
                        {"name": "init"},
                        {"name": "up", "param": {"case": [{"name": "attr", "param": "class"}, {"name": "test", "param": "reply_content"}]}},
                        {"name": "down", "param": {"case": [{"name": "attr", "param": "class"}, {"name": "test", "param": "wd_lnk"}]}},
                        {"name": "attr", "param": "href"}
                    ]
                }
            ]
        },

        // ============================================
        // Профиль 5: Видео комментарии (vkvideo.ru)
        // ============================================
        {
            "queryaz": 'div.vkit-ewZ0L2.vkit-VbEObC',
            "username": [
                {"name": "func", "param": "usernamebyhref"}
            ],
            "eventype": [{"name": "const", "param": "1"}],
            "isModifiable": [{"name": "const", "param": true}],
            "attachBadgeMode": [{"name": "const", "param": "after"}],
            "url": [
                {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkitCommentBase__in--9swaG"}]}},
                {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkitComment__date--6PSiG"}]}},
                {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkitLink__link--b0dQw"}]}},
                {"name": "attr", "param": "href"},
                {"name": "concatbefore", "param": "https://vkvideo.ru"}
            ]
        },

        // ============================================
        // Профиль 6: Отзывы о товарах (Market)
        // ============================================
        {
            "queryaz": '[data-testid="market_item_feedback"] span.vkuiFootnote__host',
            "username": [
                {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkuiFlex__alignStart"}]}},
                {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkuiAvatar__host"}]}},
                {"name": "attr", "param": "alt"},
                {"name": "iseq", "param": null},
                {"name": "if",
                    "altparam": [{"name": "in"}],
                    "param": [{"name": "const", "param": "Аноним"}]
                }
            ],
            "eventype": [{"name": "const", "param": "1"}],
            "isModifiable": [{"name": "const", "param": true}],
            "attachBadgeMode": [{"name": "const", "param": "after"}],
            "url": [
                {"name": "up", "param": {"case": [{"name": "attr", "param": "data-testid"}, {"name": "test", "param": "market_item_feedback"}]}},
                {"name": "attr", "param": "data-reviewid"},
                {"name": "concatbefore", "param": "review-"},
                {"name": "url", "param": "noparams"},
                {"name": "concatafter", "param": "#"}
            ]
        }
    ],

    // ============================================
    // Функции
    // ============================================
    "functions": {
        "usernamebyhref": [
            {"name": "up", "param": {"case": [{"name": "tagname", "param": "A"}]}},
            {"name": "iseq", "param": null},
            {"name": "if",
                "param": [
                    {"name": "attr", "param": "href"},
                    {"name": "match", "param": "/(?:id|club|public)(\\\\d+)"},
                    {"name": "return"}
                ],
                "altparam": [
                    {"name": "attr", "param": "data-from-id"},
                    {"name": "test", "param": "(?!^$)"},
                    {"name": "if", "param": [
                        {"name": "attr", "param": "data-from-id"},
                        {"name": "return"}
                    ]}
                ]
            },
            {"name": "const", "param": "unknown"}
        ],

        "gettimestamp": [
            {
                "doctcondition": [{"name": "iseq", "param": "1"}],
                "timestampstring": [
                    {
                        "name": "ismobile"
                    },
                    {
                        "name": "if",
                        "altparam": [
                            // Мобильная версия
                            {"name": "init"},
                            {"name": "up", "param": {"case": [{"name": "attr", "param": "class"}, {"name": "test", "param": "mv_info"}]}},
                            {"name": "down", "param": {"case": [{"name": "attr", "param": "class"}, {"name": "test", "param": "VideoLayerInfo__date"}]}},
                            {"name": "in"},
                            {"name": "vktime"},
                            {"name": "return", "param": "values"}
                        ],
                        "param": [
                            // Десктоп версия
                            {"name": "init"},
                            {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkitCommentBase__in--9swaG"}]}},
                            {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkitComment__date--6PSiG"}]}},
                            {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkitLink__link--b0dQw"}]}},
                            {"name": "attr", "param": "time"},
                            {"name": "iseq", "param": null},
                            {"name": "if",
                                "param": [
                                    {"name": "attr", "param": "time"},
                                    {"name": "epochtime"},
                                    {"name": "return", "param": "values"}
                                ],
                                "altparam": [
                                    {"name": "in"},
                                    {"name": "vktime"},
                                    {"name": "return", "param": "values"}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "doctcondition": [{"name": "iseq", "param": "2"}],
                "timestampstring": [
                    {
                        "name": "init"
                    },
                    {
                        "name": "up", "param": {"case": [{"name": "attr", "param": "data-testid"}, {"name": "test", "param": "post_date_block_preview"}]}
                    },
                    {
                        "name": "iseq", "param": null
                    },
                    {
                        "name": "if",
                        "param": [
                            {"name": "attr", "param": "time"},
                            {"name": "epochtime"},
                            {"name": "return", "param": "values"}
                        ],
                        "altparam": [
                            {"name": "in"},
                            {"name": "vktime"},
                            {"name": "return", "param": "values"}
                        ]
                    }
                ]
            }
        ],

        "gettext": [
            {
                "doctcondition": [{"name": "iseq", "param": "1"}],
                "eventtexts": [
                    {
                        "name": "ismobile"
                    },
                    {
                        "name": "if",
                        "altparam": [
                            // Мобильная версия
                            {"name": "init"},
                            {"name": "up", "param": {"case": [{"name": "attr", "param": "class"}, {"name": "test", "param": "reply_content"}]}},
                            {"name": "down", "param": {"case": [{"name": "attr", "param": "class"}, {"name": "test", "param": "reply_text"}]}},
                            {"name": "in"},
                            {"name": "set", "param": "evtext"},
                            {"name": "const", "param": ""},
                            {"name": "set", "param": "evtitle"},
                            {"name": "return", "param": "values"}
                        ],
                        "param": [
                            // Десктоп версия
                            {"name": "const", "param": ""},
                            {"name": "set", "param": "evtitle"},
                            {"name": "init"},
                            {"name": "up", "param": {"case": [{"name": "classcontains", "param": "vkitCommentBase__in--9swaG"}]}},
                            {"name": "down", "param": {"case": [{"name": "classcontains", "param": "vkitFeedShowMoreText__text--0wZYb"}]}},
                            {"name": "in"},
                            {"name": "set", "param": "evtext"},
                            {"name": "return", "param": "values"}
                        ]
                    }
                ]
            },
            {
                "doctcondition": [{"name": "iseq", "param": "2"}],
                "eventtexts": [
                    {
                        "name": "init"
                    },
                    {
                        "name": "up", "param": {"case": [{"name": "attr", "param": "data-testid"}, {"name": "test", "param": "post-content-container"}]}
                    },
                    {
                        "name": "in"
                    },
                    {
                        "name": "set", "param": "evtext"
                    },
                    {
                        "name": "const", "param": ""
                    },
                    {
                        "name": "set", "param": "evtitle"
                    },
                    {
                        "name": "return", "param": "values"
                    }
                ]
            }
        ],

        "isnested": [
            {"name": "accept"},
            {"name": "get", "param": "candidate"},
            {"name": "test", "param": [{"name": "get", "param": "root"}]}
        ],

        "vktime": [
            {"name": "in"},
            {"name": "match", "param": "^\\\\s*(.*?)\\\\s*$"},
            {"name": "parsevktime"},
            {"name": "return"}
        ]
    }
};

// Регистрация адаптера
AllSocProcs.set("ВК (vk.ru)", vkruInstruct);
