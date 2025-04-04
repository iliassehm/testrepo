import { useQuery } from "react-query";

export const useDocumentFile = (url: string, name: string) => {
  return useQuery({
    queryKey: ["documentFile", url],
    queryFn: async () => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], name, {
        type: blob.type,
      });
    },
    enabled: !!url,
  });
};
