import {
    BookOpenText,
    CodeXml,
    Languages,
    Plane,
} from "lucide-react";

import type { Campaign } from "@/app/features/chat/types/campaign.types";

export const defaultCampaign: Campaign = {
    id: "default",

    title: "How can I help you today?",

    subtitle:
        "Ask anything. Get answers in your language.",

    inspirationLabel: "Need inspiration?",

    prompts: [
        {
            id: "travel",
            category: "Travel",
            prompt: "Best places near Chennai",
            icon: <Plane size={20} />,
        },
        {
            id: "programming",
            category: "Programming",
            prompt: "Explain React server components",
            icon: <CodeXml size={20} />,
        },
        {
            id: "translation",
            category: "Translation",
            prompt: "Translate this to Tamil",
            icon: <Languages size={20} />,
        },
        {
            id: "learning",
            category: "Learning",
            prompt: "Teach me Kubernetes",
            icon: <BookOpenText size={20} />,
        },
    ],
};
