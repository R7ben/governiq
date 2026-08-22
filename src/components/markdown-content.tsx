"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h4 className="text-base font-semibold text-zinc-100 mt-4 mb-2 first:mt-0">{children}</h4>
  ),
  h2: ({ children }) => (
    <h4 className="text-sm font-semibold text-zinc-100 mt-4 mb-2 first:mt-0">{children}</h4>
  ),
  h3: ({ children }) => (
    <h5 className="text-sm font-semibold text-zinc-200 mt-3 mb-1.5 first:mt-0">{children}</h5>
  ),
  p: ({ children }) => (
    <p className="text-sm text-zinc-300 leading-relaxed mb-3 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-zinc-200">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-emerald-400 hover:underline underline-offset-2"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-5 text-sm text-zinc-300 space-y-1 mb-3">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-5 text-sm text-zinc-300 space-y-1 mb-3">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  hr: () => <hr className="border-zinc-800 my-4" />,
  code: ({ children }) => (
    <code className="rounded bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="rounded-md bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto text-xs font-mono text-zinc-300 mb-3">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="w-full overflow-x-auto rounded-md border border-zinc-800 mb-3">
      <table className="min-w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-zinc-900/50">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-zinc-800">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-sm text-zinc-300 tabular-nums align-top">{children}</td>
  ),
};

interface Props {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
