// عناوين مخزن الردود (Google Forms) — من سجل تنفيذ setupNabighaBackend
const BACKEND = {
  app: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSdUZ1FZAITB4XfPsuOAdYFgMYprp1vI1ciUoVWdH_Ha2a3sqg/formResponse',
    fields: { father_name: 'entry.1114383330', father_id: 'entry.1031072338', mobile: 'entry.348785490', nationality: 'entry.535999407',
      son_name: 'entry.987207982', student_id: 'entry.699957070', dob: 'entry.1482421544', grade: 'entry.306843058' }
  },
  pay: {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLScYDxu2GZGOF-GWR9r1ZZy7G3vPePqNHNUyTjV9FEV9Ornqrg/formResponse',
    fields: { student_name: 'entry.1106256509', mobile: 'entry.1681842716', school_type: 'entry.1703694703', school_name: 'entry.1868442927',
      method: 'entry.2047235225', plan: 'entry.1924171843', schedule: 'entry.1908906475', pay_day: 'entry.463775353', pledge: 'entry.2032147589' }
  }
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
