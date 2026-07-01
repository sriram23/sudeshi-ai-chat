import { BookOpenText, CodeXml, Languages, Lightbulb, Plane } from "lucide-react";

const GuideComponent = ({ onMessageSend }: { onMessageSend: (message: string) => void }) => {
    const data = [
        {
            id: 1,
            category: "Travel",
            prompt: "Best places near Chennai",
            icon: <Plane size={20} />
        },
        {
            id: 2,
            category: "Programming",
            prompt: "Explain React server components",
            icon: <CodeXml size={20} />
        },
        {
            id: 3,
            category: "Translation",
            prompt: "Translate this to Tamil",
            icon: <Languages size={20} />
        },
        {
            id: 4,
            category: "Learning",
            prompt: "Teach me Kubernetes",
            icon: <BookOpenText size={20} />
        }
    ]
    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold mb-4 text-center text-zinc-950 dark:text-white">How can I help you today?</h1>
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-4 italic">Powered by Sarvam AI. Multilingual AI Assistant</p>
            <p className="text-center flex items-center justify-center mb-6">
                <span className="text-amber-300"><Lightbulb size={20} /></span>
                &nbsp;Need inspiration?
            </p>
            <div className="grid grid-cols-2 gap-4">
                {data.map(items => (
                    <div key={items.id}>
                    <div className="flex items-center justify-center dark:text-zinc-300 mb-2 hover:scale-105 transition-all">
                        {items.icon}
                        <span className="ml-2">{items.category}</span>
                    </div>
                    <button aria-label={items.prompt} className="p-4 bg-white border border-zinc-100 hover:shadow-md hover:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 w-full rounded-lg transition-all" onClick={() => onMessageSend(items.prompt)}>
                        <span className="ml-2">{items.prompt} <span>→</span></span>
                    </button>
                    </div>
                ))}
                {/* <button aria-label="நண்பா சென்னை பற்றி பேசலாமா?" className="p-4 bg-zinc-800 text-white rounded-lg" onClick={() => onMessageSend("நண்பா சென்னை பற்றி பேசலாமா? ")}>
                    நண்பா சென்னை பற்றி பேசலாமா?
                </button>
                <button aria-label="Chennaila la outing poga best edam ethu?" className="p-4 bg-zinc-800 text-white rounded-lg" onClick={() => onMessageSend("Chennail la outing poga best edam ethu?")}>
                    Chennaila la outing poga best edam ethu?
                </button>
                <button aria-label="दिल्ली मे मौसम कैसा है?" className="p-4 bg-zinc-800 text-white rounded-lg" onClick={() => onMessageSend("दिल्ली मे मौसम कैसा है?")}>
                    दिल्ली मे मौसम कैसा है?
                </button>
                <button aria-label="What is the capital of France?" className="p-4 bg-zinc-800 text-white rounded-lg" onClick={() => onMessageSend("What is the capital of France?")}>
                    What is the capital of France?
                </button> */}
            </div>
        </div>
    );
}

export default GuideComponent;