import { Injectable, signal, computed, effect } from '@angular/core';
import { Lang, TRANSLATIONS } from './translations';

export type { Lang };

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'meditailor-lang';
  readonly lang = signal<Lang>(this.loadLang());

  readonly isRtl = computed(() => this.lang() === 'fa' || this.lang() === 'ar');

  constructor() {
    effect(() => {
      const l = this.lang();
      localStorage.setItem(this.storageKey, l);
      document.documentElement.lang = l;
      document.documentElement.dir = this.isRtl() ? 'rtl' : 'ltr';
      document.body.classList.toggle('rtl', this.isRtl());
      const titles: Record<Lang, string> = {
        en: 'MediTailor | Hospital Clothing Factory',
        fa: 'مدی‌تیلور | کارخانه لباس بیمارستانی',
        ar: 'ميدي تيلور | مصنع ملابس المستشفيات',
        tr: 'MediTailor | Hastane Giyim Fabrikası',
      };
      document.title = titles[l];
    });
  }

  t(key: string): string {
    return TRANSLATIONS[this.lang()][key] ?? TRANSLATIONS['en'][key] ?? key;
  }

  setLang(lang: Lang): void {
    if (TRANSLATIONS[lang]) {
      this.lang.set(lang);
    }
  }

  private loadLang(): Lang {
    const saved = localStorage.getItem(this.storageKey) as Lang | null;
    if (saved && TRANSLATIONS[saved]) return saved;
    return 'en';
  }
}
