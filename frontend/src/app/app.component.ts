import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService, Lang } from './core/i18n/i18n.service';
import { ApiService, Product, SiteStats } from './core/api/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);

  products = signal<Product[]>([]);
  stats = signal<SiteStats | null>(null);
  loading = signal(true);
  error = signal(false);
  menuOpen = signal(false);
  scrolled = signal(false);
  submitting = signal(false);
  formSuccess = signal<string | null>(null);

  form = {
    name: '',
    company: '',
    email: '',
    phone: '',
    product: '',
    message: '',
  };

  readonly langs: { code: Lang; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fa', label: 'فا' },
    { code: 'ar', label: 'ع' },
    { code: 'tr', label: 'TR' },
  ];

  readonly features = [
    { icon: '✓', titleKey: 'feature1_title', descKey: 'feature1_desc' },
    { icon: '🧵', titleKey: 'feature2_title', descKey: 'feature2_desc' },
    { icon: '🌍', titleKey: 'feature3_title', descKey: 'feature3_desc' },
    { icon: '✂️', titleKey: 'feature4_title', descKey: 'feature4_desc' },
  ];

  readonly services = [
    { num: '01', titleKey: 'serv1_title', descKey: 'serv1_desc' },
    { num: '02', titleKey: 'serv2_title', descKey: 'serv2_desc' },
    { num: '03', titleKey: 'serv3_title', descKey: 'serv3_desc' },
    { num: '04', titleKey: 'serv4_title', descKey: 'serv4_desc' },
  ];

  t = (key: string) => this.i18n.t(key);

  productName = (p: Product) => p.name[this.i18n.lang()] ?? p.name['en'] ?? '';
  productDesc = (p: Product) =>
    p.description[this.i18n.lang()] ?? p.description['en'] ?? '';
  productTags = (p: Product) =>
    p.tags[this.i18n.lang()] ?? p.tags['en'] ?? [];

  ngOnInit(): void {
    window.addEventListener('scroll', () => {
      this.scrolled.set(window.scrollY > 20);
    });

    this.api.getProducts().subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });

    this.api.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: () => {},
    });
  }

  setLang(code: Lang): void {
    this.i18n.setLang(code);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  scrollTo(id: string): void {
    this.closeMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  onSubmit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.formSuccess.set(null);

    this.api
      .submitContact({
        ...this.form,
        language: this.i18n.lang(),
      })
      .subscribe({
        next: (res) => {
          this.formSuccess.set(res.message);
          this.form = {
            name: '',
            company: '',
            email: '',
            phone: '',
            product: '',
            message: '',
          };
          this.submitting.set(false);
        },
        error: () => {
          this.formSuccess.set(
            this.i18n.lang() === 'fa'
              ? 'خطا در ارسال. لطفاً دوباره تلاش کنید.'
              : 'Failed to send. Please try again.'
          );
          this.submitting.set(false);
        },
      });
  }

  formatNumber(n: number | undefined): string {
    if (n == null) return '—';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
    return n + '+';
  }
}
