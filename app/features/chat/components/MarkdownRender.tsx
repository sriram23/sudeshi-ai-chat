"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold, coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react"
import { useTheme } from "next-themes";

export const MarkdownRenderer = memo(({ content }: { content: string }) => {
  const { resolvedTheme } = useTheme()
  const codeTheme = resolvedTheme === "dark" ? coldarkDark : coldarkCold
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
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

          return (
            <div className="my-6 overflow-hidden rounded-xl border border-zinc-700">
              <div className="flex items-center justify-between border-b border-zinc-700 dark:bg-zinc-900 px-4 py-2">
                  <span className="text-xs dark:text-zinc-400 uppercase">
                      {match?.[1] ?? "TEXT"}
                  </span>

                  <Copy className="text-zinc-400" size={16}/>
              </div>
              <SyntaxHighlighter
                codeTagProps={{className: "font-mono"}}
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
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-8 mb-4">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-6 mb-3">
            {children}
          </h2>
        ),

        p: ({ children }) => (
          <p className="leading-7 my-4">
            {children}
          </p>
        ),

        ul: ({ children }) => (
          <ul className="list-disc pl-6 my-4 space-y-2">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="list-decimal pl-6 my-4 space-y-2">
            {children}
          </ol>
        ),

        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-600 dark:text-zinc-400 my-6">
            {children}
          </blockquote>
        ),

        table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-zinc-300 dark:border-zinc-700">
                <table className="w-full border-collapse text-sm">
                    {children}
                </table>
            </div>
        ),

        th: ({ children }) => (
            <th
                className="
                    border-b
                    border-zinc-300
                    px-4
                    py-3
                    text-left
                    font-semibold
                    dark:border-zinc-700
                "
            >
                {children}
            </th>
        ),
        tr: ({ children }) => (
            <tr className="even:bg-zinc-50 dark:even:bg-zinc-900/40">
                {children}
            </tr>
        ),

        td: ({ children }) => (
            <td
                className="
                    border-t
                    border-zinc-200
                    px-4
                    py-3
                    dark:border-zinc-800
                "
            >
                {children}
            </td>
        ),

      }}
    >
      {content}
    </ReactMarkdown>
  );
})
MarkdownRenderer.displayName = "MarkdownRenderer"