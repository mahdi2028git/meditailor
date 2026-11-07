document.addEventListener('DOMContentLoaded', () => {
  const langBtns = document.querySelectorAll('.lang-btn');
  const html = document.documentElement;
  let currentLang = localStorage.getItem('meditailor-lang') || 'en';

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('meditailor-lang', lang);
    const isRtl = lang === 'fa' || lang === 'ar';
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.body.classList.toggle('rtl', isRtl);
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    const t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        if (key === 'contact_address' || key === 'contact_hours') {
          el.innerHTML = t[key].replace(/\n/g, '<br>');
        } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });
    document.title = lang === 'fa'
      ? 'مدی‌تیلور | کارخانه لباس بیمارستانی'
      : lang === 'ar'
        ? 'ميدي تيلور | مصنع ملابس المستشفيات'
        : lang === 'tr'
          ? 'MediTailor | Hastane Giyim Fabrikası'
          : 'MediTailor | Hospital Clothing Factory';
  }

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  setLanguage(currentLang);

  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  menuToggle.addEventListener('click', () => { nav.classList.toggle('open'); });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => { nav.classList.remove('open'); });
  });

  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link && scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name') || '',
      company: fd.get('company') || '',
      email: fd.get('email') || '',
      phone: fd.get('phone') || '',
      product: fd.get('product') || '',
      message: fd.get('message') || '',
      language: currentLang,
    };
    const fallback = {
      en: 'Thank you! Your request has been received. We will contact you soon.',
      fa: 'متشکریم! درخواست شما دریافت شد. به زودی با شما تماس خواهیم گرفت.',
      ar: 'شكراً لك! تم استلام طلبك. سنتواصل معك قريباً.',
      tr: 'Teşekkürler! Talebiniz alındı. Yakında sizinle iletişime geçeceğiz.'
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message || fallback[currentLang] || fallback.en);
        form.reset();
      } else {
        alert(fallback[currentLang] || fallback.en);
        form.reset();
      }
    } catch (err) {
      alert(fallback[currentLang] || fallback.en);
      form.reset();
    }
  });
});
