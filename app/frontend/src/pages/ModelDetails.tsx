import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useModel } from '@/hooks/useModel';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, ExternalLink, Share2, Star, Cpu, Globe, Calendar, 
  Database, Trophy, Scale, Check, Brain, ScanText, Network, 
  Activity, FileText, Code2, Building2, Image as ImageIcon, Layers, Wallet, Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ModelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { model, isLoading, error } = useModel(id);
  const { toast } = useToast();
  
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('comparison_models') || '[]');
    setIsComparing(saved.includes(id));
  }, [id]);

  const toggleCompare = () => {
    const saved = JSON.parse(localStorage.getItem('comparison_models') || '[]');
    if (isComparing) {
      const next = saved.filter((savedId: string) => savedId !== id);
      localStorage.setItem('comparison_models', JSON.stringify(next));
      setIsComparing(false);
      toast({ title: "Удалено из сравнения" });
    } else {
      const next = [...saved, id];
      localStorage.setItem('comparison_models', JSON.stringify(next));
      setIsComparing(true);
      toast({ title: "Добавлено к сравнению", description: "Перейдите во вкладку сравнения." });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center flex-col">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Загрузка информации о модели...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !model) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Модель не найдена</h2>
          <p className="text-muted-foreground">Возможно, она была удалена или ID указан неверно.</p>
          <Button onClick={() => navigate('/models')}>Вернуться в библиотеку</Button>
        </div>
      </MainLayout>
    );
  }

  // Вспомогательные функции
  const getFormattedLink = (link?: string) => {
    if (!link || link === '—') return "";
    const trimmed = link.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    if (trimmed.includes(" ")) return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    if (trimmed.includes("/") && !trimmed.includes(" ")) return `https://huggingface.co/${trimmed}`;
    return `https://${trimmed}`;
  };

  const cleanFormat = (val?: string | number) => {
    if (!val || val === '—') return 'N/A';
    return String(val).replace(/ 00:00:00$/, '').replace(/\.0$/, '');
  };

  const formatReleaseDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'н/д' || dateStr === '-') return "Неизвестно";
    let clean = dateStr.split(' 00:00:00')[0].trim();
    clean = clean.replace(/^\d+\s+/, ''); 
    return clean;
  };

  const getLicenseVariant = (license?: string) => {
    if (!license) return "outline";
    const lower = license.toLowerCase();
    if (lower.includes("apache") || lower.includes("mit") || lower.includes("open") || lower.includes("gemma")) return "default";
    if (lower.includes("проприетарная") || lower.includes("closed") || lower.includes("api")) return "destructive";
    return "secondary";
  };

  const getTypeConfig = (type?: string) => {
    switch (type) {
      case 'LLM': return { icon: <Brain className="w-4 h-4 mr-1.5" />, color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400" };
      case 'OCR': return { icon: <ScanText className="w-4 h-4 mr-1.5" />, color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" };
      case 'VL': return { icon: <ImageIcon className="w-4 h-4 mr-1.5" />, color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400" };
      default: return { icon: <Network className="w-4 h-4 mr-1.5" />, color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400" }; // Embedding
    }
  };

  const handleShare = () => {
    const formattedUrl = getFormattedLink(model.link);
    if (formattedUrl) {
      navigator.clipboard.writeText(formattedUrl);
      toast({ title: "Ссылка скопирована", description: `Внешняя ссылка на ${model.name} скопирована в буфер.` });
    } else {
      toast({ variant: "destructive", title: "Ошибка", description: "Для данной модели нет внешней ссылки." });
    }
  };

  const typeConfig = getTypeConfig(model.type);
  const formattedUrl = getFormattedLink(model.link);

  return (
    <MainLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-5xl">
        
        {/* Шапка с навигацией */}
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" className="pl-0 hover:bg-transparent text-muted-foreground" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Назад
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant={isComparing ? "secondary" : "outline"} size="sm" onClick={toggleCompare} className={isComparing ? "bg-primary/10 text-primary border-primary/20" : ""}>
              {isComparing ? <Check className="h-4 w-4 mr-2" /> : <Scale className="h-4 w-4 mr-2" />}
              {isComparing ? 'В сравнении' : 'Сравнить'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Поделиться
            </Button>
            {formattedUrl && (
              <Button size="sm" onClick={() => window.open(formattedUrl, '_blank')}>
                <ExternalLink className="h-4 w-4 mr-2" /> Источник
              </Button>
            )}
          </div>
        </div>

        {/* Заголовок модели */}
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>
            <Badge variant="outline" className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${typeConfig.color}`}>
              {typeConfig.icon} {model.type || 'Embedding'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-2 mb-3">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">{model.family || "Неизвестный разработчик"}</span>
            {model.country && model.country !== 'N/A' && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <Globe className="w-4 h-4 ml-1" />
                <span>{model.country}</span>
              </>
            )}
          </div>
          <p className="text-lg leading-relaxed">{model.description}</p>
        </div>

        {/* Теги */}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">{tag}</Badge>
            ))}
          </div>
        )}

        {/* Основная сетка с данными */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Левая колонка - Ключевые метрики (ДИНАМИЧЕСКАЯ) */}
          <div className="md:col-span-2 space-y-6">
            
            <Card className="border-none shadow-sm bg-muted/10">
              <CardHeader>
                <CardTitle className="text-xl">Ключевые показатели</CardTitle>
              </CardHeader>
              <CardContent>
                {/* EMBEDDING МЕТРИКИ */}
                {(!model.type || model.type === 'Embedding') && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center"><Star className="h-4 w-4 mr-1.5"/> MTEB Score</p>
                      <p className="text-3xl font-bold text-primary">{model.mtebScore || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center"><Database className="h-4 w-4 mr-1.5"/> Размерность</p>
                      <p className="text-2xl font-semibold mt-1.5">{cleanFormat(model.dimension)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center"><Globe className="h-4 w-4 mr-1.5"/> Контекст</p>
                      <p className="text-2xl font-semibold mt-1.5">{cleanFormat(model.contextWindow)}</p>
                    </div>
                    <div className="sm:col-span-3 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center"><Trophy className="h-4 w-4 mr-1.5"/> Рейтинг (Мир / RU)</p>
                      <p className="text-xl font-medium">{model.rating || 'Не применимо'}</p>
                    </div>
                  </div>
                )}

                {/* LLM МЕТРИКИ */}
                {model.type === 'LLM' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center"><Trophy className="h-4 w-4 mr-1.5 text-yellow-500"/> LMArena Elo</p>
                      <p className="text-3xl font-bold text-primary">{model.rating || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center"><Code2 className="h-4 w-4 mr-1.5"/> Окно контекста</p>
                      <p className="text-2xl font-semibold mt-1.5">{cleanFormat(model.contextWindow)}</p>
                    </div>
                    <div className="col-span-2 pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-2 flex items-center"><Scale className="h-4 w-4 mr-1.5"/> Размер параметров (Всего / Активные)</p>
                      <p className="text-xl font-medium">{model.parameterCount || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {/* OCR МЕТРИКИ */}
                {model.type === 'OCR' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                      <p className="text-xs font-bold uppercase text-muted-foreground flex items-center mb-2"><Activity className="h-4 w-4 mr-1.5 text-blue-500"/> NED Metric (↓)</p>
                      <p className="text-4xl font-black text-blue-600 tracking-tighter">{model.ned || 'N/A'}</p>
                    </div>
                    <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/10">
                      <p className="text-xs font-bold uppercase text-muted-foreground flex items-center mb-2"><FileText className="h-4 w-4 mr-1.5 text-green-500"/> TEDS Metric (↑)</p>
                      <p className="text-4xl font-black text-green-600 tracking-tighter">{model.teds || 'N/A'}</p>
                    </div>
                    <div className="col-span-2 pt-4 border-t flex justify-between items-end">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Размер параметров</p>
                        <p className="text-xl font-medium">{model.parameterCount || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Глобальный рейтинг</p>
                        <p className="text-3xl font-black italic text-primary">#{model.rating || '?'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* VL МЕТРИКИ (НОВОЕ) */}
                {model.type === 'VL' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-4 border-2 rounded-xl bg-amber-500/5 border-amber-500/20">
                        <p className="text-xs font-bold uppercase text-amber-700 mb-2 flex items-center">
                          <Trophy className="h-4 w-4 mr-1.5"/> Бенчмарки
                        </p>
                        <p className="text-lg font-black text-amber-800 leading-tight">{model.benchmarks || 'N/A'}</p>
                      </div>
                      <div className="p-4 border-2 rounded-xl bg-muted/30">
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center">
                          <Cpu className="h-4 w-4 mr-1.5"/> Параметры
                        </p>
                        <p className="text-xl font-bold">{model.parameterCount || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-4 border-2 rounded-xl bg-muted/30">
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center">
                          <Code2 className="h-4 w-4 mr-1.5"/> Контекст
                        </p>
                        <p className="text-xl font-bold">{cleanFormat(model.contextWindow)}</p>
                      </div>
                      <div className="p-4 border-2 rounded-xl bg-muted/30">
                        <p className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center">
                          <Eye className="h-4 w-4 mr-1.5"/> Визуальный энкодер
                        </p>
                        <p className="text-sm font-semibold leading-tight">{model.visionEncoder || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Технические детали</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Общее для всех */}
                {model.architecture && model.architecture !== 'N/A' && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                      <Cpu className="h-4 w-4 mr-2" /> Архитектура
                    </h4>
                    <p className="leading-relaxed bg-muted/30 p-3 rounded-md">{model.architecture}</p>
                  </div>
                )}

                {/* Специфично для LLM/Embedding */}
                {model.hardwareRequirements && model.hardwareRequirements !== 'N/A' && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                      <Database className="h-4 w-4 mr-2" /> Аппаратные требования
                    </h4>
                    <p className="leading-relaxed bg-muted/30 p-3 rounded-md">{model.hardwareRequirements}</p>
                  </div>
                )}

                {/* Специфично для LLM */}
                {model.type === 'LLM' && model.benchmarks && model.benchmarks !== '—' && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                      <Activity className="h-4 w-4 mr-2" /> Основные бенчмарки
                    </h4>
                    <p className="leading-relaxed bg-muted/30 p-3 rounded-md">{model.benchmarks}</p>
                  </div>
                )}

                {/* Специфично для VL */}
                {model.type === 'VL' && model.applicationSpecifics && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center">
                      <Activity className="h-4 w-4 mr-2" /> Специфика применения
                    </h4>
                    <p className="leading-relaxed bg-muted/30 p-3 rounded-md">{model.applicationSpecifics}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Правая колонка - Метаданные */}
          <div className="space-y-6">
            <Card className="shadow-sm sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg uppercase tracking-widest text-muted-foreground text-center text-xs">Сводка</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5"/>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Дата релиза</p>
                    <p className="font-medium">{formatReleaseDate(model.releaseDate)}</p>
                  </div>
                </div>
                
                {(model.type === 'Embedding' || model.type === 'LLM') && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Поддерживаемые языки</p>
                      <p className="font-medium">{model.multilingual || 'Не указано'}</p>
                    </div>
                  </div>
                )}

                {/* НОВОЕ ДЛЯ VL - Экономика */}
                {model.type === 'VL' && model.economics && (
                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-muted-foreground mt-0.5"/>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold">Экономика</p>
                      <p className="font-medium">{model.economics}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground uppercase font-bold mb-2 text-center">Лицензия</p>
                  <Badge variant={getLicenseVariant(model.license)} className="w-full justify-center py-2 text-sm font-semibold tracking-wide">
                    {model.license || 'Не указана'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default ModelDetails;