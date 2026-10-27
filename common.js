// عناوين مخزن الردود (Google Forms) — من سجل تنفيذ setupNabighaBackend
const BACKEND = {
  app: { action: '', fields: {} },
  pay: { action: '', fields: {} }
};

const toLatin = s => String(s || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).trim();
const RX = {
  id: /^[12]\d{9}$/,
  mobile: /^(?:\+?966|00966|0)?5\d{8}$/
};
const normMobile = v => { const m = toLatin(v).replace(/[\s-]/g, ''); return RX.mobile.test(m) ? '0' + m.slice(-9) : m; };
const sar = n => n.toLocaleString('en-US') + ' ريال';

// يعلّم الحقل بخطأ أو يزيله، ويعيد صحّته
function mark(el, ok) {
  const f = el.closest('.field');
  if (f) f.classList.toggle('bad', !ok);
  return ok;
}
function radioVal(form, name) {
  const r = form.querySelector('input[name="' + name + '"]:checked');
  return r ? r.value : '';
}

// يرسل إلى Google Forms. الاستجابة مُعتمة (no-cors) فلا نقرأها؛ فشل الشبكة وحده يُعدّ خطأ
async function send(kind, data) {
  const b = BACKEND[kind];
  if (!b.action) throw new Error('not-configured');
  const body = new URLSearchParams();
  Object.keys(data).forEach(k => { if (b.fields[k]) body.append(b.fields[k], data[k]); });
  await fetch(b.action, { method: 'POST', mode: 'no-cors', body });
}

function store(key, val) { try { sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function recall(key) { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { return null; } }
