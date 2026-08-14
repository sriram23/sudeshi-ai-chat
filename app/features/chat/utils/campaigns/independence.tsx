// campaigns/independence-day.tsx

import { BookOpenText, Languages, Landmark, ScrollText } from "lucide-react";
import IndependenceDayVisual from "./independence-visual";

export const independenceDayCampaign = {
    id: "independence-day",

    badge: "INDEPENDENCE DAY · 15 AUGUST",

    title: "India, in its own voice.",

    subtitle:
        "Explore India's history, languages, culture and journey through conversation.",

    inspirationLabel: "Explore India's story",

    prompts: [
        {
            id: "freedom-movement",
            category: "Freedom Movement",
            prompt: "Tell me about India's independence movement",
            icon: <Landmark size={20} />,
        },
        {
            id: "constitution",
            category: "Constitution",
            prompt: "Why was the Indian Constitution important?",
            icon: <ScrollText size={20} />,
        },
        {
            id: "languages",
            category: "Indian Languages",
            prompt: "Tell me about India's linguistic diversity",
            icon: <Languages size={20} />,
        },
        {
            id: "india",
            category: "India",
            prompt: "How has India changed since independence?",
            icon: <BookOpenText size={20} />,
        },
    ],

    visual: <IndependenceDayVisual />,
};
