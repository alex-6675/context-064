# Инвентаризация проекта Context RepuTracker

Дата: 2026-08
Статус: инвентаризация без изменений кода. Никакие файлы в рамках подготовки отчёта не менялись.

> Примечание: номера строк указаны приблизительно (оценка по позиции функции в файле), точные значения сверять в редакторе.

## 1. Общая структура

Chrome-расширение (Manifest v3) **Context RepuTracker** — менеджер репутаций пользователей. Архитектура двухслойная:

- **Универсальное ядро** — работа с персоной, событиями, БД, диалогами.
- **Портальная обвязка** — декларативные «инструкции» + специализированные парсеры под каждую соцсеть.

Порядок загрузки скриптов задан в `manifest.json`: ядро → портальные файлы → `snettemplate.js` (сборка) → `content.js` (оркестрация).

## 2. Универсальное ядро работы с персонами

| Файл | Роль в ядре |
|---|---|
| `initfirst.js` | `ActiveZones` (карта активных зон), `KnownSNets` (реестр сетей), `initazone()` — структура зоны (username, url, badge, rankid, hidden и т.д.), методы `getBadge`/`setBadge` |
| `uparse.js` | Движок выполнения команд-инструкций: `execommands`/`execommand`, `OneTypeActiveZoneProcessor`, `ListActiveZonesTemplate`, `GetTimestampTemplate`, `GetEventTextTemplate`, `GetUserAliasTemplate`, `GetRootForTemplate`, `IsNestedTemplate`, `vk_time_parcer` |
| `snettemplate.js` | `createObjByTemplate()` — собирает объект сети из декларативной инструкции, регистрирует в `KnownSNets` |
| `content.js` | Оркестратор: `analysePageAllSNets`, `requestActualUsersStauses`, `addElemsToActiveZone`, `colorAll`, `addEventMark`/`removeEventMark`, `handleActualUsersStatuses`, `injectDialogs`, `blogGetUsernameByLink` |
| `contextlib.js` | Диалог события `showHistoryEventDlg`, `addHistoryEvent`/`removeHistoryEvent`, `colorItem`, `createrank`, `injectFragment`, работа с тегами `buildCloud` |
| `contextlib_mod.js` | Импортируемые утилиты `parceDateFromRuLocale`, `convToLower` |
| `mutation.js` | `MutationObserverThin` — прореживание перестроек DOM |
| `background.js` | Хранилище: IndexedDB `"contest"` (таблицы `ranks`, `users`, `history`, `identitier`), все обработчики `Handlers` |
| `userinfodialog.js` | Досье персоны: `userInfoDialogShow`, `drawHistoryTable`, статусы |
| `popup.js`, `expimp.js`, `datasummary.js` | UI параметров: экспорт/импорт, сводка, статусы, теги |

## 3. Портально-специфичная часть

| Файл | Портал | Тип описания |
|---|---|---|
| `contws.js` | КОНТ (cont.ws) | Смешанный: JSON-инструкция + императивные функции `ListContActiveZones`, `GetContTimestamp`, `GetContEventText` и др. |
| `vkcom.js` | ВКонтакте | Декларативная JSON-инструкция `vkInstruct` (`procedure` + `functions`) |
| `ljcom.js` | LiveJournal | Императивный код: `ListLjActiveZones`, `GetLjTimestamp`, `GetLjEventText`, `GetLayoutType` и др. |
| `youtubecom.js` | YouTube | Императивный код: `ListYtActiveZones`, `GetYtTimestamp`, `GetYtEventText` и др. |
| `habrcom.js` | Habr | Императивный код: `ListHabrActiveZones`, `GetHabrTimestamp`, `GetHabrEventText` и др. |
| `aftershock.js` | АШ (aftershock.news) | Декларативная JSON-инструкция `ashInstruct` |
| `rutube_env.js` | RUTUBE | Гибрид: JSON-инструкция `ruInstruct` (для `uparse`) + императивные `ListRtActiveZones`, `proceedClicked`, `GetRtTimestamp` и др. |

## 4. Запрошенные механизмы

### Обнаружение персоны
- Декларативно: `queryaz` + процедура `username` в инструкциях — `vkcom.js` (`vkInstruct.procedure`), `aftershock.js`, `rutube_env.js` (`ruInstruct`); исполняет `uparse.js` → `OneTypeActiveZoneProcessor`.
- Императивно: `ListContActiveZones` (contws.js), `ListLjActiveZones` (ljcom.js), `ListYtActiveZones` (youtubecom.js), `ListHabrActiveZones` (habrcom.js).

