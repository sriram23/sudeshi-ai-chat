import { campaigns } from "./index";

const campaignId = process.env.ACTIVE_CAMPAIGN || "default"

console.log("Active campaign: ", process.env.ACTIVE_CAMPAIGN)

export const activeCampaign = campaigns[campaignId as keyof typeof campaigns] ?? campaigns.default