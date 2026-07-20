import type { QRData } from '@/types/qr';

export function generateVCardData(data: QRData): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];

  // Name
  const firstName = data.firstName || '';
  const lastName = data.lastName || '';
  if (firstName || lastName) {
    lines.push(`N:${lastName};${firstName};;;`);
    lines.push(`FN:${firstName} ${lastName}`.trim());
  }

  // Job Title
  if (data.jobTitle) {
    lines.push(`TITLE:${escapeVCardValue(data.jobTitle)}`);
  }

  // Organization
  if (data.company) {
    lines.push(`ORG:${escapeVCardValue(data.company)}`);
  }

  // Email
  if (data.email) {
    lines.push(`EMAIL:${data.email}`);
  }

  // Phone
  if (data.phone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${data.phone}`);
  }

  // Mobile
  if (data.mobile) {
    lines.push(`TEL;TYPE=CELL,VOICE:${data.mobile}`);
  }

  // Fax
  if (data.fax) {
    lines.push(`TEL;TYPE=FAX:${data.fax}`);
  }

  // Website
  if (data.website) {
    lines.push(`URL:${data.website}`);
  }

  // Address
  if (data.address || data.city || data.country || data.postalCode) {
    const address = [
      '', // PO Box
      '', // Extended address
      escapeVCardValue(data.address || ''),
      escapeVCardValue(data.city || ''),
      '', // Region
      escapeVCardValue(data.postalCode || ''),
      escapeVCardValue(data.country || ''),
    ].join(';');
    lines.push(`ADR;TYPE=WORK:;;${address}`);
  }

  // Note / Bio
  if (data.note) {
    lines.push(`NOTE:${escapeVCardValue(data.note)}`);
  }

  // Social Media URLs
  if (data.social) {
    Object.entries(data.social).forEach(([platform, url]) => {
      if (url) {
        lines.push(`X-SOCIALPROFILE;TYPE=${platform}:${url}`);
        // Also add as URL for compatibility
        lines.push(`URL;TYPE=${platform}:${url}`);
      }
    });
  }

  // Custom Fields
  if (data.customFields) {
    data.customFields.forEach((field) => {
      if (field.label && field.value) {
        lines.push(`X-CUSTOM-${escapeVCardValue(field.label)}:${escapeVCardValue(field.value)}`);
        if (field.value.startsWith('http')) {
          lines.push(`URL;TYPE=${escapeVCardValue(field.label)}:${field.value}`);
        }
      }
    });
  }

  lines.push('END:VCARD');

  return lines.join('\n');
}

function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
