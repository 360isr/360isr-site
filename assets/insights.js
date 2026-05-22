// 360iSR — Live Substack feed for /insights/
// Fetches the latest posts from https://360isr.substack.com/feed via the
// rss2json.com public service (returns JSON, no XML parsing required, more
// reliable than CORS proxies). Renders into #insights-grid using the same
// markup pattern as the static fallback. If the fetch fails for any reason,
// the static cards already present in the HTML are kept as a graceful
// fallback and the caption text is updated.

(function () {
  'use strict';

  var FEED_URL = 'https://360isr.substack.com/feed';
  // rss2json's free tier doesn't accept the 'count' param; it returns ~10 items
  // by default which is sufficient. We trim to MAX_ITEMS client-side anyway.
  var ENDPOINT = 'https://api.rss2json.com/v1/api.json?rss_url=' +
                 encodeURIComponent(FEED_URL);
  var MAX_ITEMS = 12;
  var TIMEOUT_MS = 7000;

  function formatDate(input) {
    try {
      var d = new Date(input);
      if (isNaN(d.getTime())) return '';
      var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      return d.getUTCDate() + ' ' + months[d.getUTCMonth()] + ' ' + d.getUTCFullYear();
    } catch (e) {
      return '';
    }
  }

  function stripHtml(html) {
    if (!html) return '';
    var noTags = String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    var tmp = document.createElement('textarea');
    tmp.innerHTML = noTags;
    return tmp.value.trim();
  }

  function trimTo(text, max) {
    if (!text) return '';
    if (text.length <= max) return text;
    var slice = text.slice(0, max);
    var lastSpace = slice.lastIndexOf(' ');
    if (lastSpace > 60) slice = slice.slice(0, lastSpace);
    return slice.replace(/[\s.,;:!?-]+$/, '') + '…';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function buildCardHtml(item) {
    var title = escapeHtml(item.title || 'Untitled');
    var link = item.link || '#';
    var dateLabel = escapeHtml(formatDate(item.pubDate) || 'Substack');
    // rss2json returns 'description' as the raw HTML and 'content' as the full body
    var rawDesc = item.description || item.content || '';
    var desc = escapeHtml(trimTo(stripHtml(rawDesc), 140));
    return (
      '<a class="insight-card-large" href="' + link + '" target="_blank" rel="noopener">' +
        '<div class="meta"><span>Substack</span><span>' + dateLabel + '</span></div>' +
        '<h3>' + title + '</h3>' +
        '<p>' + desc + '</p>' +
      '</a>'
    );
  }

  function setCaption(state) {
    var cap = document.getElementById('insights-feed-caption');
    if (!cap) return;
    if (state === 'live') {
      cap.setAttribute('data-state', 'live');
      cap.textContent = 'Live · pulled from 360iSR Substack feed';
    } else {
      cap.setAttribute('data-state', 'fallback');
      cap.textContent = 'Curated archive · last refreshed manually';
    }
  }

  function renderItems(items) {
    var grid = document.getElementById('insights-grid');
    if (!grid || !items || !items.length) return 0;
    var html = items.slice(0, MAX_ITEMS).map(buildCardHtml).join('');
    grid.innerHTML = html;
    return Math.min(items.length, MAX_ITEMS);
  }

  function loadFeed() {
    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timeoutId = null;
    if (controller) {
      timeoutId = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);
    }
    var opts = controller ? { signal: controller.signal } : {};

    fetch(ENDPOINT, opts)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        if (timeoutId) clearTimeout(timeoutId);
        if (!data || data.status !== 'ok' || !data.items || !data.items.length) {
          throw new Error('Feed unavailable');
        }
        var count = renderItems(data.items);
        if (count > 0) {
          setCaption('live');
          document.documentElement.setAttribute('data-insights-state', 'live');
          document.documentElement.setAttribute('data-insights-count', String(count));
        } else {
          setCaption('fallback');
          document.documentElement.setAttribute('data-insights-state', 'fallback');
        }
      })
      .catch(function (err) {
        if (timeoutId) clearTimeout(timeoutId);
        // Silent: leave static fallback cards in place, just update caption.
        setCaption('fallback');
        document.documentElement.setAttribute('data-insights-state', 'fallback');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFeed);
  } else {
    loadFeed();
  }
})();
