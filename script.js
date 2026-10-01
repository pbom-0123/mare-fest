// Countdown
const target = new Date('2027-07-09T16:00:00+01:00').getTime();
const pad = n => String(n).padStart(2, '0');
function tick() {
  let diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86400000); diff %= 86400000;
  const h = Math.floor(diff / 3600000); diff %= 3600000;
  const m = Math.floor(diff / 60000); diff %= 60000;
  const s = Math.floor(diff / 1000);
  document.getElementById('cd-days').textContent = d;
  document.getElementById('cd-hours').textContent = pad(h);
  document.getElementById('cd-mins').textContent = pad(m);
  document.getElementById('cd-secs').textContent = pad(s);
}
tick(); setInterval(tick, 1000);

// Line-up
const artists = [
  { name: 'Luna Vidal', genre: 'Indie pop', day: 'Fri', stage: 'River Stage', headliner: true },
  { name: 'Os Faróis', genre: 'Portuguese rock', day: 'Fri', stage: 'Dock Stage' },
  { name: 'Kairo', genre: 'Electronic', day: 'Sat', stage: 'River Stage', headliner: true },
  { name: 'Marta Sal', genre: 'Fado revival', day: 'Sat', stage: 'Dock Stage' },
  { name: 'Neon Harbour', genre: 'Synthwave', day: 'Sun', stage: 'River Stage', headliner: true },
  { name: 'Duo Brisa', genre: 'Acoustic', day: 'Sun', stage: 'Dock Stage' }
];
const dayNames = { Fri: 'Friday 9', Sat: 'Saturday 10', Sun: 'Sunday 11' };
function renderArtists(day) {
  const list = day === 'all' ? artists : artists.filter(a => a.day === day);
  document.getElementById('artists').innerHTML = list.map(a => `
    <li class="${a.headliner ? 'bg-ocean-900 text-sand' : 'bg-white border-2 border-ocean-900/10'} rounded-3xl p-6 flex flex-col justify-between min-h-[10rem]">
      <div class="flex justify-between items-start gap-3">
        <p class="text-sm font-semibold ${a.headliner ? 'text-foam' : 'text-ocean-700'}">${dayNames[a.day]} · ${a.stage}</p>
        ${a.headliner ? '<span class="text-xs font-extrabold bg-coral-500 text-ocean-900 px-2 py-1 rounded-full">Headliner</span>' : ''}
      </div>
      <div>
        <h3 class="font-display font-extrabold text-3xl tracking-tight">${a.name}</h3>
        <p class="${a.headliner ? 'text-sand/70' : 'text-ocean-700'}">${a.genre}</p>
      </div>
    </li>`).join('');
}
document.querySelectorAll('.day-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.day-btn').forEach(b => {
      b.classList.remove('bg-ocean-900', 'text-sand');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('bg-ocean-900', 'text-sand');
    btn.setAttribute('aria-pressed', 'true');
    renderArtists(btn.dataset.day);
  });
});
renderArtists('all');

// Tickets: each card links to the ticketing partner
const TICKET_URL = '#'; // replace with the real ticket shop link
const tickets = [
  { name: 'Day Pass', price: 45, perks: ['One day of your choice', 'Access to both stages', 'Free river shuttle'] },
  { name: '3-Day Pass', price: 99, perks: ['All three days', 'Access to both stages', 'Free river shuttle', 'Festival tote bag'], featured: true },
  { name: 'VIP 3-Day', price: 189, perks: ['All three days', 'VIP deck with river view', 'Fast-track entry', 'Private bar and toilets'] }
];
document.getElementById('ticketCards').innerHTML = tickets.map(t => `
  <article class="${t.featured ? 'bg-coral-500 text-ocean-900' : 'bg-white/5 border border-white/10'} rounded-3xl p-6 flex flex-col">
    ${t.featured ? '<p class="text-xs font-extrabold uppercase tracking-widest mb-2">Most popular</p>' : ''}
    <h3 class="font-display font-extrabold text-2xl">${t.name}</h3>
    <p class="font-display font-extrabold text-5xl my-4">€${t.price}</p>
    <ul class="space-y-2 text-sm mb-6 flex-1">${t.perks.map(p => `<li class="flex gap-2"><span aria-hidden="true">✓</span>${p}</li>`).join('')}</ul>
    <a href="${TICKET_URL}" class="text-center font-extrabold py-3 rounded-full ${t.featured ? 'bg-ocean-900 text-sand hover:bg-ocean-800' : 'bg-sand text-ocean-900 hover:bg-white'}">Buy ${t.name}</a>
  </article>`).join('');

// Newsletter form: validates, then sends to Formspree (or shows a demo message)
const newsForm = document.getElementById('newsForm');
const newsMsg = document.getElementById('newsMsg');
newsForm.addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('newsEmail');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  input.setAttribute('aria-invalid', !ok);
  if (!ok) { newsMsg.textContent = 'Please enter a valid email address.'; return; }
  if (newsForm.action.includes('YOUR_FORM_ID')) {
    newsMsg.textContent = 'Demo only: add your Formspree ID to collect real sign-ups.';
    newsForm.reset();
    return;
  }
  try {
    const res = await fetch(newsForm.action, { method: 'POST', body: new FormData(newsForm), headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error();
    newsMsg.textContent = 'You are on the list. See you by the river!';
    newsForm.reset();
  } catch {
    newsMsg.textContent = 'Something went wrong. Please try again later.';
  }
});

// Fade sections in when they scroll into view
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
