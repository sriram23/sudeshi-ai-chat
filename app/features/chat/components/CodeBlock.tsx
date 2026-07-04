import { Check, CodeXml, Copy } from "lucide-react"
import { useTheme } from "next-themes";
import { coldarkCold, coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useState } from "react";

import type { ExtraProps } from "react-markdown";
import type { ComponentPropsWithoutRef } from "react";

type CodeProps = ComponentPropsWithoutRef<"code"> & ExtraProps;

const CodeBlock = (props: CodeProps) => {
    const { resolvedTheme } = useTheme()
    const codeTheme = resolvedTheme === "dark" ? coldarkDark : coldarkCold
    const [copied, setCopied] = useState(false)

    const { children, className, node} = props
    const match = /language-(\w+)/.exec(className || "");
    const isInline = node?.position?.start.line === node?.position?.end.line
    if(isInline && !match) {
    return (
        <code
        className="
            rounded-md
            border
            border-zinc-300
            bg-zinc-100
            px-1.5
            py-0.5
            font-mono
            text-[0.9em]
            dark:border-zinc-700
            dark:bg-zinc-800
        "
        >
        {children}
        </code>
    )
    }

    const code = String(children).replace(/\n$/, "");

    const handleCopy = async (
    e: React.MouseEvent<HTMLButtonElement>
    ) => {
    e.preventDefault();
    e.stopPropagation();

    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
        setCopied(false);
    }, 2000);
    };

    return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-300">
        <div className="flex items-center justify-between border-b border-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-4 py-2">
            <span className="text-xs flex gap-2 dark:text-zinc-400">
                <CodeXml size={16} /> {match?.[1] ?? "plaintext"}
            </span>

            <button className="flex
            items-center
            gap-2
            rounded-md
            px-2
            py-1
            text-xs
            transition-colors
            hover:bg-zinc-200
            dark:hover:bg-zinc-800" onClick={handleCopy}>{copied ? <Check size={16}/> : <Copy size={16} />}</button>
        </div>
        <SyntaxHighlighter
        style={codeTheme}
        language={match && match[1] || "text"}
        PreTag="div"
        wrapLongLines
        customStyle={{
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxWidth: "100%",
            margin: 0,
            padding: "1rem",
            borderRadius: 0,
            background: "transparent",
            fontFamily: "var(--font-jetbrains-mono)",
        }}
        >
        {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
    </div>
    );
}

export default CodeBlock
