import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n/i18n';
import { QRForm } from '@/components/QRForm';
import { QRPreview } from '@/components/QRPreview';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { QrCode, RotateCcw, Zap, Shield, Globe, Smartphone } from 'lucide-react';
import type { QRData } from '@/types/qr';

const initialData: QRData = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  company: '',
  email: '',
  phone: '',
  mobile: '',
  fax: '',
  website: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  note: '',
  social: {
    whatsapp: '',
    telegram: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    snapchat: '',
    github: '',
    behance: '',
    dribbble: '',
    pinterest: '',
  },
  customFields: [],
};

export default function App() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<QRData>(initialData);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReset = () => {
    if (window.confirm(t('messages.resetConfirm'))) {
      setData(initialData);
      toast.success(t('messages.resetConfirm'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white">
      <Toaster position="top-center" richColors theme="dark" />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f0f23]/95 backdrop-blur-md shadow-lg shadow-orange-500/5 border-b border-orange-500/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">{t('app.by')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t('buttons.reset')}</span>
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">{t('app.by')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
            {t('app.title')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            {t('app.subtitle')}
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-[#16213e]/60 border border-orange-500/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-orange-500/30 transition-colors">
              <Smartphone className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-300">VCard QR</span>
            </div>
            <div className="bg-[#16213e]/60 border border-orange-500/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-orange-500/30 transition-colors">
              <Globe className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-300">Social Media</span>
            </div>
            <div className="bg-[#16213e]/60 border border-orange-500/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-orange-500/30 transition-colors">
              <Shield className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-300">Lifetime Valid</span>
            </div>
            <div className="bg-[#16213e]/60 border border-orange-500/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-orange-500/30 transition-colors">
              <Zap className="w-6 h-6 text-orange-400" />
              <span className="text-sm text-gray-300">PNG & PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-3">
              <QRForm data={data} onChange={setData} />
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2">
              <QRPreview data={data} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-500/10 bg-[#0f0f23]/50 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <QrCode className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 font-semibold">{t('app.title')}</span>
          </div>
          <p className="text-gray-500 text-sm">
            &copy; {t('footer.year')} {t('footer.copyright')} - {t('footer.developer')}
          </p>
          <p className="text-gray-600 text-xs mt-2">
            {t('app.subtitle')}
          </p>
        </div>
      </footer>
    </div>
  );
}
