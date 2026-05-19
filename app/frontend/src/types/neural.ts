
// Define types for neural network components

export interface NeuralNode {
  id: string;
  x: number;
  y: number;
  layer: number;
  type: 'input' | 'hidden' | 'output';
}

export interface NeuralConnection {
  source: string;
  target: string;
  weight: number;
}

export interface NeuralLayer {
  id: string;
  type: string;
  neurons: number;
  activation?: string;
}

export interface NeuralModelConfig {
  id: string;
  name: string;
  type: string;
  description: string;
  layers: NeuralLayer[];
  nodes: NeuralNode[];
  connections: NeuralConnection[];
  parameterCount: number;
  config: Record<string, any>;
  sampleCode: string;
}


export interface NeuralModel {
  id: string;
  name: string;
  type?: string;           // "Embedding", "LLM", "OCR", "VL"
  description?: string;
  tags?: string[];
  parameterCount?: string | number; // Общее (size, parameters)
  downloads?: number;
  stars?: number;
  createdAt?: Date;

  // Общие (Унифицированные) поля
  country?: string;
  family?: string;         // Разработчик / Семейство
  releaseDate?: string;
  rating?: string;         // Универсальный рейтинг (Топ, Elo, Rank)
  hardwareRequirements?: string; 
  license?: string;
  link?: string;           

  // Специфичные для Embedding
  mtebScore?: string;
  dimension?: string;

  // Специфичные для LLM и VL
  contextWindow?: string;  
  multilingual?: string;   
  architecture?: string;
  benchmarks?: string;

  // Специфичные для OCR
  ned?: string;
  teds?: string;

  // Специфичные для VL (Vision-Language)
  applicationSpecifics?: string; // Специализация (документы, графики, общая)
  visionEncoder?: string;        // Визуальный энкодер (например, CLIP)
  economics?: string;            // Стоимость или модель монетизации
}



export interface NeuralModelComparison {
  id: string;
  name: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    trainingTime: number;
    inferenceTime: number;
    parameterCount: number;
  };
}