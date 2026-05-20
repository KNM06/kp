import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import ModelCard from '@/components/neural/ModelCard';
import { Search, Filter, ArrowDownAZ, ArrowUpAZ, SlidersHorizontal, X, Info, ChevronDown } from 'lucide-react';
import { useModels } from '@/hooks/useModels';
import { Loader2 } from 'lucide-react';

// Шаблон со всеми ключами, чтобы React никогда не получал undefined
const DEFAULT_FILTERS = {
  license: [], country: [], developer: [], date: [], 
  mteb: [], dimension: [], context: [],
  elo: [], parameters: [], architecture: [], hardware: [], multilingual: [],
  ned: [], teds: [], topWorld: [],
  // НОВЫЕ ФИЛЬТРЫ ДЛЯ VL
  visionEncoder: [], specialization: []
};

// Функция нормализации архитектуры (вынесена за пределы компонента для чистоты)
const normalizeArchitecture = (arch: any, type?: string) => {
  const str = String(arch || '').trim();
  if (!str || str === 'N/A' || str === '—' || str === '-') return 'unknown';

  // Упрощаем только для LLM и VL
  if (type === 'LLM' || type === 'VL') {
    const lower = str.toLowerCase();
    if (lower.includes('плотная') || lower.includes('dense')) return 'Плотная архитектура';
    if (lower.includes('разреженная') || lower.includes('moe')) return 'Разреженная архитектура';
  }
  return str; // Для остальных возвращаем как есть (например, OCR)
};

