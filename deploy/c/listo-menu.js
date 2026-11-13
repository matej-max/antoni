(() => {
    const section = document.querySelector('#denne-menu');
    if (!section) return;

    const days = section.querySelector('.days');
    const items = section.querySelector('#daily-items');
    const period = section.querySelector('#daily-period');
    const origin = section.querySelector('#daily-origin');
    const priceBox = section.querySelector('#daily-price');
    const allergens = section.querySelector('#daily-allergens');
    const announcement = section.querySelector('#day-announcement');
    const endpoint = 'https://testovacka.listo.sk/api/public/v1/menu/antoni/centrum/sk';
    const allergenNames = ['obilniny obsahujúce lepok', 'kôrovce', 'vajcia', 'ryby', 'arašidy', 'sója', 'mlieko', 'orechy', 'zeler', 'horčica', 'sezam', 'oxid siričitý a siričitany', 'vlčí bôb', 'mäkkýše'];
    const shortDays = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
    const euro = new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' });
    const date = new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'numeric', timeZone: 'UTC' });
    const fullDate = new Intl.DateTimeFormat('sk-SK', { dateStyle: 'long', timeZone: 'UTC' });
    const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Bratislava', dateStyle: 'short' }).format(new Date());

    function element(tag, text, className) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        node.textContent = text;
        return node;
    }

    function showDay(day, buttons, index) {
        buttons.forEach((button, position) => {
            button.classList.toggle('active', position === index);
            button.setAttribute('aria-pressed', String(position === index));
        });
        const panel = element('section', '', 'day-panel');
        const heading = element('h4', day.label + ' ', 'day-title');
        heading.append(element('span', fullDate.format(new Date(day.date))));
        panel.append(heading);
        const codes = new Set();
        for (const item of day.items) {
            const soup = item.slot.startsWith('Polievka');
            const row = element('article', '', soup ? 'dish soup' : 'dish');
            const details = element('div', '');
            const itemCodes = item.allergens ?? [];
            itemCodes.forEach(code => codes.add(Number(code)));
            details.append(element('h4', item.name), element('p', [
                item.portion, itemCodes.length ? 'Alergény: ' + itemCodes.join(', ') : '',
            ].filter(Boolean).join(' | ')));
            row.append(element('span', item.slot, 'dish-slot'), details);
            if (item.price > 0) row.append(element('strong', euro.format(item.price)));
            panel.append(row);
        }
        if (!day.items.length) panel.append(element('p', 'Na tento deň ponuka nie je zverejnená.'));
        items.replaceChildren(panel);
        const legend = [...codes].sort((a, b) => a - b).filter(code => allergenNames[code - 1]);
        allergens.querySelector('p').textContent = legend.map(code => code + ' — ' + allergenNames[code - 1]).join(', ');
        allergens.hidden = !legend.length;
        announcement.textContent = 'Zobrazené menu: ' + day.label + ' ' + date.format(new Date(day.date));
    }

    async function load() {
        const response = await fetch(endpoint, { credentials: 'omit', signal: AbortSignal.timeout(8000) });
        if (response.status === 404) {
            items.replaceChildren(element('p', 'Denné menu zatiaľ nie je zverejnené.'));
            return;
        }
        if (!response.ok) throw new Error('Menu unavailable');
        const { menu, days: entries } = await response.json();
        if (!entries.length || menu.ends_on < today) {
            items.replaceChildren(element('p', 'Nové denné menu zatiaľ nie je zverejnené.'));
            return;
        }

        const buttons = entries.map((entry, index) => {
            const day = new Date(entry.date);
            const button = element('button', '');
            button.type = 'button';
            button.append(element('span', shortDays[(day.getUTCDay() + 6) % 7]), element('strong', date.format(day)));
            button.addEventListener('click', () => showDay(entry, buttons, index));
            return button;
        });
        days.replaceChildren(...buttons);
        days.hidden = false;
        period.textContent = date.format(new Date(menu.starts_on)) + ' – ' + fullDate.format(new Date(menu.ends_on));
        origin.textContent = menu.starts_on > today ? 'Ponuka na najbližší zverejnený týždeň' : 'Ponuka na aktuálny týždeň';
        origin.hidden = false;
        const prices = entries.flatMap(day => day.items).filter(item => /^Menu \d+$/.test(item.slot) && item.price > 0).map(item => item.price);
        if (prices.length) {
            priceBox.querySelector('strong').textContent = euro.format(Math.min(...prices));
            priceBox.hidden = false;
        }
        const active = entries.findIndex(entry => entry.date >= today);
        const selected = Math.max(0, active);
        showDay(entries[selected], buttons, selected);
    }

    load().catch(() => {
        items.replaceChildren(element('p', 'Denné menu sa nepodarilo načítať. Aktuálnu ponuku vám radi povieme na čísle 0948 871 984.'));
    });
})();
