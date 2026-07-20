import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  User, Briefcase, Mail, Phone, MapPin, Globe, MessageSquare,
  Facebook, Instagram, Twitter, Linkedin, Youtube, Github,
  Plus, Trash2, MessageCircle, Video, Camera, Palette, Dribbble,
  PinIcon, Smartphone
} from 'lucide-react';
import type { QRData, CustomSocialField } from '@/types/qr';

interface QRFormProps {
  data: QRData;
  onChange: (data: QRData) => void;
}

const socialIcons: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare className="w-4 h-4" />,
  telegram: <MessageCircle className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  tiktok: <Video className="w-4 h-4" />,
  snapchat: <Camera className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  behance: <Palette className="w-4 h-4" />,
  dribbble: <Dribbble className="w-4 h-4" />,
  pinterest: <PinIcon className="w-4 h-4" />,
};

const socialKeys = Object.keys(socialIcons);

export function QRForm({ data, onChange }: QRFormProps) {
  const { t } = useTranslation();

  const updateField = (field: keyof QRData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateSocial = (platform: string, value: string) => {
    onChange({
      ...data,
      social: { ...data.social, [platform]: value },
    });
  };

  const addCustomField = () => {
    const newField: CustomSocialField = {
      id: `custom_${Date.now()}`,
      label: '',
      value: '',
    };
    onChange({
      ...data,
      customFields: [...(data.customFields || []), newField],
    });
  };

  const updateCustomField = (id: string, field: 'label' | 'value', value: string) => {
    onChange({
      ...data,
      customFields: (data.customFields || []).map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    });
  };

  const removeCustomField = (id: string) => {
    onChange({
      ...data,
      customFields: (data.customFields || []).filter((f) => f.id !== id),
    });
  };

  const inputClasses = "bg-[#1a1a2e]/50 border-orange-500/20 text-white placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20";
  const labelClasses = "text-gray-300 flex items-center gap-2";

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-[#16213e]/80 border-orange-500/20 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-400 flex items-center gap-2 text-lg">
            <User className="w-5 h-5" />
            {t('form.personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClasses}>
                <User className="w-4 h-4 text-orange-400" />
                {t('form.firstName')}
              </Label>
              <Input
                value={data.firstName || ''}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder={t('form.firstName')}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClasses}>
                <User className="w-4 h-4 text-orange-400" />
                {t('form.lastName')}
              </Label>
              <Input
                value={data.lastName || ''}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder={t('form.lastName')}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClasses}>
                <Briefcase className="w-4 h-4 text-orange-400" />
                {t('form.jobTitle')}
              </Label>
              <Input
                value={data.jobTitle || ''}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                placeholder={t('form.jobTitle')}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClasses}>
                <Briefcase className="w-4 h-4 text-orange-400" />
                {t('form.company')}
              </Label>
              <Input
                value={data.company || ''}
                onChange={(e) => updateField('company', e.target.value)}
                placeholder={t('form.company')}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClasses}>
                <Mail className="w-4 h-4 text-orange-400" />
                {t('form.email')}
              </Label>
              <Input
                type="email"
                value={data.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="example@email.com"
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClasses}>
                <Phone className="w-4 h-4 text-orange-400" />
                {t('form.phone')}
              </Label>
              <Input
                value={data.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1234567890"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={labelClasses}>
                <Smartphone className="w-4 h-4 text-orange-400" />
                {t('form.mobile')}
              </Label>
              <Input
                value={data.mobile || ''}
                onChange={(e) => updateField('mobile', e.target.value)}
                placeholder="+1234567890"
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClasses}>
                <Globe className="w-4 h-4 text-orange-400" />
                {t('form.website')}
              </Label>
              <Input
                value={data.website || ''}
                onChange={(e) => updateField('website', e.target.value)}
                placeholder="https://example.com"
                className={inputClasses}
              />
            </div>
          </div>

          <Separator className="bg-orange-500/20" />

          <div className="space-y-2">
            <Label className={labelClasses}>
              <MapPin className="w-4 h-4 text-orange-400" />
              {t('form.address')}
            </Label>
            <Textarea
              value={data.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder={t('form.address')}
              className={inputClasses}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className={labelClasses}>{t('form.city')}</Label>
              <Input
                value={data.city || ''}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder={t('form.city')}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClasses}>{t('form.country')}</Label>
              <Input
                value={data.country || ''}
                onChange={(e) => updateField('country', e.target.value)}
                placeholder={t('form.country')}
                className={inputClasses}
              />
            </div>
            <div className="space-y-2">
              <Label className={labelClasses}>{t('form.postalCode')}</Label>
              <Input
                value={data.postalCode || ''}
                onChange={(e) => updateField('postalCode', e.target.value)}
                placeholder={t('form.postalCode')}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className={labelClasses}>
              <MessageSquare className="w-4 h-4 text-orange-400" />
              {t('form.note')}
            </Label>
            <Textarea
              value={data.note || ''}
              onChange={(e) => updateField('note', e.target.value)}
              placeholder={t('form.note')}
              className={inputClasses}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="bg-[#16213e]/80 border-orange-500/20 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-400 flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5" />
            {t('social.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialKeys.map((key) => (
              <div key={key} className="space-y-2">
                <Label className={labelClasses}>
                  <span className="text-orange-400">{socialIcons[key]}</span>
                  {t(`social.${key}`)}
                </Label>
                <Input
                  value={data.social?.[key] || ''}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  placeholder={`https://${key}.com/...`}
                  className={inputClasses}
                />
              </div>
            ))}
          </div>

          {/* Custom Fields */}
          {data.customFields && data.customFields.length > 0 && (
            <>
              <Separator className="bg-orange-500/20" />
              <div className="space-y-4">
                {data.customFields.map((field) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                    <div className="space-y-2">
                      <Label className={labelClasses}>{t('social.custom')} - {t('form.fullName')}</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                        placeholder={t('form.fullName')}
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={labelClasses}>{t('social.custom')} - URL</Label>
                      <Input
                        value={field.value}
                        onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                        placeholder="https://..."
                        className={inputClasses}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeCustomField(field.id)}
                      className="mb-0.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          <Button
            variant="outline"
            onClick={addCustomField}
            className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('social.addMore')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
