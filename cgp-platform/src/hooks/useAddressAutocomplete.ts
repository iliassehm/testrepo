import debounce from "lodash/debounce";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";

export interface AddressSuggestion {
  id: string;
  street: string;
  postalCode: string;
  city: string;
}

async function fetchAddressSuggestions(
  query: string
): Promise<AddressSuggestion[]> {
  if (!query || query.length < 3) return [];

  const response = await fetch(
    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch address suggestions");
  }

  const data = await response.json();

  return data.features.map((feature: any) => ({
    id: feature.properties.id,
    street: feature.properties.name,
    postalCode: feature.properties.postcode,
    city: feature.properties.city,
  }));
}

export function useAddressAutocomplete() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: suggestions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["addressSuggestions", query],
    queryFn: () => fetchAddressSuggestions(query),
    enabled: query.length >= 3,
  });

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setQuery(value);
      setIsOpen(true);
    }, 300),
    []
  );

  const search = (value: string) => {
    debouncedSearch(value);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    suggestions: isOpen ? suggestions : [],
    search,
    close,
    isLoading,
    error,
  };
}
