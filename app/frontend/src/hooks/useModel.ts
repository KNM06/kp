import { useState, useEffect } from 'react';
import { NeuralModel } from '@/types/neural';

export const useModel = (id: string | undefined) => {
  const [model, setModel] = useState<NeuralModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchModel = async () => {
      try {
        setIsLoading(true);
        // Замени URL на тот (относительный или абсолютный), который сработал у тебя в прошлый раз!
        const response = await fetch(`http://localhost:8000/api/knowledge/models/${id}`);
        
        if (!response.ok) {
          throw new Error('Модель не найдена');
        }
        
        const data = await response.json();
        const formattedData = {
          ...data,
          createdAt: data.releaseDate ? new Date(data.releaseDate) : new Date(),
          downloads: data.downloads || 1000,
        };

        setModel(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  return { model, isLoading, error };
};