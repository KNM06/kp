import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useModels } from '@/hooks/useModels';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Trophy, PlusCircle, Trash2 } from 'lucide-react';
import { NeuralModel } from '@/types/neural';

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const parseNum = (val: any): number => {
  const str = String(val || '').toLowerCase().replace(/\s/g, '');
  if (!val || str === '-' || str === 'н/д' || str === '—' || /^(n\/a)+$/.test(str) || str === 'nan') return -1;
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return -1;
  if (str.includes('k')) return num * 1000;
  if (str.includes('m')) return num * 1000000;
  if (str.includes('b') || str.includes('t')) return num * 1000000000;
  return num;
};

const scoreMultilingual = (val: any): number => {
  const t = String(val).toLowerCase();
  if (t.includes('очень высок') || t.includes('мульти')) return 5;
  if (t.includes('высок')) return 4;
  if (t.includes('средн')) return 3;
  if (t.includes('низк')) return 2;
  return 1;
};

const scoreLicense = (val: any): number => {
  const t = String(val).toLowerCase();
  if (t.includes('apache') || t.includes('mit') || t.includes('open') || t.includes('cc-by') || t.includes('gemma')) return 2;
  return 1;
};

const scoreHardware = (val: any): number => {
  const t = String(val).toLowerCase();
  if (t.includes('cloud') || t.includes('api') || t.includes('неприменимо') || t.includes('edge')) return 100;
  if (t.includes('станция')) return 80;
  if (t.includes('сервер')) return 60;
  
  const matches = t.match(/(\d+(\.\d+)?)(?=\s*gb vram)/i);
  if (matches && matches[1]) return 50 - parseFloat(matches[1]);
  return 0;
};

const extractRank = (text: string): number => {
  const match = text.match(/(?:top|топ)[ -]?(\d+)/i);
  return match ? parseInt(match[1]) : Infinity;
};

const cleanFormat = (val?: string | number) => {
  const strVal = String(val || '').trim();
  // Мощная проверка, которая схлопнет N/AN/AN/A в нормальный N/A
  if (!val || strVal === '—' || strVal === '-' || /^(N\/A)+$/i.test(strVal.replace(/\s/g, '')) || strVal.toLowerCase() === 'nan') return 'N/A';
  return strVal.replace(/ 00:00:00$/, '').replace(/\.0$/, '');
};

const formatReleaseDate = (dateStr: string | undefined) => {
  if (!dateStr || dateStr === 'н/д' || dateStr === '-') return "N/A";
  let clean = dateStr.split(' 00:00:00')[0].trim();
  clean = clean.replace(/^\d+\s+/, '');
  return clean;
};

// --- КОНФИГУРАЦИИ СТРОК ДЛЯ КАЖДОГО ТИПА ---
const LLM_ROWS = [
  { id: 'family', label: 'Разработчик', rule: 'none' },
  { id: 'country', label: 'Страна', rule: 'none' },
  { id: 'releaseDate', label: 'Дата выхода', rule: 'none' },
  { id: 'parameterCount', label: 'Параметры', rule: 'none' },
  { id: 'architecture', label: 'Архитектура', rule: 'none' },
  { id: 'contextWindow', label: 'Контекст', rule: 'highest' },
  { id: 'rating', label: 'LMArena Elo', rule: 'highest' },
  { id: 'multilingual', label: 'Языки', rule: 'multilingual' },
  { id: 'hardwareRequirements', label: 'Требования', rule: 'hardware' },
  { id: 'benchmarks', label: 'Бенчмарки', rule: 'none' },
  { id: 'license', label: 'Лицензия', rule: 'license', type: 'badge' },
];

