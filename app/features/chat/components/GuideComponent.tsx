const GuideComponent = ({ onMessageSend }: { onMessageSend: (message: string) => void }) => {
    return (
        <div className="p-4">
            <h1 className="text-5xl font-bold mb-8 text-center text-zinc-950 dark:text-white">Welcome to Sudeshi Chat!</h1>
            <p className="mb-2">Sudeshi is your personal AI assistant, powered by Sarvam AI. Here are some tips to get you started:</p>
            <div className="grid grid-cols-2 gap-4">
                <button aria-label="நண்பா சென்னை பற்றி பேசலாமா?" className="p-4 bg-zinc-800 text-white rounded-lg" onClick={() => onMessageSend("நண்பா சென்னை பற்றி பேசலாமா? ")}>
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
                </button>
            </div>
        </div>
    );
}

export default GuideComponent;