(() => {
  for (const list of document.querySelectorAll('[data-list]')) {
    const more = list.parentElement.querySelector('.more');
    if (!more) continue;
    const cards = Array.from(list.children);
    let visible = 6;
    const update = () => {
      cards.forEach((card, i) => { card.hidden = i >= visible; });
      more.hidden = visible >= cards.length;
    };
    more.addEventListener('click', () => { const first = visible; visible += 6; update(); cards[first]?.querySelector('a')?.focus(); });
    update();
  }
  const input = document.querySelector('#article-search');
  if (!input) return;
  const results = document.querySelector('.lookup-results');
  const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  function search() {
    const words = normalize(input.value).split(/\s+/).filter(Boolean);
    results.hidden = !words.length;
    let count = 0;
    for (const item of results.querySelectorAll('li')) {
      const text = normalize(item.textContent + ' ' + item.dataset.words);
      item.hidden = !words.every(word => text.includes(word));
      if (!item.hidden) count++;
    }
    results.querySelector('[role=status]').textContent = count ? 'Найдено материалов: ' + count : 'По этому запросу пока нет материалов.';
  }
  input.form.addEventListener('submit', e => {
    e.preventDefault();
    const url = new URL(location.href);
    if (input.value.trim()) url.searchParams.set('q', input.value.trim());
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    search();
  });
  input.addEventListener('input', search);
  input.value = new URLSearchParams(location.search).get('q') || '';
  search();
})();
