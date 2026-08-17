import { Lightbulb } from "lucide-react";
import { Campaign } from "@/app/features/chat/types/campaign.types"

const GuideComponent = ({ onMessageSend, campaign }: { onMessageSend: (message: string) => void, campaign: Campaign }) => {
    return (
        <div className="p-4">
            {campaign.badge && (
                <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="h-1 w-6 rounded-full bg-[#FF9933]" />

                    <span className="text-xs font-medium tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                        {campaign.badge}
                    </span>

                    <span className="h-1 w-6 rounded-full bg-[#138808]" />
                </div>
            )}
            <h1 className="text-4xl font-bold mb-4 text-center text-zinc-950 dark:text-white">{campaign.title}</h1>

            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-4 italic">{campaign.subtitle}</p>

            <div className="flex justify-center my-4">
                {campaign.visual}
            </div>

            <p className="text-center flex items-center justify-center mb-6">
                <span className="text-amber-300">
                    <Lightbulb size={20} />
                </span>
                &nbsp;{campaign.inspirationLabel}
            </p>

            <div className="grid grid-cols-2 gap-4">
                {campaign.prompts.map((item) => (
                    <div key={item.id}>
                        <div className="flex items-center justify-center dark:text-zinc-300 mb-2 hover:scale-105 transition-all">
                            {item.icon}
                            <span className="ml-2">
                                {item.category}
                            </span>
                        </div>

                        <button
                            aria-label={item.prompt}
                            className="p-4 bg-white border border-zinc-100 hover:shadow-md hover:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 w-full rounded-lg transition-all"
                            onClick={() =>
                                onMessageSend(item.prompt)
                            }
                        >
                            <span className="ml-2">
                                {item.prompt} <span>→</span>
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GuideComponent;