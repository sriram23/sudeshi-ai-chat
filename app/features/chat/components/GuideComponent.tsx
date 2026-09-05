import { Lightbulb } from "lucide-react";
import { Campaign } from "@/app/features/chat/types/campaign.types";

const GuideComponent = ({
    onMessageSend,
    campaign,
}: {
    onMessageSend: (message: string) => void;
    campaign: Campaign;
}) => {
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

            <h1 className="text-4xl font-bold mb-4 text-center text-zinc-950 dark:text-white">
                {campaign.title}
            </h1>

            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-4 italic">
                {campaign.subtitle}
            </p>

            <div className="flex justify-center my-4">
                {campaign.visual}
            </div>

            <p className="text-center flex items-center justify-center mb-6 text-zinc-500 dark:text-zinc-400">
                <span className="text-amber-300">
                    <Lightbulb size={20} />
                </span>

                <span className="ml-2">
                    {campaign.inspirationLabel}
                </span>
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                {campaign.prompts.map((item) => (
                    <div key={item.id}>
                        <div className="flex items-center justify-center gap-2 mb-2 text-zinc-500 dark:text-zinc-300">
                            {item.icon}

                            <span className="text-sm font-medium">
                                {item.category}
                            </span>
                        </div>

                        <button
                            aria-label={item.prompt}
                            className="
                                group
                                w-full
                                min-h-20
                                px-4 py-4
                                flex items-center justify-center
                                bg-white
                                border border-zinc-100
                                rounded-lg
                                text-zinc-500
                                dark:bg-zinc-900
                                dark:border-zinc-800
                                dark:text-zinc-300
                                hover:border-zinc-200
                                hover:shadow-sm
                                dark:hover:border-zinc-700
                                transition-all duration-200
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-zinc-400
                                dark:focus-visible:ring-zinc-600
                            "
                            onClick={() => onMessageSend(item.prompt)}
                        >
                            <span className="text-sm md:text-base">
                                {item.prompt}
                            </span>

                            <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
                                →
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuideComponent;
