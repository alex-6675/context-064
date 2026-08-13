--- context-064/main-qwen/Instructions_for_creating_a_file_page_behavior.md (原始)


+++ context-064/main-qwen/Instructions_for_creating_a_file_page_behavior.md (修改后)
# Инструкция для создания файла page_behavior (Приоритет 1)

## Цель
Создать отчет `VKRU_page_behavior_01.txt`, содержащий информацию о динамическом поведении страницы vk.ru:
- Признаки SPA (Single Page Application)
- Динамическая загрузка контента
- Мутации DOM при взаимодействии
- Наличие Shadow DOM
- Data-атрибуты с идентификаторами
- Статистика элементов страницы

## Предварительные требования
- Браузер: Microsoft Edge
- Страница: любая типичная страница vk.ru (например, лента новостей или пост с комментариями)
- Инструменты: только встроенные DevTools Edge (F12)

---

## Пошаговая инструкция

### ШАГ 1. Откройте Microsoft Edge
Запустите браузер Microsoft Edge.

### ШАГ 2. Откройте целевую страницу
Перейдите на страницу vk.ru, которую хотите исследовать.
Рекомендуется:
- Лента новостей: `https://vk.ru/feed`
- Пост с комментариями: `https://vk.ru/feed?w=wall-XXXXX_YYYYY`

### ШАГ 3. Откройте DevTools
Нажмите клавишу **F12** или комбинацию **Ctrl+Shift+I**.
Откроется панель разработчика Edge.

### ШАГ 4. Перейдите на вкладку Console
В верхней части панели DevTools выберите вкладку **Console**.

### ШАГ 5. Вставьте и выполните скрипт
Скопируйте весь код ниже и вставьте его в консоль. Нажмите **Enter**.

