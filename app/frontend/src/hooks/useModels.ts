import { useState, useEffect } from 'react';
import { NeuralModel } from '@/types/neural'; // Проверь правильность пути к типам

export const useModels = () => {
  const [models, setModels] = useState<NeuralModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/api/knowledge/models');        
        if (!response.ok) {
          throw new Error('Ошибка при загрузке моделей с сервера');
        }
        
        const data = await response.json();

        const formattedData = data.map((item: any) => ({
          ...item,
          createdAt: item.releaseDate ? new Date(item.releaseDate) : new Date(),
          downloads: item.downloads || 1000,
        }));

        setModels(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, []);

  return { models, isLoading, error };
};