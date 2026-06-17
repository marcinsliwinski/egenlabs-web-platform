import type { HamRadioDocument } from './product-types';

export const hamRadioDocumentVersion = 'v20';
export const hamRadioDocumentBasePath = '/downloads/ham-radio/gen-fed-cmc-gen-261/v20';

export const hamRadioPublicDocuments = [
  {
    key: 'manual',
    label: 'Instrukcja obsługi i instalacji',
    version: hamRadioDocumentVersion,
    filename: 'instrukcja-obslugi-i-instalacji-gen-fed-cmc-gen-261-pl.pdf',
    href: `${hamRadioDocumentBasePath}/instrukcja-obslugi-i-instalacji-gen-fed-cmc-gen-261-pl.pdf`
  },
  {
    key: 'technical-card',
    label: 'Karta techniczna',
    version: hamRadioDocumentVersion,
    filename: 'karta-techniczna-gen-fed-cmc-gen-261-pl.pdf',
    href: `${hamRadioDocumentBasePath}/karta-techniczna-gen-fed-cmc-gen-261-pl.pdf`
  }
] satisfies HamRadioDocument[];
