
import type { ReactNode } from "react";

type CampaignPrompt = {
    id: string;
    category: string;
    prompt: string;
    icon: ReactNode;
};

export type Campaign = {
    id: string;
    badge?: string;
    title: string;
    subtitle: string;
    inspirationLabel: string;
    prompts: CampaignPrompt[];
    visual?: ReactNode;
};