```javascript
(function inspectPageBehavior() {
    let report = "";

    // Header
    report += "=== PORTAL INSPECTION ===\n";
    report += "PORTAL: vk.ru\n";
    report += "PAGE_TYPE: page_behavior\n";
    report += "URL: " + window.location.href + "\n";
    report += "DATE: " + new Date().toLocaleDateString() + "\n";
    report += "TIME: " + new Date().toLocaleTimeString() + "\n";
    report += "ENTITY_TYPE: N/A\n";
    report += "ENTITY_NAME: N/A\n";
    report += "EVENT_TYPE: page_navigation\n";
    report += "SOURCE_CONTEXT: full_page\n";
    report += "=== END HEADER ===\n\n";

    // [10] PAGE_BEHAVIOR
    report += "[10] PAGE_BEHAVIOR\n";
    report += "------------------\n";

    // Initial URL
    const initialURL = window.location.href;
    report += "INITIAL_URL: " + initialURL + "\n";
    report += "HOSTNAME: " + window.location.hostname + "\n";
    report += "PATHNAME: " + window.location.pathname + "\n\n";

    // SPA Detection
    report += "SPA_INDICATORS:\n";
    report += "  - history.pushState exists: " + (typeof history.pushState === 'function' ? 'YES' : 'NO') + "\n";
    report += "  - history.replaceState exists: " + (typeof history.replaceState === 'function' ? 'YES' : 'NO') + "\n";
    report += "  - document.readyState: " + document.readyState + "\n";
    report += "  - Single Page App likely: " + (document.querySelectorAll('[data-router], [role="application"], .spa-container, #app, #root').length > 0 ? 'YES' : 'NO') + "\n\n";

    // Dynamic Content Indicators
    report += "DYNAMIC_CONTENT_INDICATORS:\n";
    const ajaxIndicators = document.querySelectorAll('[data-ajax], [data-dynamic], [data-load], .lazy, .infinite-scroll');
    report += "  - Elements with lazy/dynamic attributes: " + ajaxIndicators.length + "\n";
    const scriptTags = document.getElementsByTagName('script');
    let asyncScripts = 0;
    for (let s of scriptTags) { if (s.async || s.defer) asyncScripts++; }
    report += "  - Async/defer scripts: " + asyncScripts + "/" + scriptTags.length + "\n\n";

    // DOM Statistics
    report += "DOM_STATISTICS:\n";
    report += "  - Total elements: " + document.getElementsByTagName('*').length + "\n";
    report += "  - Links (a tags): " + document.getElementsByTagName('a').length + "\n";
    report += "  - Buttons: " + document.getElementsByTagName('button').length + "\n";
    report += "  - Forms: " + document.getElementsByTagName('form').length + "\n";
    report += "  - Images: " + document.getElementsByTagName('img').length + "\n";
    report += "  - Comments in DOM: " + (document.documentElement.innerHTML.match(/<!--/g) || []).length + "\n\n";

    // Potential Profile Links
    report += "POTENTIAL_PROFILE_LINKS:\n";
    const links = document.querySelectorAll('a[href*="/"], a[href*="profile"], a[href*="user"], a[href*="id="]');
    report += "  - Count: " + links.length + "\n";
    if (links.length > 0 && links.length <= 20) {
        report += "  - Sample hrefs:\n";
        for (let i = 0; i < Math.min(links.length, 10); i++) {
            report += "      " + links[i].getAttribute('href') + "\n";
        }
    } else if (links.length > 20) {
        report += "  - Too many to list (" + links.length + " total)\n";
    }
    report += "\n";

    // Data Attributes Discovery
    report += "DATA_ATTRIBUTES_DISCOVERY:\n";
    const allElements = document.querySelectorAll('[data-user-id], [data-author-id], [data-owner-id], [data-peer-id], [data-id], [data-cs], [data-hash]');
    report += "  - Elements with ID-like data-*: " + allElements.length + "\n";
    if (allElements.length > 0 && allElements.length <= 15) {
        for (let i = 0; i < Math.min(allElements.length, 10); i++) {
            const el = allElements[i];
            let attrs = "";
            for (let attr of el.attributes) {
                if (attr.name.startsWith('data-')) {
                    attrs += attr.name + "=" + attr.value + " ";
                }
            }
            report += "      <" + el.tagName + "> " + attrs.trim() + "\n";
        }
    }
    report += "\n";

    // Shadow DOM Check
    report += "SHADOW_DOM_CHECK:\n";
    const shadowHosts = document.querySelectorAll('*');
    let shadowCount = 0;
    for (let el of shadowHosts) {
        if (el.shadowRoot) shadowCount++;
    }
    report += "  - Shadow roots found: " + shadowCount + "\n";
    if (shadowCount > 0) {
        report += "  - Note: Some content may be inside Shadow DOM\n";
    } else {
        report += "  - No open Shadow DOM detected\n";
    }
    report += "\n";

    // MutationObserver Test (Short)
    report += "MUTATION_OBSERVER_TEST (5 seconds):\n";
    report += "  - Starting observation...\n";

    let mutationCount = 0;
    let mutationTypes = {};

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            mutationCount++;
            const type = m.type;
            mutationTypes[type] = (mutationTypes[type] || 0) + 1;
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    report += "  - Waiting 5 seconds for dynamic changes...\n";

    setTimeout(() => {
        observer.disconnect();

        report += "  - Mutations detected in 5s: " + mutationCount + "\n";
        if (mutationCount > 0) {
            report += "  - Mutation types:\n";
            for (let type in mutationTypes) {
                report += "      " + type + ": " + mutationTypes[type] + "\n";
            }
        } else {
            report += "  - No DOM mutations detected in 5 seconds\n";
        }

        report += "\n";
        report += "CONCLUSION:\n";
        if (mutationCount > 50) {
            report += "  - HIGH dynamic activity detected (likely SPA or infinite scroll)\n";
        } else if (mutationCount > 10) {
            report += "  - MODERATE dynamic activity (some dynamic loading)\n";
        } else if (mutationCount > 0) {
            report += "  - LOW dynamic activity (minor updates)\n";
        } else {
            report += "  - NO dynamic activity detected in test period (may still be dynamic on interaction)\n";
        }

        report += "\n";
        report += "RECOMMENDATION:\n";
        report += "  - Test navigation between pages without reload\n";
        report += "  - Test scrolling for infinite load\n";
        report += "  - Test opening comments/messages dynamically\n";

        report += "\n=== END REPORT ===\n";

        console.log(report);

        // Copy to clipboard
        navigator.clipboard.writeText(report).then(() => {
            console.log("\n✓ Report copied to clipboard!");
            console.log("Paste into Notepad and save as: VKRU_page_behavior_01.txt");
        }).catch(err => {
            console.log("\n⚠ Could not copy to clipboard. Please manually select and copy the report above.");
        });

    }, 5000);

})();
```

