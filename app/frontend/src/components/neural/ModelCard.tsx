import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Scale, Check, Brain, Globe, Cpu, Network, ScanText, ImageIcon } from "lucide-react";
import { cn } from '@/library/utils';
import { NeuralModel } from '@/types/neural'
import { useToast } from "@/hooks/use-toast";

interface ModelCardProps {
  model: NeuralModel;
  className?: string;
}

const StatBlock = ({ label, value, highlight = false, truncate = false }: { label: string, value: any, highlight?: boolean, truncate?: boolean }) => (
  <div>
    <p className="text-muted-foreground text-[10px] uppercase tracking-wider font-medium mb-1">{label}</p>
    <p className={cn("font-medium text-sm", highlight && "text-primary font-bold", truncate && "truncate")} title={truncate ? String(value || '') : undefined}>
      {value && value !== '—' && value !== '-' ? String(value) : 'N/A'}
    </p>
  </div>
);

const ModelCard: React.FC<ModelCardProps> = ({ model, className }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isComparing, setIsComparing] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('comparison_models') || '[]');
    return saved.includes(model.id);
  });

  const toggleCompare = () => {
    const saved = JSON.parse(localStorage.getItem('comparison_models') || '[]');
    if (isComparing) {
      const next = saved.filter((id: string) => id !== model.id);
      localStorage.setItem('comparison_models', JSON.stringify(next));
      setIsComparing(false);
      toast({ title: "Удалено из сравнения" });
    } else {
      const next = [...saved, model.id];
      localStorage.setItem('comparison_models', JSON.stringify(next));
      setIsComparing(true);
      toast({ title: "Добавлено к сравнению" });
    }
  };

  const getFormattedLink = (link?: string) => {
    if (!link) return "";
    const trimmed = link.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    if (trimmed.includes(" ")) return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
    if (trimmed.includes("/") && !trimmed.includes(" ")) return `https://huggingface.co/${trimmed}`;
    return `https://${trimmed}`;
  };

  const cleanFormat = (val?: string | number) => {
    if (!val) return 'N/A';
    return String(val).replace(/\.0$/, '');
  };

  const handleSource = () => {
    const formattedUrl = getFormattedLink(model.link);
    if (formattedUrl) window.open(formattedUrl, '_blank');
    else toast({ variant: "destructive", title: "Ссылка недоступна" });
  };

  const handleDetails = () => navigate(`/models/${model.id}`);

  const getTypeConfig = (type?: string) => {
    switch (type) {
      case 'LLM': return { icon: <Brain className="w-3 h-3 mr-1" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" };
      case 'OCR': return { icon: <ScanText className="w-3 h-3 mr-1" />, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
      case 'VL': return { icon: <ImageIcon className="w-3 h-3 mr-1" />, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" };
      default: return { icon: <Network className="w-3 h-3 mr-1" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    }
  };
  const typeConfig = getTypeConfig(model.type);

  return (
    <Card className={cn("overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow hover:border-primary/40", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge variant="secondary" className={cn("flex items-center text-[10px] py-0 px-2 border-none", typeConfig.color)}>
            {typeConfig.icon} {model.type || 'Embedding'}
          </Badge>
          {model.country && model.country !== 'N/A' && (
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-muted-foreground">
              <Globe className="h-3 w-3 mr-1 inline" /> {model.country}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl leading-tight font-bold line-clamp-1" title={model.name}>{model.name}</CardTitle>
        <CardDescription className="text-xs font-semibold text-primary/80 flex items-center gap-1 mt-1">
          <Cpu className="w-3 h-3" /> {model.family || "Неизвестный разработчик"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow flex flex-col">
        <div className="mb-4 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-2">{model.description || 'Описание отсутствует'}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-3 bg-muted/20 p-3 rounded-lg border border-border/50">
          {model.type === 'LLM' && (
            <>
              <StatBlock label="Параметры" value={model.parameterCount} highlight />
              <StatBlock label="Контекст" value={model.contextWindow} />
              <StatBlock label="Рейтинг Elo" value={model.rating} />
              <StatBlock label="Архитектура" value={model.architecture} truncate />
            </>
          )}

          {model.type === 'OCR' && (
            <>
              <StatBlock label="NED Metric" value={model.ned} highlight />
              <StatBlock label="TEDS Metric" value={model.teds} highlight />
              <StatBlock label="Место в топе" value={model.rating} />
              <StatBlock label="Архитектура" value={model.architecture} truncate />
            </>
          )}

          {/* Блок для VL (ИСПРАВЛЕНО: только Бенчмарки, Лицензия, Контекст) */}
          {model.type === 'VL' && (
            <>
              <StatBlock label="Бенчмарки" value={model.benchmarks} highlight truncate />
              <StatBlock label="Контекст" value={model.contextWindow} />
              <StatBlock label="Лицензия" value={model.license} truncate />
              <StatBlock label="Параметры" value={model.parameterCount} highlight />

            </>
          )}

          {(!model.type || model.type === 'Embedding') && (
            <>
              <StatBlock label="MTEB Score" value={model.mtebScore} highlight />
              <StatBlock label="Размерность" value={cleanFormat(model.dimension)} />
              <StatBlock label="Контекст" value={model.contextWindow} />
              <StatBlock label="Лицензия" value={model.license} truncate />
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-3 gap-2 pt-0 pb-4 px-4">
        <Button variant="outline" size="sm" className="w-full text-xs h-9 px-0" onClick={handleDetails}>
          <BookOpen className="h-3.5 w-3.5 mr-1" /> Детали
        </Button>
        <Button 
          variant={isComparing ? "secondary" : "outline"} 
          size="sm" 
          className={cn("w-full text-xs h-9 px-0", isComparing && "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20")} 
          onClick={toggleCompare}
        >
          {isComparing ? <Check className="h-3.5 w-3.5 mr-1" /> : <Scale className="h-3.5 w-3.5 mr-1" />}
          {isComparing ? 'В сравнении' : 'Сравнить'}
        </Button>
        <Button variant="outline" size="sm" className="w-full text-xs h-9 px-0" onClick={handleSource}>
          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Source
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;