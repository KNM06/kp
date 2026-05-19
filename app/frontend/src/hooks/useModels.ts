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
        // Укажи здесь правильный URL твоего FastAPI сервера (обычно порт 8000)
        const response = await fetch('http://localhost:8000/api/knowledge/models');        
        if (!response.ok) {
          throw new Error('Ошибка при загрузке моделей с сервера');
        }
        
        const data = await response.json();

        // Адаптируем данные из базы под формат, который ждет фронтенд
        const formattedData = data.map((item: any) => ({
          ...item,
          // Превращаем строку с датой в настоящий Date для правильной сортировки "Сначала новые"
          createdAt: item.releaseDate ? new Date(item.releaseDate) : new Date(),
          // Парсим загрузки (пока ставим 1000 по умолчанию, если в базе 0)
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