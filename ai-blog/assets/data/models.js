const models = [
    {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        developer: "OpenAI",
        releaseDate: "2023-11-06",
        contextWindow: "128k",
        inputPrice: "$10.00",
        outputPrice: "$30.00",
        mmlu: "86.4%",
        description: "The latest model from OpenAI, featuring improved instruction following, JSON mode, and reproducible outputs.",
        tags: ["Proprietary", "Multimodal"]
    },
    {
        id: "claude-3-opus",
        name: "Claude 3 Opus",
        developer: "Anthropic",
        releaseDate: "2024-03-04",
        contextWindow: "200k",
        inputPrice: "$15.00",
        outputPrice: "$75.00",
        mmlu: "86.8%",
        description: "Anthropic's most powerful model, excelling at complex tasks, coding, and creative writing.",
        tags: ["Proprietary", "Multimodal"]
    },
    {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        developer: "Google",
        releaseDate: "2024-02-15",
        contextWindow: "1M+",
        inputPrice: "$3.50",
        outputPrice: "$10.50",
        mmlu: "81.9%",
        description: "Google's mid-size multimodal model with a massive context window, capable of processing vast amounts of information.",
        tags: ["Proprietary", "Multimodal"]
    },
    {
        id: "llama-3-70b",
        name: "Llama 3 70B",
        developer: "Meta",
        releaseDate: "2024-04-18",
        contextWindow: "8k",
        inputPrice: "Free (Open Weights)",
        outputPrice: "Free (Open Weights)",
        mmlu: "82.0%",
        description: "Meta's open-weights model, offering state-of-the-art performance for its size class.",
        tags: ["Open Weights", "Text"]
    },
    {
        id: "mistral-large",
        name: "Mistral Large",
        developer: "Mistral AI",
        releaseDate: "2024-02-26",
        contextWindow: "32k",
        inputPrice: "$8.00",
        outputPrice: "$24.00",
        mmlu: "81.0%",
        description: "A top-tier proprietary model from Mistral AI, known for strong reasoning capabilities and multilingual support.",
        tags: ["Proprietary", "Text"]
    },
    {
        id: "grok-1",
        name: "Grok-1",
        developer: "xAI",
        releaseDate: "2024-03-17",
        contextWindow: "8k",
        inputPrice: "Free (Open Weights)",
        outputPrice: "Free (Open Weights)",
        mmlu: "73.0%",
        description: "A large mixture-of-experts model from xAI, open-sourced with Apache 2.0 license.",
        tags: ["Open Weights", "Text"]
    }
];