const EMBEDDING_ROWS = [
  { id: 'mtebScore', label: 'MTEB Score', rule: 'highest' },
  { id: 'contextWindow', label: 'Контекстное окно', rule: 'highest' },
  { id: 'dimension', label: 'Размерность', rule: 'none' },
  { id: 'rating', label: 'Топ рейтинга', rule: 'lowest-rank' },
  { id: 'hardwareRequirements', label: 'Требования (VRAM)', rule: 'hardware' },
  { id: 'multilingual', label: 'Мультиязычность', rule: 'multilingual' },
  { id: 'license', label: 'Лицензия', rule: 'license', type: 'badge' },
  { id: 'family', label: 'Разработчик', rule: 'none' },
  { id: 'releaseDate', label: 'Дата выхода', rule: 'none' },
];

const OCR_ROWS = [
  { id: 'rating', label: 'Глобальный рейтинг', rule: 'lowest' },
  { id: 'ned', label: 'NED', rule: 'lowest' },
  { id: 'teds', label: 'TEDS', rule: 'highest' },
  { id: 'architecture', label: 'Архитектура', rule: 'none' },
  { id: 'parameterCount', label: 'Размер / Параметры', rule: 'none' },
  { id: 'family', label: 'Разработчик', rule: 'none' },
  { id: 'country', label: 'Страна', rule: 'none' },
  { id: 'license', label: 'Лицензия', rule: 'license', type: 'badge' },
  { id: 'releaseDate', label: 'Дата выхода', rule: 'none' },
];

const VL_ROWS = [
  { id: 'benchmarks', label: 'Бенчмарки', rule: 'none' },
  { id: 'visionEncoder', label: 'Визуальный энкодер', rule: 'none' },
  { id: 'contextWindow', label: 'Контекст', rule: 'highest' },
  { id: 'parameterCount', label: 'Параметры', rule: 'none' },
  { id: 'economics', label: 'Экономика', rule: 'none' },
  { id: 'family', label: 'Разработчик', rule: 'none' },
  { id: 'license', label: 'Лицензия', rule: 'license', type: 'badge' },
];

