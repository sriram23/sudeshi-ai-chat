import { campaigns } from "./index";

const campaignId = process.env.ACTIVE_CAMPAIGN || "default"

export const activeCampaign = campaigns[campaignId as keyof typeof campaigns] ?? campaigns.default