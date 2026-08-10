// ============================================================================
// VK RepuTracker: диагностика DOM-механизмов (учёт vk.ru / vk.com)
// ============================================================================
// Назначение:
//   Проверка, какие селекторы и механизмы из vkcom.js реально присутствуют
//   на открытой странице VK (vk.ru / vk.com / m.vk.com / m.vk.ru).
//   Используется для предварительной подготовки к адаптации расширения
//   под работу с vk.ru.
//
// Как запускать:
//   1. Открой нужную страницу VK.
//   2. DevTools (F12) -> вкладка Console.
//   3. Вставьте код и нажмите Enter.
//
// Что делает:
//   - Прогоняет CSS-селекторы из vkInstruct.procedure.
//   - Проверяет классы-якоря и атрибуты (mention_id, data-from-id и т.д.).
//   - Пытается извлечь username разными способами (mention_id, data-from-id,
//     href по всем хостам VK).
//   - Подсчитывает, на какой домен (vk.ru / vk.com) реально указывают ссылки.
//   - В конце формирует объект результата и кладёт его в window.__vkdiag,
//     а также предлагает скопировать JSON в буфер обмена (см. сохранение).
// ============================================================================
(() => {
  const VK_HOSTS = ['vk.com', 'm.vk.com', 'vk.ru', 'm.vk.ru'];
  const out = { url: location.href, mobile: /android|ipad|iphone/i.test(navigator.userAgent), ts: new Date().toISOString() };
  const blocks = [];

  // --- 1) CSS-селекторы из vkInstruct.procedure ---
  const selectors = {
    "a[class~='author'] (комментарий, десктоп)": 'a[class~="author"]',
    "a[class='PostHeaderTitle__authorLink']": 'a[class="PostHeaderTitle__authorLink"]',
    "a[class='pi_author']": 'a[class="pi_author"]',
    "a[class~='vkitPostHeaderTitle__root--RpTRm'] (моб. пост)": 'a[class~="vkitPostHeaderTitle__root--RpTRm"]',
    "a[class~='vkitCommentBaseOwnerName__ownerNameLink--eqBxt'] (моб. коммент)": 'a[class~="vkitCommentBaseOwnerName__ownerNameLink--eqBxt"]',
  };
  for (const [label, sel] of Object.entries(selectors)) {
    const els = document.querySelectorAll(sel);
    const info = { label, sel, count: els.length };
    if (els.length) {
      const el = els[0];
      info.sample = el.outerHTML.slice(0, 220);
      info.attrs = {};
      for (const a of el.attributes) info.attrs[a.name] = a.value;
    }
    blocks.push(info);
  }

  // --- 2) Классы-якоря и атрибуты из процедур vkInstruct ---
  const anchors = {
    "класс reply_content": '.reply_content',
    "класс reply_dived": '.reply_dived',
    "класс mv_comments": '.mv_comments',
    "класс reply_footer": '.reply_footer',
    "класс pv_photo_wrap": '.pv_photo_wrap',
    "класс PostHeaderTitle": '.PostHeaderTitle',
    "класс PostHeader": '[class~="PostHeader"]',
    "класс AvatarRichContainer": '.AvatarRichContainer',
    "класс vkitCommentBase__in--9swaG": '.vkitCommentBase__in--9swaG',
    "класс vkitCommentBase__root--tipbq": '.vkitCommentBase__root--tipbq',
    "атрибут mention_id": '[mention_id]',
    "атрибут data-from-id": '[data-from-id]',
    "атрибут data-post-id": '[data-post-id]',
    "data-testid=post_date_block_preview": '[data-testid="post_date_block_preview"]',
  };
  for (const [label, sel] of Object.entries(anchors)) {
    blocks.push({ label, sel, count: document.querySelectorAll(sel).length });
  }

  // --- 3) Извлечение username + определение домена в href ---
  function tryExtractUsername(el) {
    const cands = {};
    const mid = el.getAttribute('mention_id');
    if (mid) cands.mention_id = mid;
    const dfi = el.getAttribute('data-from-id');
    if (dfi) {
      cands['data-from-id'] = dfi;
      cands['data-from-id (преобразованный)'] = dfi.startsWith('-')
        ? 'public' + dfi.slice(1) : 'id' + dfi;
    }
    const href = el.getAttribute('href');
    if (href) {
      let m = href.match(/^\/([a-zA-Z0-9_.-]+)/);
      if (m) cands['href -> /user'] = m[1];
      for (const host of VK_HOSTS) {
        m = href.match(new RegExp(host.replace(/\./g, '\\.') + '\\/([a-zA-Z0-9_.-]+)'));
        if (m) cands['href -> ' + host] = m[1];
      }
    }
    return cands;
  }

  const allRefs = new Map();
  for (const sel of Object.values(selectors)) {
    for (const el of document.querySelectorAll(sel)) {
      if (!allRefs.has(el)) allRefs.set(el, { sel, cands: tryExtractUsername(el) });
    }
  }
  const userExtraction = [];
  for (const [el, info] of allRefs.entries()) {
    userExtraction.push({ sel: info.sel, username: el.innerText.trim().slice(0, 40), candidates: info.cands });
  }

  // --- 4) Какие домены реально встречаются в ссылках страницы ---
  const hostCount = {};
  for (const a of document.querySelectorAll('a[href]')) {
    const h = a.getAttribute('href') || '';
    for (const host of VK_HOSTS) if (h.includes(host)) hostCount[host] = (hostCount[host] || 0) + 1;
  }

  // --- Итог ---
  const report = { hostCount, blocks, userExtraction };
  const hit = blocks.reduce((s, b) => s + (b.count > 0 ? 1 : 0), 0);
  report.summary = hit + ' совпадений из ' + blocks.length;

  window.__vkdiag = report; // результат всегда доступен как window.__vkdiag

  console.log('%c=== VK RepuTracker: диагностика (vk.ru / vk.com) ===', 'font-weight:bold;font-size:14px');
  console.log('URL:', out.url, '| Мобильная:', out.mobile, '| Время:', out.ts);
  console.log('Домены в ссылках страницы:', hostCount);
  console.group('Селекторы и якоря:');
  blocks.forEach(b => console.log(`[${b.label}] count=${b.count}`, b.attrs ? { attrs: b.attrs, sample: b.sample } : ''));
  console.groupEnd();
  console.group('Извлечение username (первые 25):');
  userExtraction.slice(0, 25).forEach(u => console.log(u));
  console.groupEnd();
  console.log('%cИтог: ' + hit + ' из ' + blocks.length, 'font-weight:bold');

  // --- Сохранение ответа (см. REGLAMENT.md) ---
  // Копирование результата в буфер обмена (JSON).
  try {
    const json = JSON.stringify(report, null, 2);
    navigator.clipboard.writeText(json).then(
      () => console.log('%cОтчёт скопирован в буфер обмена.', 'color:green'),
      () => console.log('Не удалось скопировать в буфер обмена — используйте window.__vkdiag')
    );
  } catch (e) {
    console.log('Копирование недоступно:', e);
  }

  return report;
})();