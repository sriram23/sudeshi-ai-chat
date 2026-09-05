// campaigns/index.ts

import { defaultCampaign } from "./default";
import { independenceDayCampaign } from "./independence";
import { vocBirthAnniversaryCampaign } from "./voc-birth-anniversary";

export const campaigns = {
    default: defaultCampaign,
    "independence": independenceDayCampaign,
    "voc": vocBirthAnniversaryCampaign,
};

export type CampaignId = keyof typeof campaigns;