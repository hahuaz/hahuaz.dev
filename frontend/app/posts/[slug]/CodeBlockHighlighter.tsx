"use client";

import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  cb as terminalStyle,
  vscDarkPlus as codeStyle,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import styles from "./post.module.css";

const CodeBlock = (props: any) => {
  // console.log('pre tag:', props);
  const { children } = props;
  // Check if children type is a <code> tag
  if (children?.type !== "code") {
    return <pre>{children}</pre>;
  }

  // console.log(children.props);
  // Get className prop from <code> tag
  const { className, children: codeSnippet } = children.props;
  // console.log(className);

  // access file name
  let filename;
  const definedClassNames = Object.keys(children.props);
  definedClassNames.forEach((key) => {
    if (key.startsWith("filename-") && definedClassNames.includes("ts")) {
      filename = key.replace("filename-", "");
      filename = `${filename}.ts`;
    }
  });

  let language;
  if (className === "lang-ts") {
    language = "typescript";
  } else if (className === "lang-js") {
    language = "javascript";
  } else if (className === "lang-html") {
    language = "html";
  } else if (className === "lang-css") {
    language = "css";
  } else if (className === "lang-json") {
    language = "json";
  } else {
    language = "bash";
  }

  if (language === "bash") {
    return (
      <>
        <span className="inline-block rounded-t-md bg-zinc-700 px-2 py-1 text-xs">
          terminal
        </span>
        <SyntaxHighlighter
          language={language}
          style={terminalStyle}
          customStyle={{
            marginTop: "0",
            borderTopLeftRadius: "0",
          }}
          className={"code " + styles.bash}
          wrapLines={true}
        >
          {codeSnippet}
        </SyntaxHighlighter>
      </>
    );
  }

  return (
    <>
      {filename && (
        <span className="inline-block rounded-t-md bg-zinc-700 px-2 py-1 text-xs">
          {filename}
        </span>
      )}
      <SyntaxHighlighter
        language={language}
        style={codeStyle}
        className={"code "}
        wrapLines={true}
        customStyle={
          filename ? { marginTop: "0", borderTopLeftRadius: "0" } : undefined
        }
      >
        {codeSnippet}
      </SyntaxHighlighter>
    </>
  );
};

const CodeBlockHighlighter = ({ content }: any) => {
  return (
    <>
      <article className="prose !max-w-full dark:prose-invert">
        <Markdown
          options={{
            // override html tag rendering
            overrides: {
              pre: CodeBlock,
            },
          }}
        >
          {content}
        </Markdown>
      </article>
    </>
  );
};
export default CodeBlockHighlighter;
