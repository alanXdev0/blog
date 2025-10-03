import { useQuery } from '@tanstack/react-query';
import { fetchTaxonomy } from '@/lib/taxonomyApi';

export const useTaxonomy = () =>
  useQuery({
    queryKey: ['taxonomy'],
    queryFn: fetchTaxonomy,
  });
