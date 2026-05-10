"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = memo(({ content }: { content: string }) => {
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
              <code className="inline bg-zinc-700 text-zinc-100 px-1 rounded">
                {children}
              </code>
            )
          }

          return (
            <SyntaxHighlighter
              style={oneDark}
              language={match && match[1] || "text"}
              PreTag="div"
              wrapLongLines
              customStyle={{
                overflowX: "hidden",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxWidth: "100%",
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