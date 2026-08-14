// campaigns/index.ts

import { defaultCampaign } from "./default";
import { independenceDayCampaign } from "./independence";

export const campaigns = {
    default: defaultCampaign,
    "independence": independenceDayCampaign,
};

export type CampaignId = keyof typeof campaigns;