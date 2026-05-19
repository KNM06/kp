
import { NeuralModel, NeuralModelComparison, NeuralModelConfig } from "@/types/neural";

// Sample data for models lib
export const sampleModels: NeuralModel[] = [
  {
    id: '1',
    name: 'gte-Qwen2-7B-instruct',
    type: 'Embedding',
    description: 'Модель Alibaba (Топ-5 / Топ-3)',
    tags: ['Embedding', 'Alibaba'],
    createdAt: new Date('2024-06-01'),
    parameterCount: 3584,
    downloads: 1000,
    
    country: 'Китай',
    family: 'Alibaba',
    releaseDate: 'Июнь 2024',
    mtebScore: '~68.4',
    rating: 'Топ-5 / Топ-3',
    dimension: '3584.0',
    contextWindow: '32000.0',
    license: 'Apache 2.0',
    multilingual: 'Высокая (отличное понимание ru)',
    hardwareRequirements: '~15GB / ~24GB+ VRAM (LLM-based)',
    link: 'https://huggingface.co/Alibaba-NLP/gte-Qwen2-7B-instruct'
  },
  {
    id: '2',
    name: 'gte-large-en-v1.5',
    type: 'Embedding',
    description: 'Модель Alibaba (Топ-40 / Не применимо (EN))',
    tags: ['Embedding', 'Alibaba'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Китай',
    family: 'Alibaba',
    releaseDate: '2023-12-01 00:00:00',
    mtebScore: '~64.1',
    rating: 'Топ-40 / Не применимо (EN)',
    dimension: '1024.0',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (в основном EN)',
    hardwareRequirements: '~1.3GB / ~4GB VRAM',
    link: 'https://huggingface.co/Alibaba-NLP/gte-large-en-v1.5'
  },
  {
    id: '3',
    name: 'gte-multilingual-base',
    type: 'Embedding',
    description: 'Модель Alibaba (Топ-40 / Топ-15)',
    tags: ['Embedding', 'Alibaba'],
    createdAt: new Date('2024-02-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'Китай',
    family: 'Alibaba',
    releaseDate: 'Фев 2024',
    mtebScore: '~63.2',
    rating: 'Топ-40 / Топ-15',
    dimension: '768.0',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Высокая',
    hardwareRequirements: '~0.6GB / ~2GB VRAM',
    link: 'https://huggingface.co/Alibaba-NLP/gte-multilingual-base'
  },
  {
    id: '4',
    name: 'Qwen3-Embedding-8B',
    type: 'Embedding',
    description: 'Модель Alibaba (Топ-1 / Топ-1)',
    tags: ['Embedding', 'Alibaba'],
    createdAt: new Date('2025-01-01'),
    parameterCount: 4096,
    downloads: 1000,
    
    country: 'Китай',
    family: 'Alibaba',
    releaseDate: '2025-10-01 00:00:00',
    mtebScore: '70.6',
    rating: 'Топ-1 / Топ-1',
    dimension: '4096.0',
    contextWindow: '32 768',
    license: 'Apache 2.0',
    multilingual: 'Высокая',
    hardwareRequirements: '~16GB / ~24GB+ VRAM',
    link: 'https://huggingface.co/Qwen/Qwen3-Embedding-8B'
  },
  {
    id: '5',
    name: 'text-embedding-v3',
    type: 'Embedding',
    description: 'Модель Alibaba (Топ-20 / Топ-15)',
    tags: ['Embedding', 'Alibaba'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Китай',
    family: 'Alibaba',
    releaseDate: '2024-01-01 00:00:00',
    mtebScore: '~65.0',
    rating: 'Топ-20 / Топ-15',
    dimension: '1024.0',
    contextWindow: '8192.0',
    license: 'API (DashScope)',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://dashscope.aliyun.com/'
  },
  {
    id: '7',
    name: 'bge-multilingual-gemma2',
    type: 'Embedding',
    description: 'Модель BAAI (Топ-15 / Топ-5)',
    tags: ['Embedding', 'BAAI'],
    createdAt: new Date('2024-07-01'),
    parameterCount: 3584,
    downloads: 1000,
    
    country: 'Китай',
    family: 'BAAI',
    releaseDate: 'Июль 2024',
    mtebScore: '67.5',
    rating: 'Топ-15 / Топ-5',
    dimension: '3584.0',
    contextWindow: '8192.0',
    license: 'Gemma License',
    multilingual: 'Очень высокая',
    hardwareRequirements: '~18GB / ~24GB VRAM (LLM-based)',
    link: 'https://huggingface.co/BAAI/bge-multilingual-gemma2'
  },
  {
    id: '8',
    name: 'bge-m3',
    type: 'Embedding',
    description: 'Модель BAAI (Топ-30 / Топ-10)',
    tags: ['Embedding', 'BAAI'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Китай',
    family: 'BAAI',
    releaseDate: '2024-01-01 00:00:00',
    mtebScore: '64.1',
    rating: 'Топ-30 / Топ-10',
    dimension: '1024.0',
    contextWindow: '8192.0',
    license: 'MIT',
    multilingual: 'Очень высокая',
    hardwareRequirements: '~2.2GB / ~6GB VRAM (Гибридный)',
    link: 'https://huggingface.co/BAAI/bge-m3'
  },
  {
    id: '9',
    name: 'bge-large-en-v1.5',
    type: 'Embedding',
    description: 'Модель BAAI (Топ-30 / Не прим.)',
    tags: ['Embedding', 'BAAI'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Китай',
    family: 'BAAI',
    releaseDate: '2023-08-01 00:00:00',
    mtebScore: '64.2',
    rating: 'Топ-30 / Не прим.',
    dimension: '1024.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~1.3GB / ~4GB VRAM',
    link: 'https://huggingface.co/BAAI/bge-large-en-v1.5'
  },
  {
    id: '10',
    name: 'bge-base-en-v1.5',
    type: 'Embedding',
    description: 'Модель BAAI (Топ-40 / Не прим.)',
    tags: ['Embedding', 'BAAI'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'Китай',
    family: 'BAAI',
    releaseDate: '2023-08-01 00:00:00',
    mtebScore: '63.5',
    rating: 'Топ-40 / Не прим.',
    dimension: '768.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~0.4GB / ~1GB VRAM',
    link: 'https://huggingface.co/BAAI/bge-base-en-v1.5'
  },
  {
    id: '11',
    name: 'bge-small-en-v1.5',
    type: 'Embedding',
    description: 'Модель BAAI (Топ-50 / Не прим.)',
    tags: ['Embedding', 'BAAI'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 384,
    downloads: 1000,
    
    country: 'Китай',
    family: 'BAAI',
    releaseDate: '2023-08-01 00:00:00',
    mtebScore: '62.3',
    rating: 'Топ-50 / Не прим.',
    dimension: '384.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~0.1GB / ~0.5GB VRAM',
    link: 'https://huggingface.co/BAAI/bge-small-en-v1.5'
  },
  {
    id: '12',
    name: 'bge-m4-large',
    type: 'Embedding',
    description: 'Модель BAAI (Топ-5 / Топ-3)',
    tags: ['Embedding', 'BAAI'],
    createdAt: new Date('2025-01-01'),
    parameterCount: 2048,
    downloads: 1000,
    
    country: 'Китай',
    family: 'BAAI',
    releaseDate: '2025-11-01 00:00:00',
    mtebScore: '68.5',
    rating: 'Топ-5 / Топ-3',
    dimension: '2048.0',
    contextWindow: '16 384',
    license: 'MIT',
    multilingual: 'Очень высокая',
    hardwareRequirements: '~4GB / ~8GB VRAM',
    link: 'https://github.com/FlagOpen/FlagEmbedding'
  },
  {
    id: '14',
    name: 'bce-embedding-base_v1',
    type: 'Embedding',
    description: 'Модель NetEase / Youdao (Топ-30 / Топ-20)',
    tags: ['Embedding', 'NetEase / Youdao'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'Китай',
    family: 'NetEase / Youdao',
    releaseDate: '2023-12-01 00:00:00',
    mtebScore: '64.2',
    rating: 'Топ-30 / Топ-20',
    dimension: '768.0',
    contextWindow: '512.0',
    license: 'Apache 2.0',
    multilingual: 'Высокая',
    hardwareRequirements: '~1.1GB / ~3GB VRAM',
    link: 'https://huggingface.co/maidalun1020/bce-embedding-base_v1'
  },
  {
    id: '16',
    name: 'jina-embeddings-v3',
    type: 'Embedding',
    description: 'Модель Jina AI (Топ-20 / Топ-15)',
    tags: ['Embedding', 'Jina AI'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 32,
    downloads: 1000,
    
    country: 'Германия',
    family: 'Jina AI',
    releaseDate: '2024-09-01 00:00:00',
    mtebScore: '~65.0',
    rating: 'Топ-20 / Топ-15',
    dimension: '32 (до 1024)',
    contextWindow: '8192.0',
    license: 'CC BY-NC 4.0',
    multilingual: 'Высокая (хороший ru)',
    hardwareRequirements: '~2.3GB / ~6GB VRAM (Matryoshka, Task-LoRA)',
    link: 'https://huggingface.co/jinaai/jina-embeddings-v3'
  },
  {
    id: '17',
    name: 'jina-embeddings-v2-base-en',
    type: 'Embedding',
    description: 'Модель Jina AI (Топ-90 / Не применимо)',
    tags: ['Embedding', 'Jina AI'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'Германия',
    family: 'Jina AI',
    releaseDate: '2023-10-01 00:00:00',
    mtebScore: '60.4',
    rating: 'Топ-90 / Не применимо',
    dimension: '768.0',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~0.5GB / ~2GB VRAM',
    link: 'https://huggingface.co/jinaai/jina-embeddings-v2-base-en'
  },
  {
    id: '19',
    name: 'GritLM-7B',
    type: 'Embedding',
    description: 'Модель GritLM (Топ-15 / Топ-20)',
    tags: ['Embedding', 'GritLM'],
    createdAt: new Date('2024-02-01'),
    parameterCount: 4096,
    downloads: 1000,
    
    country: 'Германия',
    family: 'GritLM',
    releaseDate: 'Фев 2024',
    mtebScore: '~66.8',
    rating: 'Топ-15 / Топ-20',
    dimension: '4096.0',
    contextWindow: '32768.0',
    license: 'Apache 2.0',
    multilingual: 'Средняя',
    hardwareRequirements: '~15GB / ~24GB+ VRAM (LLM-based)',
    link: 'https://huggingface.co/GritLM/GritLM-7B'
  },
  {
    id: '21',
    name: 'mxbai-embed-large-v1',
    type: 'Embedding',
    description: 'Модель Mixedbread AI (Топ-25 / Не применимо (EN))',
    tags: ['Embedding', 'Mixedbread AI'],
    createdAt: new Date('2024-03-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Германия',
    family: 'Mixedbread AI',
    releaseDate: 'Март 2024',
    mtebScore: '~64.6',
    rating: 'Топ-25 / Не применимо (EN)',
    dimension: '1024.0',
    contextWindow: '512.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (только EN)',
    hardwareRequirements: '~1.3GB / ~4GB VRAM',
    link: 'https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1'
  },
  {
    id: '23',
    name: 'paraphrase-multilingual-mpnet',
    type: 'Embedding',
    description: 'Модель SentenceTransformers (Топ-100 / Топ-40)',
    tags: ['Embedding', 'SentenceTransformers'],
    createdAt: new Date('2021-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'Германия',
    family: 'SentenceTransformers',
    releaseDate: '2021.0',
    mtebScore: '57.8',
    rating: 'Топ-100 / Топ-40',
    dimension: '768.0',
    contextWindow: '512.0',
    license: 'Apache 2.0',
    multilingual: 'Высокая',
    hardwareRequirements: '~1.1GB / ~3GB VRAM',
    link: 'https://huggingface.co/sentence-transformers/paraphrase-multilingual-mpnet-base-v2'
  },
  {
    id: '24',
    name: 'all-mpnet-base-v2',
    type: 'Embedding',
    description: 'Модель SentenceTransformers (Топ-100 / Не применимо)',
    tags: ['Embedding', 'SentenceTransformers'],
    createdAt: new Date('2021-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'Германия',
    family: 'SentenceTransformers',
    releaseDate: '2021.0',
    mtebScore: '57.8',
    rating: 'Топ-100 / Не применимо',
    dimension: '768.0',
    contextWindow: '384.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~0.4GB / ~1GB VRAM',
    link: 'https://huggingface.co/sentence-transformers/all-mpnet-base-v2'
  },
  {
    id: '26',
    name: 'NV-Embed-v2',
    type: 'Embedding',
    description: 'Модель Nvidia (Топ-1 / Топ-5)',
    tags: ['Embedding', 'Nvidia'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 4096,
    downloads: 1000,
    
    country: 'США',
    family: 'Nvidia',
    releaseDate: '2024-09-01 00:00:00',
    mtebScore: '~69.3',
    rating: 'Топ-1 / Топ-5',
    dimension: '4096.0',
    contextWindow: '32000.0',
    license: 'CC BY-NC 4.0',
    multilingual: 'Высокая',
    hardwareRequirements: '~65GB / ~80GB+ VRAM (LLM-based)',
    link: 'https://huggingface.co/nvidia/NV-Embed-v2'
  },
  {
    id: '28',
    name: 'nomic-embed-text-v1.5',
    type: 'Embedding',
    description: 'Модель Nomic AI (Топ-50 / Не применимо (EN))',
    tags: ['Embedding', 'Nomic AI'],
    createdAt: new Date('2024-03-01'),
    parameterCount: 64,
    downloads: 1000,
    
    country: 'США',
    family: 'Nomic AI',
    releaseDate: 'Март 2024',
    mtebScore: '~62.4',
    rating: 'Топ-50 / Не применимо (EN)',
    dimension: '64 (до 768)',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (только EN)',
    hardwareRequirements: '<1GB / ~2GB VRAM (Matryoshka)',
    link: 'https://huggingface.co/nomic-ai/nomic-embed-text-v1.5'
  },
  {
    id: '29',
    name: 'nomic-embed-text-v1',
    type: 'Embedding',
    description: 'Модель Nomic AI (Топ-50 / Не применимо)',
    tags: ['Embedding', 'Nomic AI'],
    createdAt: new Date('2024-02-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'США',
    family: 'Nomic AI',
    releaseDate: 'Фев 2024',
    mtebScore: '62.3',
    rating: 'Топ-50 / Не применимо',
    dimension: '768.0',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '<1GB / ~2GB VRAM',
    link: 'https://huggingface.co/nomic-ai/nomic-embed-text-v1'
  },
  {
    id: '30',
    name: 'nomic-embed-text-v2',
    type: 'Embedding',
    description: 'Модель Nomic AI (Топ-25 / Не прим.)',
    tags: ['Embedding', 'Nomic AI'],
    createdAt: new Date('2025-03-01'),
    parameterCount: 128,
    downloads: 1000,
    
    country: 'США',
    family: 'Nomic AI',
    releaseDate: 'Март 2025',
    mtebScore: '64.9',
    rating: 'Топ-25 / Не прим.',
    dimension: '128 (до 1024)',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~1.5GB / ~4GB VRAM',
    link: 'https://www.google.com/search?q=https://huggingface.co/nomic-ai/nomic-embed-text-v2'
  },
  {
    id: '32',
    name: 'SFR-Embedding-2_R',
    type: 'Embedding',
    description: 'Модель Salesforce (Топ-10 / Не применимо (EN))',
    tags: ['Embedding', 'Salesforce'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 4096,
    downloads: 1000,
    
    country: 'США',
    family: 'Salesforce',
    releaseDate: '2024-04-01 00:00:00',
    mtebScore: '~67.6',
    rating: 'Топ-10 / Не применимо (EN)',
    dimension: '4096.0',
    contextWindow: '32768.0',
    license: 'Apache 2.0',
    multilingual: 'Нет (только EN)',
    hardwareRequirements: '~15GB / ~24GB+ VRAM (LLM-based)',
    link: 'https://huggingface.co/Salesforce/SFR-Embedding-2_R'
  },
  {
    id: '34',
    name: 'multilingual-e5-large',
    type: 'Embedding',
    description: 'Модель Microsoft (Топ-70 / Топ-20)',
    tags: ['Embedding', 'Microsoft'],
    createdAt: new Date('2022-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'США',
    family: 'Microsoft',
    releaseDate: '2022-11-01 00:00:00',
    mtebScore: '~61.4',
    rating: 'Топ-70 / Топ-20',
    dimension: '1024.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Высокая',
    hardwareRequirements: '~2.2GB / ~6GB VRAM',
    link: 'https://huggingface.co/intfloat/multilingual-e5-large'
  },
  {
    id: '35',
    name: 'multilingual-e5-small',
    type: 'Embedding',
    description: 'Модель Microsoft (Топ-100 / Топ-30)',
    tags: ['Embedding', 'Microsoft'],
    createdAt: new Date('2022-01-01'),
    parameterCount: 384,
    downloads: 1000,
    
    country: 'США',
    family: 'Microsoft',
    releaseDate: '2022-11-01 00:00:00',
    mtebScore: '~57.5',
    rating: 'Топ-100 / Топ-30',
    dimension: '384.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Высокая',
    hardwareRequirements: '~0.5GB / ~1GB VRAM',
    link: 'https://huggingface.co/intfloat/multilingual-e5-small'
  },
  {
    id: '36',
    name: 'intfloat/e5-mistral-7b-instruct',
    type: 'Embedding',
    description: 'Модель Microsoft (Топ-15 / Топ-10)',
    tags: ['Embedding', 'Microsoft'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 4096,
    downloads: 1000,
    
    country: 'США',
    family: 'Microsoft',
    releaseDate: '2023-12-01 00:00:00',
    mtebScore: '66.6',
    rating: 'Топ-15 / Топ-10',
    dimension: '4096.0',
    contextWindow: '32768.0',
    license: 'MIT',
    multilingual: 'Высокая',
    hardwareRequirements: '~15GB / ~24GB+ VRAM (LLM-based)',
    link: 'https://huggingface.co/intfloat/e5-mistral-7b-instruct'
  },
  {
    id: '37',
    name: 'multilingual-e5-base',
    type: 'Embedding',
    description: 'Модель Microsoft (Топ-80 / Топ-25)',
    tags: ['Embedding', 'Microsoft'],
    createdAt: new Date('2022-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'США',
    family: 'Microsoft',
    releaseDate: '2022-11-01 00:00:00',
    mtebScore: '61.0',
    rating: 'Топ-80 / Топ-25',
    dimension: '768.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Высокая',
    hardwareRequirements: '~1.1GB / ~3GB VRAM',
    link: 'https://huggingface.co/intfloat/multilingual-e5-base'
  },
  {
    id: '39',
    name: 'text-embedding-3-large',
    type: 'Embedding',
    description: 'Модель OpenAI (Топ-25 / Топ-15)',
    tags: ['Embedding', 'OpenAI'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'США',
    family: 'OpenAI',
    releaseDate: '2024-01-01 00:00:00',
    mtebScore: '64.6',
    rating: 'Топ-25 / Топ-15',
    dimension: '256 (до 3072)',
    contextWindow: '8192.0',
    license: 'API',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud, Native Matryoshka)',
    link: 'https://platform.openai.com/docs/guides/embeddings'
  },
  {
    id: '40',
    name: 'text-embedding-4-large',
    type: 'Embedding',
    description: 'Модель OpenAI (Топ-10 / Топ-10)',
    tags: ['Embedding', 'OpenAI'],
    createdAt: new Date('2026-01-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'США',
    family: 'OpenAI',
    releaseDate: '2026-01-01 00:00:00',
    mtebScore: '67.5',
    rating: 'Топ-10 / Топ-10',
    dimension: '256 (до 4096)',
    contextWindow: '16 384',
    license: 'API',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud, Matryoshka)',
    link: 'https://platform.openai.com/docs/guides/embeddings'
  },
  {
    id: '41',
    name: 'text-embedding-3-small',
    type: 'Embedding',
    description: 'Модель OpenAI (Топ-50 / Топ-30)',
    tags: ['Embedding', 'OpenAI'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'США',
    family: 'OpenAI',
    releaseDate: '2024-01-01 00:00:00',
    mtebScore: '62.3',
    rating: 'Топ-50 / Топ-30',
    dimension: '256 (до 1536)',
    contextWindow: '8192.0',
    license: 'API',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud, Native Matryoshka)',
    link: 'https://platform.openai.com/docs/guides/embeddings'
  },
  {
    id: '43',
    name: 'text-embedding-005',
    type: 'Embedding',
    description: 'Модель Google (Топ-10 / Топ-10)',
    tags: ['Embedding', 'Google'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'США',
    family: 'Google',
    releaseDate: 'конец 2024',
    mtebScore: '68.5',
    rating: 'Топ-10 / Топ-10',
    dimension: '256 (до 768)',
    contextWindow: '8192.0',
    license: 'API (Vertex)',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings'
  },
  {
    id: '44',
    name: 'gemini-embedding-001',
    type: 'Embedding',
    description: 'Модель Google (Топ-5 / Топ-3)',
    tags: ['Embedding', 'Google'],
    createdAt: new Date('2025-02-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'США',
    family: 'Google',
    releaseDate: 'Фев 2025',
    mtebScore: '68.3',
    rating: 'Топ-5 / Топ-3',
    dimension: '256 (до 3072)',
    contextWindow: '32 000',
    license: 'API (Vertex)',
    multilingual: 'Очень высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings'
  },
  {
    id: '45',
    name: 'text-multilingual-embedding-002',
    type: 'Embedding',
    description: 'Модель Google (Топ-50 / Топ-20)',
    tags: ['Embedding', 'Google'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'США',
    family: 'Google',
    releaseDate: '2023.0',
    mtebScore: '~63.0',
    rating: 'Топ-50 / Топ-20',
    dimension: '768.0',
    contextWindow: '8192.0',
    license: 'API (Vertex)',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings'
  },
  {
    id: '47',
    name: 'voyage-3-large',
    type: 'Embedding',
    description: 'Модель Voyage AI (Топ-10 / Топ-10)',
    tags: ['Embedding', 'Voyage AI'],
    createdAt: new Date('2024-06-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'США',
    family: 'Voyage AI',
    releaseDate: 'Июнь 2024',
    mtebScore: '68.2',
    rating: 'Топ-10 / Топ-10',
    dimension: '256, 512, 1024',
    contextWindow: '32000.0',
    license: 'API',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://docs.voyageai.com/docs/embeddings'
  },
  {
    id: '48',
    name: 'voyage-law-2',
    type: 'Embedding',
    description: 'Модель Voyage AI (Спец. / Не применимо)',
    tags: ['Embedding', 'Voyage AI'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'США',
    family: 'Voyage AI',
    releaseDate: '2024-04-01 00:00:00',
    mtebScore: 'N/A (Спец)',
    rating: 'Спец. / Не применимо',
    dimension: '1024.0',
    contextWindow: '16000.0',
    license: 'API',
    multilingual: 'Низкая (Юриспруденция)',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://docs.voyageai.com/docs/embeddings'
  },
  {
    id: '49',
    name: 'voyage-large-2',
    type: 'Embedding',
    description: 'Модель Voyage AI (Топ-3 / Топ-5)',
    tags: ['Embedding', 'Voyage AI'],
    createdAt: new Date('2025-03-01'),
    parameterCount: 512,
    downloads: 1000,
    
    country: 'США',
    family: 'Voyage AI',
    releaseDate: 'Март 2025',
    mtebScore: '69.1',
    rating: 'Топ-3 / Топ-5',
    dimension: '512, 1024, 2048',
    contextWindow: '32 000',
    license: 'API',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://docs.voyageai.com/docs/embeddings'
  },
  {
    id: '50',
    name: 'voyage-finance-2',
    type: 'Embedding',
    description: 'Модель Voyage AI (Спец. / Не применимо)',
    tags: ['Embedding', 'Voyage AI'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'США',
    family: 'Voyage AI',
    releaseDate: '2024-04-01 00:00:00',
    mtebScore: 'N/A (Спец)',
    rating: 'Спец. / Не применимо',
    dimension: '1024.0',
    contextWindow: '32000.0',
    license: 'API',
    multilingual: 'Низкая (Финансы)',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://docs.voyageai.com/docs/embeddings'
  },
  {
    id: '52',
    name: 'snowflake-arctic-embed-l-v2.0',
    type: 'Embedding',
    description: 'Модель Snowflake (Топ-25 / Не применимо (EN))',
    tags: ['Embedding', 'Snowflake'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'США',
    family: 'Snowflake',
    releaseDate: '2024-04-01 00:00:00',
    mtebScore: '~64.8',
    rating: 'Топ-25 / Не применимо (EN)',
    dimension: '1024.0',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (только EN)',
    hardwareRequirements: '~1.3GB / ~4GB VRAM',
    link: 'https://huggingface.co/Snowflake/snowflake-arctic-embed-l'
  },
  {
    id: '54',
    name: 'granite-embedding-278m-multilingual',
    type: 'Embedding',
    description: 'Модель IBM (Топ-50 / Топ-20)',
    tags: ['Embedding', 'IBM'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'США',
    family: 'IBM',
    releaseDate: '2024-12-01 00:00:00',
    mtebScore: '~62.5',
    rating: 'Топ-50 / Топ-20',
    dimension: '768.0',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Высокая',
    hardwareRequirements: '~1GB / ~2GB VRAM',
    link: 'https://huggingface.co/ibm-granite/granite-embedding-278m-multilingual'
  },
  {
    id: '56',
    name: 'amazon.titan-embed-text-v2:0',
    type: 'Embedding',
    description: 'Модель Amazon (Топ-40 / Не применимо)',
    tags: ['Embedding', 'Amazon'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'США',
    family: 'Amazon',
    releaseDate: '2024-04-01 00:00:00',
    mtebScore: '~64.0',
    rating: 'Топ-40 / Не применимо',
    dimension: '256, 512, 1024',
    contextWindow: '8192.0',
    license: 'API',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: 'Неприменимо (Cloud, Matryoshka)',
    link: 'https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html'
  },
  {
    id: '58',
    name: 'm2-bert-80M-8k-retrieval',
    type: 'Embedding',
    description: 'Модель Together AI (Топ-100 / Не применимо)',
    tags: ['Embedding', 'Together AI'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'США',
    family: 'Together AI',
    releaseDate: '2023-11-01 00:00:00',
    mtebScore: '60.0',
    rating: 'Топ-100 / Не применимо',
    dimension: '768.0',
    contextWindow: '8192.0',
    license: 'Apache 2.0',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~0.3GB / ~1GB VRAM',
    link: 'https://huggingface.co/togethercomputer/m2-bert-80M-8k-retrieval'
  },
  {
    id: '60',
    name: 'contriever',
    type: 'Embedding',
    description: 'Модель Meta (Топ-150 / Не применимо)',
    tags: ['Embedding', 'Meta'],
    createdAt: new Date('2022-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'США',
    family: 'Meta',
    releaseDate: '2022.0',
    mtebScore: '56.0',
    rating: 'Топ-150 / Не применимо',
    dimension: '768.0',
    contextWindow: '512.0',
    license: 'CC-BY 4.0',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: '~0.4GB / ~1GB VRAM',
    link: 'https://huggingface.co/facebook/contriever'
  },
  {
    id: '62',
    name: 'embed-multilingual-v3.0',
    type: 'Embedding',
    description: 'Модель Cohere (Топ-20 / Топ-5)',
    tags: ['Embedding', 'Cohere'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Канада',
    family: 'Cohere',
    releaseDate: '2023-11-01 00:00:00',
    mtebScore: '65.2',
    rating: 'Топ-20 / Топ-5',
    dimension: '1024.0',
    contextWindow: '512.0',
    license: 'API',
    multilingual: 'Очень высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://docs.cohere.com/docs/embeddings'
  },
  {
    id: '63',
    name: 'embed-multilingual-v4.0',
    type: 'Embedding',
    description: 'Модель Cohere (Топ-10 / Топ-5)',
    tags: ['Embedding', 'Cohere'],
    createdAt: new Date('2025-01-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'Канада',
    family: 'Cohere',
    releaseDate: '2025-08-01 00:00:00',
    mtebScore: '66.8',
    rating: 'Топ-10 / Топ-5',
    dimension: '256 (до 1024)',
    contextWindow: '8192.0',
    license: 'API',
    multilingual: 'Очень высокая',
    hardwareRequirements: 'Неприменимо (Cloud, Matryoshka)',
    link: 'https://docs.cohere.com/docs/embeddings'
  },
  {
    id: '64',
    name: 'embed-english-v3.0',
    type: 'Embedding',
    description: 'Модель Cohere (Топ-25 / Не применимо)',
    tags: ['Embedding', 'Cohere'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Канада',
    family: 'Cohere',
    releaseDate: '2023-11-01 00:00:00',
    mtebScore: '64.5',
    rating: 'Топ-25 / Не применимо',
    dimension: '1024.0',
    contextWindow: '512.0',
    license: 'API',
    multilingual: 'Низкая (EN)',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://docs.cohere.com/docs/embeddings'
  },
  {
    id: '66',
    name: 'mistral-embed',
    type: 'Embedding',
    description: 'Модель Mistral AI (Топ-60 / Топ-30)',
    tags: ['Embedding', 'Mistral AI'],
    createdAt: new Date('2023-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Франция',
    family: 'Mistral AI',
    releaseDate: '2023-12-01 00:00:00',
    mtebScore: '~62.0',
    rating: 'Топ-60 / Топ-30',
    dimension: '1024.0',
    contextWindow: '8192.0',
    license: 'API',
    multilingual: 'Высокая',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://docs.mistral.ai/capabilities/embeddings/'
  },
  {
    id: '68',
    name: 'sbert_large_nlu_ru',
    type: 'Embedding',
    description: 'Модель Sberbank (Не применимо / Топ-40)',
    tags: ['Embedding', 'Sberbank'],
    createdAt: new Date('2021-01-01'),
    parameterCount: 1024,
    downloads: 1000,
    
    country: 'Россия',
    family: 'Sberbank',
    releaseDate: '2021.0',
    mtebScore: 'N/A',
    rating: 'Не применимо / Топ-40',
    dimension: '1024.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Низкая (только RU)',
    hardwareRequirements: '~1.7GB / ~4GB VRAM',
    link: 'https://huggingface.co/ai-forever/sbert_large_nlu_ru'
  },
  {
    id: '70',
    name: 'yandex-text-embedding',
    type: 'Embedding',
    description: 'Модель Yandex Cloud (Не применимо / Топ-5)',
    tags: ['Embedding', 'Yandex Cloud'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 256,
    downloads: 1000,
    
    country: 'Россия',
    family: 'Yandex Cloud',
    releaseDate: '2024-03-01 00:00:00',
    mtebScore: 'N/A',
    rating: 'Не применимо / Топ-5',
    dimension: '256 (до 1024)',
    contextWindow: '8192.0',
    license: 'API',
    multilingual: 'Низкая (Фокус на RU)',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://yandex.cloud/ru/docs/foundation-models/concepts/embeddings'
  },
  {
    id: '72',
    name: 'rubert-base-cased-sentence',
    type: 'Embedding',
    description: 'Модель DeepPavlov (Не применимо / Топ-40)',
    tags: ['Embedding', 'DeepPavlov'],
    createdAt: new Date('2020-01-01'),
    parameterCount: 768,
    downloads: 1000,
    
    country: 'Россия',
    family: 'DeepPavlov',
    releaseDate: '2020.0',
    mtebScore: 'N/A',
    rating: 'Не применимо / Топ-40',
    dimension: '768.0',
    contextWindow: '512.0',
    license: 'MIT',
    multilingual: 'Низкая(Только RU)',
    hardwareRequirements: '~0.7GB / ~2GB VRAM',
    link: 'https://huggingface.co/DeepPavlov/rubert-base-cased-sentence'
  },
  {
    id: '74',
    name: 'solar-embedding-1-large',
    type: 'Embedding',
    description: 'Модель Upstage (Топ-30 / Топ-20)',
    tags: ['Embedding', 'Upstage'],
    createdAt: new Date('2024-01-01'),
    parameterCount: 4096,
    downloads: 1000,
    
    country: 'Южная Корея',
    family: 'Upstage',
    releaseDate: '2024-01-01 00:00:00',
    mtebScore: '64.4',
    rating: 'Топ-30 / Топ-20',
    dimension: '4096.0',
    contextWindow: '4096.0',
    license: 'API',
    multilingual: 'Средняя',
    hardwareRequirements: 'Неприменимо (Cloud)',
    link: 'https://developers.upstage.ai/docs/apis/embeddings'
  }
];

// Sample comparison data
export const sampleComparisonData: NeuralModelComparison[] = [
  {
    id: '1',
    name: 'ResNet-50',
    metrics: {
      accuracy: 92.1,
      precision: 90.5,
      recall: 89.8,
      f1Score: 90.1,
      trainingTime: 120,
      inferenceTime: 15,
      parameterCount: 25600000
    }
  },
  {
    id: '2',
    name: 'MobileNetV3',
    metrics: {
      accuracy: 84.2,
      precision: 83.7,
      recall: 82.9,
      f1Score: 83.3,
      trainingTime: 65,
      inferenceTime: 8,
      parameterCount: 2500000
    }
  },
  {
    id: '3',
    name: 'EfficientNetB0',
    metrics: {
      accuracy: 88.5,
      precision: 87.2,
      recall: 86.8,
      f1Score: 87.0,
      trainingTime: 95,
      inferenceTime: 12,
      parameterCount: 5300000
    }
  },
  {
    id: '4',
    name: 'VGG-16',
    metrics: {
      accuracy: 89.9,
      precision: 88.4,
      recall: 87.9,
      f1Score: 88.1,
      trainingTime: 180,
      inferenceTime: 28,
      parameterCount: 138000000
    }
  }
];

// Function to generate a sample neural network
export const generateSampleNetwork = (): NeuralModelConfig => {
  // Create nodes for each layer
  const inputNodes = Array(4).fill(0).map((_, i) => ({
    id: `input-${i}`,
    x: 50,
    y: 50 + i * 60,
    layer: 0,
    type: 'input' as const
  }));
  
  const hiddenNodes1 = Array(6).fill(0).map((_, i) => ({
    id: `hidden1-${i}`,
    x: 200,
    y: 30 + i * 50,
    layer: 1,
    type: 'hidden' as const
  }));
  
  const hiddenNodes2 = Array(5).fill(0).map((_, i) => ({
    id: `hidden2-${i}`,
    x: 350,
    y: 50 + i * 50,
    layer: 2,
    type: 'hidden' as const
  }));
  
  const outputNodes = Array(3).fill(0).map((_, i) => ({
    id: `output-${i}`,
    x: 500,
    y: 75 + i * 60,
    layer: 3,
    type: 'output' as const
  }));
  
  const allNodes = [...inputNodes, ...hiddenNodes1, ...hiddenNodes2, ...outputNodes];
  
  // Create connections between layers
  const connections = [];
  
  // Connect input to first hidden layer
  for (const inputNode of inputNodes) {
    for (const hiddenNode of hiddenNodes1) {
      connections.push({
        source: inputNode.id,
        target: hiddenNode.id,
        weight: parseFloat((Math.random() * 2 - 1).toFixed(2))
      });
    }
  }
  
  // Connect first hidden layer to second hidden layer
  for (const hiddenNode1 of hiddenNodes1) {
    for (const hiddenNode2 of hiddenNodes2) {
      connections.push({
        source: hiddenNode1.id,
        target: hiddenNode2.id,
        weight: parseFloat((Math.random() * 2 - 1).toFixed(2))
      });
    }
  }
  
  // Connect second hidden layer to output
  for (const hiddenNode of hiddenNodes2) {
    for (const outputNode of outputNodes) {
      connections.push({
        source: hiddenNode.id,
        target: outputNode.id,
        weight: parseFloat((Math.random() * 2 - 1).toFixed(2))
      });
    }
  }
  
  return {
    id: '1',
    name: 'Многослойный персептрон',
    type: 'Полносвязная нейронная сеть',
    description: 'Классификационная модель с двумя скрытыми слоями',
    layers: [
      { id: 'l1', type: 'input', neurons: 4 },
      { id: 'l2', type: 'dense', neurons: 6, activation: 'relu' },
      { id: 'l3', type: 'dense', neurons: 5, activation: 'relu' },
      { id: 'l4', type: 'output', neurons: 3, activation: 'softmax' }
    ],
    nodes: allNodes,
    connections: connections,
    parameterCount: 83,
    config: {
      optimizer: 'adam',
      learningRate: 0.001,
      batchSize: 32,
      epochs: 100,
      lossFunction: 'categorical_crossentropy',
      regularization: {
        type: 'l2',
        value: 0.001
      }
    },
    sampleCode: `import tensorflow as tf
from tensorflow import keras

# Создаем последовательную модель
model = keras.Sequential()

# Добавляем слои
model.add(keras.layers.Dense(6, activation='relu', input_shape=(4,)))
model.add(keras.layers.Dense(5, activation='relu'))
model.add(keras.layers.Dense(3, activation='softmax'))

# Компилируем модель
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Обучаем модель
history = model.fit(
    x_train, 
    y_train,
    batch_size=32,
    epochs=100,
    validation_split=0.2
)`
  };
};