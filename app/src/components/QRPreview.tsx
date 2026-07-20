import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, Check, ScanLine } from 'lucide-react';
import { generateVCardData } from '@/lib/vcard';
import { downloadAsPNG, downloadAsPDF } from '@/lib/download';
import type { QRData } from '@/types/qr';

interface QRPreviewProps {
  data: QRData;
}

export function QRPreview({ data }: QRPreviewProps) {
  const { t } = useTranslation();
  const qrRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState([256]);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [copied, setCopied] = useState(false);

  const vCardData = generateVCardData(data);
  const hasData = vCardData.length > 100;

  const handleDownloadPNG = async () => {
    if (qrRef.current) {
      await downloadAsPNG(qrRef.current, 'qr-code');
    }
  };

  const handleDownloadPDF = async () => {
    if (qrRef.current) {
      await downloadAsPDF(qrRef.current, 'qr-code', data);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(vCardData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = vCardData;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#16213e]/80 border-orange-500/20 shadow-xl sticky top-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-400 flex items-center gap-2 text-lg">
            <ScanLine className="w-5 h-5" />
            {t('qr.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Preview */}
          <div className="flex flex-col items-center space-y-4">
            <div
              ref={qrRef}
              className="bg-white p-6 rounded-xl shadow-lg"
              style={{ direction: 'ltr' }}
            >
              {hasData ? (
                <QRCodeSVG
                  value={vCardData}
                  size={size[0]}
                  level={level}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  includeMargin={true}
                />
              ) : (
                <div
                  className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg"
                  style={{ width: size[0], height: size[0] }}
                >
                  <p className="text-gray-400 text-center text-sm px-4">
                    {t('messages.fillRequired')}
                  </p>
                </div>
              )}
              {hasData && (
                <p className="text-center text-gray-600 text-sm mt-3 font-medium">
                  {t('qr.scanMe')}
                </p>
              )}
            </div>
          </div>

          {/* Size Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-gray-300">{t('qr.size')}</Label>
              <span className="text-orange-400 text-sm font-medium">{size[0]}px</span>
            </div>
            <Slider
              value={size}
              onValueChange={setSize}
              min={128}
              max={512}
              step={8}
              className="w-full"
            />
          </div>

          {/* Color Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">{t('qr.color')}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-orange-500/30 cursor-pointer"
                />
                <span className="text-gray-400 text-sm">{fgColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">{t('qr.bgColor')}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-orange-500/30 cursor-pointer"
                />
                <span className="text-gray-400 text-sm">{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Error Correction */}
          <div className="space-y-2">
            <Label className="text-gray-300">{t('qr.errorCorrection')}</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as 'L' | 'M' | 'Q' | 'H')}>
              <SelectTrigger className="bg-[#1a1a2e]/50 border-orange-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#16213e] border-orange-500/20">
                <SelectItem value="L" className="text-white hover:bg-orange-500/10">
                  {t('qr.low')} (7%)
                </SelectItem>
                <SelectItem value="M" className="text-white hover:bg-orange-500/10">
                  {t('qr.medium')} (15%)
                </SelectItem>
                <SelectItem value="Q" className="text-white hover:bg-orange-500/10">
                  {t('qr.quartile')} (25%)
                </SelectItem>
                <SelectItem value="H" className="text-white hover:bg-orange-500/10">
                  {t('qr.high')} (30%)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleDownloadPNG}
              disabled={!hasData}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('qr.downloadPng')}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={!hasData}
              variant="outline"
              className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('qr.downloadPdf')}
            </Button>
            <Button
              onClick={handleCopy}
              disabled={!hasData}
              variant="outline"
              className="w-full border-gray-500/30 text-gray-300 hover:bg-gray-500/10"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-green-400">{t('buttons.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('buttons.copy')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
