export type HamRadioProductType = 'kit' | 'un-un' | 'choke';
export type HamRadioProductLine = 'GEN-FED' | 'CMC-GEN';
export type HamRadioPowerLine = 'µQRP' | 'QRP' | 'STD' | 'HD';
export type HamRadioAvailability = 'contact';

export type HamRadioProduct = {
  sku: string;
  slug: string;
  name: string;
  productLine: HamRadioProductLine;
  productType: HamRadioProductType;
  series: string;
  radiatorVariant: 'S' | 'M' | null;
  powerLine: HamRadioPowerLine;
  radiatorLength: string | null;
  loadingCoil: string | null;
  counterpoiseLength: string | null;
  ununCore: string | null;
  chokeCore: string | null;
  chokeCable: string | null;
  capacitor: string | null;
  ratedPower: string;
  notes: string | null;
  availability: HamRadioAvailability;
};

export type HamRadioDocument = {
  key: 'manual' | 'technical-card';
  label: string;
  version: string;
  filename: string;
  href: string;
};
