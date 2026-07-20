export interface CustomSocialField {
  id: string;
  label: string;
  value: string;
}

export interface QRData {
  // Personal Info
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  note?: string;
  // Social Media
  social?: Record<string, string>;
  customFields?: CustomSocialField[];
}
