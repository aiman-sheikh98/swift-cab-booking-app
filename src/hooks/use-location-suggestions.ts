
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useLocationSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = async (input: string, type: 'pickup' | 'dropoff') => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('suggest-locations', {
        body: { input, type },
      });

      if (error) throw error;
      return data.suggestion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get suggestion');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getSuggestion,
    isLoading,
    error,
  };
};
