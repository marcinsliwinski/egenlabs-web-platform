import { GenFedSeriesView } from '@/features/ham-radio/gen-fed-series-view';

export const metadata = {
  title: 'GEN-FED 40-10 | eGen Labs',
  description: 'Kompletne zestawy antenowe GEN-FED 40-10 w wariantach S i M oraz liniach µQRP, QRP, STD i HD.'
};

export default function GenFed4010Page() {
  return <GenFedSeriesView series="40-10" />;
}