### Вставка «треугольника» (меню)
- `content.js` → `addElemsToActiveZone`: создаёт `span` с классом `gMenuClass` (`dropdownusr`), строит `dropdownusr-content` и пункты меню.
- `contextlib.js`: класс `gMenuClass`; поиск меню `locateMenuElement` (content.js).

### Popup (всплывающее окно)
- Окно события: `contextlib.js` → `showHistoryEventDlg`/`setPositionEventDlg`; разметка `addhistorydialog.html`.
- Окно досье персоны: `userinfodialog.js` → `userInfoDialogShow`; разметка `userinfodialog.html`.
- Инъекция: `contextlib.js` → `injectFragment`, `injectDialogs`.

### Получение идентификатора персоны
- Декларативно: команды `username` (обычно `attr href` + `match` регэксп) — `vkcom.js` (`usernamebyhref`, `usernamebytag`), `aftershock.js`, `rutube_env.js`.
- Императивно: извлечение никнейма из URL — `extractContUsername` (contws.js), `blogGetUsernameByLink` (content.js), разбор `href` в `youtubecom.js`/`habrcom.js`/`ljcom.js`.

### Маркировка / цвет
- Цвет статуса: `contextlib.js` → `colorItem`; вызов из `content.js` → `colorAll`.
- Маркировка события (мигание/подсветка): класс `history` — `content.js` → `addEventMark`/`removeEventMark`.
- Бейдж-счётчик: `initfirst.js` → `initazone().setBadge/getBadge`, вызывается в `addElemsToActiveZone` (content.js).

### Хранение данных
- `background.js`: IndexedDB `"contest"` (версия 3) — `onInstallInit` создаёт хранилища `ranks`, `users`, `history`, `identitier`; все обработчики `Handlers`: `histatuses`, `getstatus`/`setstatus`, `gethistoryitem`, `getuserhistory`, `addhistoryevent`, `getallevents`, `gettags`, `getdependentevents` и др.
- Обёртки записи: `contextlib.js` → `addHistoryEvent`, `removeHistoryEvent`, `setUserStatus`.

## 5. Места зависимости от конкретного домена / DOM-структуры портала

### 5.1. Список доменов и их маркеров
- `contws.js`: `contwsurls = ["cont.ws"]`, флаг `IsCont`.
- `vkcom.js`: `urls: ["vk.com", "m.vk.com"]` в `vkInstruct`.
- `ljcom.js`: `ljurls = ["livejournal.com"]`, флаг `IsLj`.
- `youtubecom.js`: `youtubeurls = ["youtube.com"]`, флаг `IsYoutube`.
- `habrcom.js`: `habrurls = ["habr.com"]`, флаг `IsHabr`.
- `aftershock.js`: `urls: ["aftershock.news"]` в `ashInstruct`.
- `rutube_env.js`: `rutubeurls = ["rutube.ru"]`, флаг `IsRutube`.

### 5.2. Декларативные инструкции (жестко зашитые CSS-селекторы и классы)
- `vkcom.js` — `vkInstruct.procedure`: селекторы `a[class~="author"]`, классы `pv_photo_wrap`, `reply_content`, `mv_comments`, `reply_footer`, `reply_dived`, `PostHeaderTitle__authorLink`, `pi_author`, `vkitPostHeaderTitle__root--RpTRm`, `vkitCommentBaseOwnerName__ownerNameLink--eqBxt` и др.; функции `usernamebytag`, `usernamebyhref`, `getimestamp`, `geteventurltype1/2`, `gettext`.
- `aftershock.js` — `ashInstruct`: селекторы `[class~="aft-postauthoricon"]`, `[class~="aft-comment"]`, классы `aft-postheadericons`, `username`, `comment_date`, `field-name-comment-body`, `aft-postcontent`; `meta[name="twitter:url"]`.
- `rutube_env.js` — `ruInstruct`: селекторы `a[href*="/channel/"]`, `.wdp-video-options-row-module__author`, классы `wdp-comment-item-module__content`, `wdp-comment-list-menu-module__button`, `wdp-comment-author-module__author-name` и др.

