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
        <div className="w-full px-3 py-4 sm:px-4 sm:py-6">
            <div className="w-full max-w-3xl mx-auto">
                {campaign.badge && (
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="h-1 w-5 sm:w-6 rounded-full bg-[#FF9933]" />

                        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.14em] sm:tracking-[0.18em] text-zinc-500 dark:text-zinc-400 text-center">
                            {campaign.badge}
                        </span>

                        <span className="h-1 w-5 sm:w-6 rounded-full bg-[#138808]" />
                    </div>
                )}

                <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-center text-zinc-950 dark:text-white">
                    {campaign.title}
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-center text-zinc-500 dark:text-zinc-400">
                    {campaign.subtitle}
                </p>

                {campaign.visual && (
                    <div className="flex justify-center my-5 sm:my-6 overflow-hidden">
                        {campaign.visual}
                    </div>
                )}

                <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6 mb-5 sm:mb-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    <Lightbulb
                        size={19}
                        className="shrink-0 text-amber-300"
                    />

                    <span>{campaign.inspirationLabel}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {campaign.prompts.map((item) => (
                        <div key={item.id} className="min-w-0">
                            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-300">
                                <span className="shrink-0">
                                    {item.icon}
                                </span>

                                <span className="truncate">
                                    {item.category}
                                </span>
                            </div>

                            <button
                                type="button"
                                aria-label={item.prompt}
                                className="
                                    group
                                    w-full
                                    min-h-16 sm:min-h-20
                                    px-2.5 sm:px-4
                                    py-3 sm:py-4
                                    flex items-center justify-center
                                    rounded-lg
                                    bg-white
                                    border border-zinc-100
                                    text-xs sm:text-sm md:text-base
                                    leading-relaxed
                                    text-zinc-500
                                    transition-all duration-200 ease-out
                                    hover:bg-zinc-50
                                    hover:border-zinc-200
                                    hover:shadow-sm
                                    active:scale-[0.99]
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-zinc-400
                                    focus-visible:ring-offset-2
                                    dark:bg-zinc-900
                                    dark:border-zinc-800
                                    dark:text-zinc-300
                                    dark:hover:bg-zinc-800/80
                                    dark:hover:border-zinc-700
                                    dark:focus-visible:ring-zinc-600
                                    dark:focus-visible:ring-offset-zinc-950
                                "
                                onClick={() => onMessageSend(item.prompt)}
                            >
                                <span className="min-w-0">
                                    {item.prompt}
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="
                                        ml-1.5 sm:ml-2
                                        shrink-0
                                        inline-block
                                        transition-transform duration-200 ease-out
                                        group-hover:translate-x-1
                                    "
                                >
                                    →
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuideComponent;