const ModelComparison = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('comparison_models') || '[]');
  });

  const { models: allModels, isLoading } = useModels();

  useEffect(() => {
    localStorage.setItem('comparison_models', JSON.stringify(selectedIds));
  }, [selectedIds]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center flex-col">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Загрузка данных для сравнения...</p>
        </div>
      </MainLayout>
    );
  }

  const selectedModels = selectedIds.map(id => allModels.find(m => m.id === id)).filter(Boolean) as NeuralModel[];
  const availableModels = allModels.filter(m => !selectedIds.includes(m.id));

  const handleAddModel = (id: string) => {
    if (id && !selectedIds.includes(id)) setSelectedIds([...selectedIds, id]);
  };

  const handleRemoveModel = (id: string) => {
    setSelectedIds(selectedIds.filter(prevId => prevId !== id));
  };

  const clearAll = () => setSelectedIds([]);

  // Группируем выбранные модели по типам
  const llmModels = selectedModels.filter(m => m.type === 'LLM');
  const embeddingModels = selectedModels.filter(m => !m.type || m.type === 'Embedding');
  const ocrModels = selectedModels.filter(m => m.type === 'OCR');
  const vlModels = selectedModels.filter(m => m.type === 'VL');

  const groups = [
    { type: 'LLM', title: 'Языковые модели (LLM)', models: llmModels, rows: LLM_ROWS },
    { type: 'Embedding', title: 'Векторные модели (Embedding)', models: embeddingModels, rows: EMBEDDING_ROWS },
    { type: 'OCR', title: 'Распознавание текста (OCR)', models: ocrModels, rows: OCR_ROWS },
    { type: 'VL', title: 'Vision-Language модели (VL)', models: vlModels, rows: VL_ROWS }, 
  ].filter(g => g.models.length > 0);

  // Функция для отрисовки отдельной таблицы (группы)
  const renderTable = (group: typeof groups[0]) => {
    // 1. Вычисляем "Лучшие" значения для текущей группы
    const bests: Record<string, number> = {};
    let bestWorld = Infinity;
    let bestRU = Infinity;

    group.rows.forEach(row => {
      if (row.rule === 'none') return;
      
      if (row.rule === 'lowest-rank') {
        group.models.forEach(m => {
          const parts = String(m[row.id as keyof NeuralModel] || '').split('/');
          const wRank = extractRank(parts[0]);
          const rRank = extractRank(parts[1]);
          if (wRank < bestWorld) bestWorld = wRank;
          if (rRank < bestRU) bestRU = rRank;
        });
      } else {
        const values = group.models.map(m => {
          const val = cleanFormat(m[row.id as keyof NeuralModel]);
          if (val === 'N/A') return (row.rule === 'lowest') ? Infinity : -1;
          if (row.rule === 'hardware') return scoreHardware(val);
          if (row.rule === 'multilingual') return scoreMultilingual(val);
          if (row.rule === 'license') return scoreLicense(val);
          return parseNum(val);
        });

        const validValues = values.filter(v => v !== -1 && v !== Infinity);
        if (validValues.length > 0) {
          bests[row.id] = row.rule === 'lowest' ? Math.min(...validValues) : Math.max(...validValues);
        } else {
          bests[row.id] = row.rule === 'lowest' ? Infinity : -1;
        }
      }
    });

    // 2. Отрисовка конкретной ячейки
    const renderCell = (model: NeuralModel, row: typeof group.rows[0]) => {
      const rawValue = model[row.id as keyof NeuralModel];
      const valStr = cleanFormat(rawValue);

      // Если значение N/A, отрисовываем строгую серую заглушку без бейджей
      if (valStr === 'N/A') {
        return (
          <td key={`${model.id}-${row.id}`} className="p-4 border-b transition-colors z-10 relative bg-transparent">
            <span className="text-muted-foreground font-medium">N/A</span>
          </td>
        );
      }

      // Проверка на "Лучший" результат (зеленый цвет)
      let isBest = false;
      if (group.models.length > 1) { 
        if (row.rule === 'lowest-rank') {
          const parts = valStr.split('/');
          const wRank = extractRank(parts[0]);
          const rRank = extractRank(parts[1]);
          isBest = (wRank !== Infinity && wRank === bestWorld) || (rRank !== Infinity && rRank === bestRU);
        } else if (row.rule === 'hardware') {
          isBest = scoreHardware(valStr) === bests[row.id] && scoreHardware(valStr) > 0;
        } else if (row.rule === 'multilingual') {
          isBest = scoreMultilingual(valStr) === bests[row.id] && scoreMultilingual(valStr) > 1;
        } else if (row.rule === 'license') {
          isBest = scoreLicense(valStr) === bests[row.id] && scoreLicense(valStr) > 1;
        } else if (row.rule === 'highest' || row.rule === 'lowest') {
          isBest = parseNum(valStr) === bests[row.id] && parseNum(valStr) !== -1;
        }
      }

      const isBadge = row.type === 'badge' || row.id === 'license';
      const containerClass = isBest && !isBadge && row.id !== 'rating' ? "font-bold text-green-700 dark:text-green-400" : "font-medium text-foreground";
      
      // Кастомный рендер для сложных полей
      let content: any = valStr;
      if (row.id === 'releaseDate') content = formatReleaseDate(valStr);
      if (isBadge) content = <Badge variant={isBest ? "default" : "outline"} className={isBest ? "bg-green-600 text-white border-transparent" : ""}>{valStr}</Badge>;
      
      if (group.type === 'OCR' && row.id === 'rating') {
        content = <span className={isBest ? "font-bold text-green-700 text-lg" : "font-medium"}>#{valStr}</span>;
      }

      if (group.type === 'VL' && row.id === 'benchmarks') {
        content = <div className="font-bold text-amber-700 dark:text-amber-400">{valStr}</div>;
      }

      if (group.type === 'Embedding' && row.id === 'rating') {
        const parts = valStr.split('/');
        const wStr = parts[0] ? parts[0].trim() : '';
        const rStr = parts[1] ? parts[1].trim() : '';
        const wBest = extractRank(wStr) === bestWorld && extractRank(wStr) !== Infinity;
        const rBest = extractRank(rStr) === bestRU && extractRank(rStr) !== Infinity;
      
      

        content = (
          <div className="flex flex-col gap-1.5 font-medium">
            <div className={`flex items-center gap-1 ${wBest ? 'text-green-700 dark:text-green-400 font-bold' : ''}`}>
              <span>{wStr || 'Не прим.'}</span><span className="text-[10px] text-muted-foreground font-normal ml-1">(Мир)</span>
              {wBest && <Trophy className="w-3 h-3 ml-1" />}
            </div>
            <div className={`flex items-center gap-1 ${rBest ? 'text-green-700 dark:text-green-400 font-bold' : ''}`}>
              <span>{rStr || 'Не прим.'}</span><span className="text-[10px] text-muted-foreground font-normal ml-1">(RU)</span>
              {rBest && <Trophy className="w-3 h-3 ml-1" />}
            </div>
          </div>
        );
      }

      return (
        <td key={`${model.id}-${row.id}`} className={`p-4 border-b transition-colors z-10 relative ${isBest ? 'bg-green-500/10 dark:bg-green-500/15' : 'bg-transparent'}`}>
          <div className={`flex items-center gap-2 ${containerClass}`}>
            <div className="whitespace-pre-wrap">{content}</div>
            {isBest && !isBadge && row.id !== 'rating' && <Trophy className="w-4 h-4 text-green-600 shrink-0" />}
          </div>
        </td>
      );
    };

    return (
      <div key={group.type} className="mb-10 last:mb-0 animate-in fade-in duration-300">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          {group.title}
          <Badge variant="secondary" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">{group.models.length}</Badge>
        </h2>
        
        <div className="grid grid-cols-1 w-full">
          <div className="w-full bg-card border rounded-lg overflow-auto shadow-sm custom-scrollbar max-h-[75vh]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="shadow-sm">
                <tr>
                  <th className="p-4 border-b border-r bg-card w-[220px] min-w-[220px] sticky left-0 top-0 z-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <span className="text-muted-foreground font-medium text-xs uppercase tracking-wider">Характеристика</span>
                  </th>
                  {group.models.map(model => (
                    <th key={model.id} className="p-4 border-b min-w-[300px] w-[300px] align-top bg-card sticky top-0 z-40 border-r last:border-r-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Badge variant="outline" className="mb-2 bg-background">
                            {model.family || 'Модель'}
                          </Badge>
                          <h3 className="font-bold text-lg leading-tight text-primary mb-1">{model.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{model.description}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0" onClick={() => handleRemoveModel(model.id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 border-b border-r bg-card font-semibold text-sm text-foreground sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {row.label}
                    </td>
                    {group.models.map(model => renderCell(model, row))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="w-full p-4 md:p-6 space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Сравнение характеристик</h1>
            <p className="text-muted-foreground">Группировка и сравнение архитектур нейросетей</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedModels.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll} className="text-destructive border-destructive/20 hover:bg-destructive/10 shrink-0">
                <Trash2 className="w-4 h-4 mr-1.5" /> Очистить
              </Button>
            )}
            <Select onValueChange={handleAddModel} value="">
              <SelectTrigger className="w-full md:w-[350px]">
                <SelectValue placeholder="Добавить модель в сравнение..." />
              </SelectTrigger>
              <SelectContent>
                {availableModels.length > 0 ? (
                  availableModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <span className="text-muted-foreground mr-2 text-xs">[{model.type || 'Embedding'}]</span>
                      {model.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>Все модели добавлены</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {groups.length > 0 ? (
          <div className="space-y-2">
            {groups.map(group => renderTable(group))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Выберите модели для сравнения</h3>
            <p className="text-muted-foreground max-w-md mx-auto">Добавьте интересующие вас модели из выпадающего списка сверху. Модели разных типов будут сгруппированы в отдельные таблицы.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ModelComparison;