### ШАГ 6. Дождитесь завершения
Скрипт выполнит тестирование в течение **5 секунд**.
Дождитесь появления полного отчета в консоли.

### ШАГ 7. Скопируйте результат
Отчет автоматически копируется в буфер обмена.
Если копирование не удалось — выделите текст отчета мышью и скопируйте вручную (**Ctrl+C**).

### ШАГ 8. Сохраните файл
1. Откройте **Блокнот** (Notepad).
2. Вставьте скопированный текст (**Ctrl+V**).
3. Выберите **Файл → Сохранить как**.
4. Имя файла: `VKRU_page_behavior_01.txt`
5. Кодировка: **UTF-8**.
6. Сохраните файл в директорию `result_of_investigation_VK_RU/`.

---

## Структура отчета

Файл должен содержать следующие секции:

| Секция | Описание |
|--------|----------|
| `[HEADER]` | Портал, тип страницы, URL, дата, время |
| `[10] PAGE_BEHAVIOR` | Основная секция с данными о поведении страницы |
| `SPA_INDICATORS` | Признаки SPA (pushState, readyState, маркеры) |
| `DYNAMIC_CONTENT_INDICATORS` | Элементы с атрибутами lazy/dynamic, асинхронные скрипты |
| `DOM_STATISTICS` | Общее количество элементов, ссылок, кнопок, форм, изображений |
| `POTENTIAL_PROFILE_LINKS` | Количество и примеры ссылок на профили |
| `DATA_ATTRIBUTES_DISCOVERY` | Найденные data-* атрибуты с идентификаторами |
| `SHADOW_DOM_CHECK` | Наличие Shadow DOM |
| `MUTATION_OBSERVER_TEST` | Результаты наблюдения за мутациями DOM (5 секунд) |
| `CONCLUSION` | Вывод об уровне динамической активности |
| `RECOMMENDATION` | Рекомендации по дальнейшему тестированию |

---

## Критерии успешного выполнения

- [ ] Файл сохранен с именем `VKRU_page_behavior_01.txt`
- [ ] Кодировка файла: UTF-8
- [ ] Присутствует заголовок `=== PORTAL INSPECTION ===`
- [ ] Заполнена секция `[10] PAGE_BEHAVIOR`
- [ ] Указаны все подразделы: SPA_INDICATORS, DYNAMIC_CONTENT_INDICATORS, DOM_STATISTICS, и т.д.
- [ ] Присутствует секция `CONCLUSION` с оценкой динамической активности
- [ ] Присутствует секция `RECOMMENDATION`

---

## Примечания

- Скрипт безопасен и не вносит изменений в страницу.
- Тест мутаций DOM длится ровно 5 секунд.
- Если на странице есть Shadow DOM, это будет указано в отчете.
- При большом количестве ссылок (>20) они не перечисляются полностью.
- Отчет можно использовать для любого портала, заменив `vk.ru` в первой строке.

---

## Дальнейшие действия

После создания файла:
1. Поместите его в директорию `result_of_investigation_VK_RU/`.
2. Сообщите исполнителю о готовности.
3. Будет проведен сводный анализ всех 11 файлов.
4. На основе анализа будет сформирована конфигурация адаптера для vk.ru.