### 5.3. Императивные портальные парсеры
- `contws.js`: `ListContActiveZones` (селекторы `a[href*="cont.ws"]`, `a[href*="/@"]`, классы `m_author`, `new_post_prev`, `post-special-header`, `user-card__login`, `new_m_author`, `post_jr`, `topblock_author`, `sidebar_prv`, `author-link`, `post_prv`, `inline-posts-preview__author_link`, `feed-card__author`, `feed__item`; регэкспы `glob_templates`, `loc_templates`), `GetContTimestamp` (класс `comment-date`, `itemprop="datePublished"`), `GetContEventText` (`comment-body`, `article`), `extractContTime` (русские метки времени).
- `ljcom.js`: `ListLjActiveZones` (классы `i-ljuser-profile`, `i-ljuser-username`, `ljuser`, `b-singlepost-title`, `entry-title`, `aentry-post__title-text`, `subj-link`, `post-card__*`, `b-tree-twig`, `b-leaf-article`, `comment-head`, `mdspost-*`, `comment-inner`, `permalink`, id-шаблоны `ljcmt*`, `cmtbar*`, `b-pseudo`), `GetLjTimestamp`, `GetLjEventText`, `GetLjUserAlias`, `GetLayoutType` (классы `b-singlepost-author-date`, `vcard.author`, `aentry-head__block`, `comment-datetime`, `span[title]`, `span[class="timestamp"]`, `#content`).
- `youtubecom.com`: `ListYtActiveZones` (`[id=upload-info]`, `#header-author`, id `channel-name`, `author-text`, `published-time-text`, `body`; мобильная ветка `a[class="slim-owner-icon-and-title"]`, `a[class="comment-icon-container"]`; обработка `m.youtube.com`, `&lc`, генерация `FAKE` URL через `crypto.randomUUID`), `GetYtTimestamp`, `GetYtEventText` (id `#info-container`, `#info`, `[id=description-inline-expander]`, `[id=above-the-fold]`, `#main`, `#content`, `#content-text`, классы `comment-published-time`, `comment-text`).
- `habrcom.com`: `ListHabrActiveZones` (`a[class~="tm-user-info__username"]`, классы `article-snippet`, `tm-title__link`, `tm-articles-list__item`, `tm-article-presenter__snippet`, `tm-comment__header`, `tm-comment-thread__comment`, `tm-comment-thread__children`, `tm-user-info__user_appearance-post`; регэксп `articles|posts|news`), `GetHabrTimestamp` (`tm-comment-thread__comment-link`, `tm-article-snippet__meta`, `tm-post-snippet__meta`, `meta`, `tm-article-datetime-published`, `datetime`), `GetHabrEventText` (`tm-comment`, `tm-comment__body-content`, `article-formatted-body`, `tm-title_h1`).
- `rutube_env.js` (императивная часть): `ListRtActiveZones` и `proceedClicked` (манипуляции с `document.body.children`, `WebKitCSSMatrix`, классы `wdp-complaint-menu-item-module__complaintMenuItemLink`, координаты `getBoundingClientRect` — завязка на реальное всплывающее меню RUTUBE), `GetRtTimestamp` (русские относительные даты).

### 5.4. Зависимости, «спрятанные» в ядре
- `content.js` → `blogGetUsernameByLink`: жёстко зашитые регэкспы под **cont.ws** (`cont.ws/@<username>/...`, `<username>.cont.ws`); функция не универсальна.
- `content.js` → `handleActualUsersStatuses` и `handleDependentEvents`: зависят от URL-эквивалентов и `testnestedre`, генерируемых конкретными порталами (в частности, YouTube).
- `content.js` → `addElemsToActiveZone`: опирается на `attachMenuDomElement`, `attachBadge`, `totalblock`, заполняемые портальными парсерами.
- `contextlib.js` → `fillRootCandidatsList`/`listPotentParentEvents`: вызывают `soc.GetRootFor()` и `soc.IsNested()` — портальные методы.
- `uparse.js` → `GetTimestampTemplate`/`GetEventTextTemplate`: исполняют `doctcondition`-ветки с портальными классами.
- `background.js` → `getEquivalentLink`: завязка на маркер `#comment` и `/full` (формат **cont.ws**).
- `expimp.js` → `importParcedData`: для старых файлов жёстко подставляет `socnet = "contws"`.
- `background.js` → `onInstallInit`: при миграции БД принудительно присваивает `socnet = "contws"` всем старым `users`/`history`.

## 6. Итоговое разделение

- **Ядро (универсально):** `initfirst.js`, `uparse.js`, `snettemplate.js`, `mutation.js`, `background.js`, `userinfodialog.js`, `popup.js`, `expimp.js`, `datasummary.js`, `contextlib_mod.js`, а также диалоги/UI. Универсальность обеспечивается интерфейсом объекта сети (`ListActiveZones`, `GetTimestamp`, `GetEventText`, `GetUserAlias`, `GetRootFor`, `IsNested`).
- **Портал-зависимо:** `contws.js`, `vkcom.js`, `ljcom.js`, `youtubecom.js`, `habrcom.js`, `aftershock.js`, `rutube_env.js`.
- **«Серые зоны» (зависимости внутри ядра):** `content.js` (`blogGetUsernameByLink`, `handleDependentEvents`), `contextlib.js` (`fillRootCandidatsList`/`listPotentParentEvents`), `background.js` (`getEquivalentLink`, миграция в `onInstallInit`), `expimp.js` (подстановка `contws`).