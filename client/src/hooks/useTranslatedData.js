// frontend/src/hooks/useTranslatedData.js
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useTranslatedData = (fetchFunction, dependencies = []) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Ajouter la langue à la requête
        const result = await fetchFunction(i18n.language);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [i18n.language, ...dependencies]);

  return { data, loading, error };
};