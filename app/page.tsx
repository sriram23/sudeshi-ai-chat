import ChatContainer from "./features/chat/components/ChatContainer";
import {activeCampaign} from "@/app/features/chat/utils/campaigns/active"

export default function Home() {
  return (
    <main>
      <ChatContainer activeCampaign={activeCampaign}/>
    </main>
  );
}