const ModelLibrary = () => {
  const { models: sampleModels, isLoading, error } = useModels();
  
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('lib_search') || '');
  const [sortBy, setSortBy] = useState(() => localStorage.getItem('lib_sort') || 'newest');
  const [filterType, setFilterType] = useState(() => localStorage.getItem('lib_type') || 'all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<string[]>(() => {
    const saved = localStorage.getItem('lib_expanded');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('lib_advanced');
    if (saved) {
      return { ...DEFAULT_FILTERS, ...JSON.parse(saved) };
    }
    return DEFAULT_FILTERS;
  });

  useEffect(() => {
    localStorage.setItem('lib_search', searchTerm);
    localStorage.setItem('lib_sort', sortBy);
    localStorage.setItem('lib_type', filterType);
    localStorage.setItem('lib_expanded', JSON.stringify(expandedFilters));
    localStorage.setItem('lib_advanced', JSON.stringify(advancedFilters));
  }, [searchTerm, sortBy, filterType, expandedFilters, advancedFilters]);

  // --- УТИЛИТЫ ---
  const extractNumbersList = (val: any): number[] => {
    if (!val) return [];
    const matches = String(val).match(/\d+(\.\d+)?/g);
    if (!matches) return [];
    return matches.map(n => parseFloat(n));
  };

  const parseMaxNum = (val: any): number => {
    const nums = extractNumbersList(val);
    return nums.length > 0 ? Math.max(...nums) : 0;
  };

  const parseNumForFilters = (val: any): number => {
    const str = String(val || '').toLowerCase().replace(/\s/g, '');
    if (!val || str === '-' || str === 'н/д' || str === '—' || str.includes('n/a')) return -1;
    const normalizedStr = str.replace(',', '.');
    const num = parseFloat(normalizedStr.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return -1;
    if (normalizedStr.includes('k')) return num * 1000;
    if (normalizedStr.includes('m')) return num * 1000000;
    if (normalizedStr.includes('b') || normalizedStr.includes('t')) return num * 1000000000;
    return num;
  };

  const extractRank = (text: string) => {
    const clean = String(text || '').replace(/\s/g, '');
    if (/^\d+$/.test(clean)) return parseInt(clean); 
    const match = clean.match(/(?:top|топ|#)?(\d+)/i);
    return match ? parseInt(match[1]) : Infinity;
  };

  // --- ДИНАМИЧЕСКОЕ ИЗВЛЕЧЕНИЕ ДАННЫХ ---
  const typeFilteredModels = useMemo(() => {
    return sampleModels.filter(m => filterType === 'all' || (m.type || 'Embedding') === filterType);
  }, [sampleModels, filterType]);

  const getExactValues = (field: string) => {
    const vals = new Set<string>();
    typeFilteredModels.forEach(m => {
      const v = m[field as keyof typeof m];
      if (v && v !== 'N/A' && v !== '—' && v !== '-' && String(v).trim() !== '') {
        vals.add(String(v).trim());
      }
    });
    return Array.from(vals).sort();
  };

  const mapLicense = (lic: any) => {
    const t = String(lic || '').toLowerCase();
    if (!t || t === 'n/a' || t === '—' || t === '-') return null;
    if (t.includes('проприетарная') || t.includes('closed') || t.includes('baidu') || t.includes('api')) return 'Проприетарная';
    return 'Открытая';
  };

  const uniqueDevelopers = getExactValues('family');
  const uniqueCountries = getExactValues('country');
  const uniqueContexts = getExactValues('contextWindow');
  const uniqueHardware = getExactValues('hardwareRequirements');
  const uniqueParameters = getExactValues('parameterCount');
  const uniqueMteb = getExactValues('mtebScore');
  const uniqueNed = getExactValues('ned');
  const uniqueTeds = getExactValues('teds');
  const uniqueVisionEncoders = getExactValues('visionEncoder');
  const uniqueSpecializations = getExactValues('applicationSpecifics');

  // НОВОЕ: Собираем уникальные архитектуры через нормализатор
  const uniqueArchitectures = useMemo(() => {
    const s = new Set<string>();
    typeFilteredModels.forEach(m => {
      const val = normalizeArchitecture(m.architecture, m.type);
      if (val !== 'unknown') s.add(val);
    });
    return Array.from(s).sort();
  }, [typeFilteredModels]);

  const uniqueLicenses = useMemo(() => {
    const s = new Set<string>();
    typeFilteredModels.forEach(m => {
      const l = mapLicense(m.license);
      if (l) s.add(l);
    });
    return Array.from(s).sort();
  }, [typeFilteredModels]);

  const uniqueYears = useMemo(() => {
    const s = new Set<string>();
    typeFilteredModels.forEach(m => {
      const match = String(m.releaseDate || '').match(/\d{4}/);
      if (match) s.add(match[0]);
    });
    return Array.from(s).sort((a,b) => Number(b) - Number(a));
  }, [typeFilteredModels]);

  const uniqueMultilingual = useMemo(() => {
    const s = new Set<string>();
    typeFilteredModels.forEach(m => {
      const v = m.multilingual || m.languages;
      if (v && v !== 'N/A' && v !== '—' && v !== '-') s.add(String(v).trim());
    });
    return Array.from(s).sort();
  }, [typeFilteredModels]);

  const uniqueDimensions = useMemo(() => {
    const s = new Set<string>();
    typeFilteredModels.forEach(m => {
      if (m.dimension && m.dimension !== 'N/A') {
        const matches = String(m.dimension).match(/\d+(\.\d+)?/g);
        if (matches) matches.forEach(num => s.add(num));
      }
    });
    return Array.from(s).sort((a,b) => Number(a) - Number(b));
  }, [typeFilteredModels]);

  const uniqueElo = useMemo(() => {
    const s = new Set<string>();
    typeFilteredModels.filter(m => m.type === 'LLM').forEach(m => {
       if (m.rating && m.rating !== 'N/A' && m.rating !== '—') s.add(String(m.rating).trim());
    });
    return Array.from(s).sort();
  }, [typeFilteredModels]);

  const uniqueTopWorld = useMemo(() => {
    const s = new Set<string>();
    typeFilteredModels.filter(m => m.type === 'OCR').forEach(m => {
       if (m.rating && m.rating !== 'N/A' && m.rating !== '—') s.add(String(m.rating).trim());
    });
    return Array.from(s).sort((a,b) => Number(a) - Number(b));
  }, [typeFilteredModels]);

  // --- ПАРСЕРЫ ---
  const parsers: Record<string, (m: any) => string | string[]> = {
    license: (m) => mapLicense(m.license) || 'unknown',
    country: (m) => String(m.country || '').trim(),
    developer: (m) => String(m.family || '').trim(),
    date: (m) => {
      const match = String(m.releaseDate || '').match(/\d{4}/);
      return match ? match[0] : 'unknown';
    },
    // ИСПРАВЛЕНО: Парсер архитектуры теперь использует нормализатор
    architecture: (m) => normalizeArchitecture(m.architecture, m.type),
    context: (m) => String(m.contextWindow || '').trim(),
    multilingual: (m) => String(m.multilingual || m.languages || '').trim(),
    hardware: (m) => String(m.hardwareRequirements || '').trim(),
    parameters: (m) => String(m.parameterCount || '').trim(),
    dimension: (m) => {
      const matches = String(m.dimension || '').match(/\d+(\.\d+)?/g);
      return matches ? matches : ['unknown'];
    },
    mteb: (m) => String(m.mtebScore || '').trim(),
    elo: (m) => String(m.rating || '').trim(),
    topWorld: (m) => String(m.rating || '').trim(),
    ned: (m) => String(m.ned || '').trim(),
    teds: (m) => String(m.teds || '').trim(),
    visionEncoder: (m) => String(m.visionEncoder || '').trim(),
    specialization: (m) => String(m.applicationSpecifics || '').trim()
  };

  // --- КОНФИГУРАЦИЯ ФИЛЬТРОВ ---
  const allFiltersConfig = useMemo(() => [
    { id: 'developer', types: ['all', 'Embedding', 'LLM', 'OCR', 'VL'], title: 'Разработчик / Команда', options: uniqueDevelopers.map(v => ({val: v, label: v})) },
    { id: 'country', types: ['all', 'Embedding', 'LLM', 'OCR', 'VL'], title: 'Страна производства', options: uniqueCountries.map(v => ({val: v, label: v})) },
    { id: 'date', types: ['all', 'Embedding', 'LLM', 'OCR', 'VL'], title: 'Год выхода', options: uniqueYears.map(v => ({val: v, label: `${v} год`})) },
    { id: 'license', types: ['all', 'Embedding', 'LLM', 'OCR', 'VL'], title: 'Тип лицензии', options: uniqueLicenses.map(v => ({val: v, label: v})) },
    
    { id: 'architecture', types: ['LLM', 'OCR', 'VL'], title: 'Архитектура', options: uniqueArchitectures.map(v => ({val: v, label: v})) },
    { id: 'context', types: ['Embedding', 'LLM', 'VL'], title: 'Окно контекста', options: uniqueContexts.map(v => ({val: v, label: v})) },
    { id: 'multilingual', types: ['Embedding', 'LLM'], title: 'Мультиязычность', options: uniqueMultilingual.map(v => ({val: v, label: v})) },
    { id: 'hardware', types: ['Embedding', 'LLM'], title: 'Требования к железу', options: uniqueHardware.map(v => ({val: v, label: v})) },
    { id: 'parameters', types: ['LLM', 'OCR', 'VL'], title: 'Размер (Параметры)', options: uniqueParameters.map(v => ({val: v, label: v})) },
    
    { id: 'mteb', types: ['Embedding'], title: 'Точность (MTEB Score)', options: uniqueMteb.map(v => ({val: v, label: v})) },
    { id: 'dimension', types: ['Embedding'], title: 'Размерность вектора', options: uniqueDimensions.map(v => ({val: v, label: v})) },
    
    { id: 'elo', types: ['LLM'], title: 'Рейтинг LMArena (Elo)', options: uniqueElo.map(v => ({val: v, label: v})) },

    { id: 'topWorld', types: ['OCR'], title: 'Место в рейтинге', options: uniqueTopWorld.map(v => ({val: v, label: `#${v}`})) },
    { id: 'ned', types: ['OCR'], title: 'NED (Ниже = Лучше)', options: uniqueNed.map(v => ({val: v, label: v})) },
    { id: 'teds', types: ['OCR'], title: 'TEDS (Выше = Лучше)', options: uniqueTeds.map(v => ({val: v, label: v})) },

    // НОВЫЕ ФИЛЬТРЫ ДЛЯ VL
    { id: 'visionEncoder', types: ['VL'], title: 'Визуальный энкодер', options: uniqueVisionEncoders.map(v => ({val: v, label: v})) },
    { id: 'specialization', types: ['VL'], title: 'Специфика применения', options: uniqueSpecializations.map(v => ({val: v, label: v})) }

  ].filter(cat => cat.options.length > 0), 
  [uniqueDevelopers, uniqueCountries, uniqueYears, uniqueLicenses, uniqueArchitectures, uniqueContexts, uniqueMultilingual, uniqueHardware, uniqueParameters, uniqueMteb, uniqueDimensions, uniqueElo, uniqueTopWorld, uniqueNed, uniqueTeds, uniqueVisionEncoders, uniqueSpecializations]);

  const visibleFilterConfig = useMemo(() => {
    return allFiltersConfig.filter(cat => cat.types.includes(filterType));
  }, [allFiltersConfig, filterType]);

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const modelMatchesFilters = (model: any, filtersObj: Record<string, string[]>, skipCategory: string | null = null) => {
    for (const key of Object.keys(filtersObj)) {
      if (key === skipCategory) continue; 
      
      const config = allFiltersConfig.find(c => c.id === key);
      if (config && !config.types.includes('all') && !config.types.includes(model.type || 'Embedding')) continue;

      const activeValues = filtersObj[key];
      if (activeValues && activeValues.length > 0) {
        const parser = parsers[key];
        if (!parser) continue;
        
        const modelVal = parser(model);
        if (Array.isArray(modelVal)) {
          if (!modelVal.some(v => activeValues.includes(v))) return false;
        } else {
          if (!activeValues.includes(modelVal as string)) return false;
        }
      }
    }
    return true;
  };

  const availableOptionsCache = useMemo(() => {
    const cache: Record<string, Set<string>> = {};
    const baseFiltered = sampleModels.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (m.family && m.family.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || (m.type || 'Embedding') === filterType;
      return matchesSearch && matchesType;
    });

    for (const cat of allFiltersConfig) {
      const key = cat.id;
      const validForThisKey = new Set<string>();
      baseFiltered.forEach(m => {
        if (modelMatchesFilters(m, advancedFilters, key)) {
          const parser = parsers[key];
          if (!parser) return;
          const vals = parser(m);
          if (Array.isArray(vals)) {
            vals.forEach(v => validForThisKey.add(v));
          } else {
            validForThisKey.add(vals as string);
          }
        }
      });
      cache[key] = validForThisKey;
    }
    return cache;
  }, [advancedFilters, searchTerm, filterType, sampleModels, allFiltersConfig]);

  const filteredModels = sampleModels
    .filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (model.family && model.family.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || (model.type || 'Embedding') === filterType;
      return matchesSearch && matchesType && modelMatchesFilters(model, advancedFilters);
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest': return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case 'oldest': return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

  const toggleAccordion = (id: string) => {
    setExpandedFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleAdvancedFilter = (category: string, value: string) => {
    setAdvancedFilters(prev => {
      const catArray = prev[category] || [];
      return {
        ...prev,
        [category]: catArray.includes(value) 
          ? catArray.filter(v => v !== value) 
          : [...catArray, value]
      };
    });
  };

  const clearAdvancedFilters = () => setAdvancedFilters(DEFAULT_FILTERS);

  const activeFiltersCount = visibleFilterConfig.reduce((acc, cat) => acc + (advancedFilters[cat.id]?.length || 0), 0);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6 relative">
        
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm min-h-[60vh] rounded-lg">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Загрузка моделей из базы данных...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 rounded-r-lg">
            <h3 className="text-destructive font-bold">Ошибка соединения</h3>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Библиотека моделей</h1>
          <p className="text-muted-foreground">Готовые и предобученные нейронные сети для различных задач</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Поиск моделей..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFiltersCount > 0 ? "secondary" : "outline"} 
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Параметры
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-1 h-5 px-1.5 text-xs bg-primary">{activeFiltersCount}</Badge>
              )}
            </Button>

            <div className="w-[180px]">
              <Select value={filterType} onValueChange={(val) => { setFilterType(val); clearAdvancedFilters(); }}>
                <SelectTrigger className="w-full"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Тип сети" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="Embedding">Embedding</SelectItem>
                  <SelectItem value="LLM">LLM</SelectItem>
                  <SelectItem value="OCR">OCR</SelectItem>
                  <SelectItem value="VL">VL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-[180px]">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">{sortBy.includes('asc') ? <ArrowUpAZ className="h-4 w-4 mr-2" /> : <ArrowDownAZ className="h-4 w-4 mr-2" />}<SelectValue placeholder="Сортировка" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Сначала новые</SelectItem>
                  <SelectItem value="oldest">Сначала старые</SelectItem>
                  <SelectItem value="name-asc">По имени (А-Я)</SelectItem>
                  <SelectItem value="name-desc">По имени (Я-А)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map(model => <ModelCard key={model.id} model={model} />)}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-card border-dashed">
            <div className="inline-block p-3 rounded-full bg-muted mb-4"><Search className="h-6 w-6 text-muted-foreground" /></div>
            <h3 className="text-lg font-medium mb-2">Модели не найдены</h3>
            <p className="text-muted-foreground mb-4">Попробуйте изменить параметры поиска или сбросить фильтры</p>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterType('all'); setSortBy('newest'); clearAdvancedFilters(); }}>
              Сбросить все фильтры
            </Button>
          </div>
        )}

      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border shadow-xl rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Расширенные критерии поиска
              </h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsFilterModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-5 overflow-y-auto flex-grow custom-scrollbar space-y-3">
              {visibleFilterConfig.map(cat => {
                const isExpanded = expandedFilters.includes(cat.id);
                const activeCount = advancedFilters[cat.id]?.length || 0;

                return (
                  <div key={cat.id} className="border rounded-lg overflow-hidden transition-all duration-200">
                    <div 
                      onClick={() => toggleAccordion(cat.id)} 
                      className={`w-full flex items-center justify-between p-4 cursor-pointer transition-colors ${isExpanded ? 'bg-muted/30' : 'bg-card hover:bg-muted/10'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm tracking-wide uppercase">{cat.title}</span>
                        {activeCount > 0 && <Badge variant="secondary" className="h-5 bg-primary/10 text-primary">{activeCount}</Badge>}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div 
                          title={cat.tooltip} 
                          className="cursor-help p-1 hover:bg-muted rounded-full transition-colors"
                          onClick={(e) => e.stopPropagation()} 
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] border-t opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-4 bg-muted/5 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[300px] custom-scrollbar">
                        {cat.options.map(opt => {
                          const isAvailable = availableOptionsCache[cat.id]?.has(opt.val) || false;
                          const isChecked = advancedFilters[cat.id]?.includes(opt.val) || false;
                          const isDisabled = !isAvailable && !isChecked;

                          return (
                            <label key={opt.val} className={`flex items-center gap-3 transition-opacity duration-200 ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'}`}>
                              <input 
                                type="checkbox" 
                                className={`w-4 h-4 rounded border-gray-400 ${isDisabled ? 'grayscale' : 'accent-primary'}`}
                                disabled={isDisabled}
                                checked={isChecked} 
                                onChange={() => toggleAdvancedFilter(cat.id, opt.val)} 
                              />
                              <span className={isDisabled ? 'line-through decoration-muted-foreground/50' : 'group-hover:text-primary transition-colors'}>
                                {opt.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {visibleFilterConfig.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                  Для данного типа моделей нет дополнительных параметров.
                </div>
              )}
            </div>

            <div className="p-5 border-t bg-muted/20 flex gap-3">
              <Button variant="outline" className="w-1/3" onClick={clearAdvancedFilters} disabled={activeFiltersCount === 0}>
                Очистить
              </Button>
              <Button className="w-2/3 font-semibold" onClick={() => setIsFilterModalOpen(false)}>
                Показать ({filteredModels.length})
              </Button>
            </div>

          </div>
        </div>
      )}

    </MainLayout>
  );
};

export default ModelLibrary;