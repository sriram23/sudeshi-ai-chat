"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

type CodeProps = {
 inline?:boolean,
 className?: string,
 children?:React.ReactNode
}

export const MarkdownRenderer = memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children }: CodeProps) {
          const match = /language-(\w+)/.exec(className || "");
          if(inline) {
            return (
              <code className="bg-red-500 px-1 rounded max-w-2xl overflow-auto">
                {children}
              </code>
            )
          }

          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match && match[1] || "bash"}
              PreTag="div"
              customStyle={{
                overflowX: "auto",
                maxWidth: "100%"
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
})
MarkdownRenderer.displayName = "MarkdownRenderer"