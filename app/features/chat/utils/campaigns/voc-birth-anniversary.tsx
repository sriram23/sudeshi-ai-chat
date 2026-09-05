import {
    BookOpenText,
    Languages,
    Sparkles,
} from "lucide-react";

import VOCVisual from "./voc-visual";

export const vocBirthAnniversaryCampaign = {
    id: "voc-birth-anniversary",

    badge: "V. O. CHIDAMBARAM PILLAI · 5 SEPTEMBER",

    title: "The spirit of Sudeshi (சுதேசி · स्वदेशी) lives on.",

    subtitle:
        "From ships that challenged a colonial monopoly to technology built for a stronger Bharat.",

    inspirationLabel: "Explore VOC's story",

    prompts: [
        {
            id: "voc",
            category: "V. O. Chidambaram Pillai",
            prompt: "Tell me about V. O. Chidambaram Pillai",
            icon: <BookOpenText size={20} />,
        },
        {
            id: "tamil",
            category: "வ.உ.சிதம்பரனார்",
            prompt: "வ.உ.சிதம்பரனார் பற்றி தமிழில் கூறுக",
            icon: <Languages size={20} />,
        },
        {
            id: "hindi",
            category: "वी. ओ. चिदंबरम पिल्लै",
            prompt: "वी. ओ. चिदंबरम पिल्लै के बारे में हिंदी में बताइए",
            icon: <Languages size={20} />,
        },
        {
            id: "sudeshi",
            category: "Sudeshi",
            prompt: "What did Sudeshi mean to V. O. Chidambaram Pillai?",
            icon: <Sparkles size={20} />,
        },
    ],

    visual: <VOCVisual />,
};
