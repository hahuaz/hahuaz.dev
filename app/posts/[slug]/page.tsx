import { getPostMetadata, getPost, slugify } from "@/lib/post";

import CodeBlockHighlighter from "./CodeBlockHighlighter";

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

const PostPage = ({ params: { slug } }: any) => {
  const {
    data: { title, createdAt },
    content,
    headers,
  } = getPost(slug);

  return (
    <>
      <div className="mx-auto flex max-w-screen-xl gap-10 px-2 py-9 children:border children:border-red-500">
        <main className="max-w-[80ch]">
          <div className="">
            <span className="text-sm text-github-white-comment">
              {createdAt}
            </span>
            <h1 className=" pb-2 text-3xl font-semibold text-github-white-link">
              {title}
            </h1>
          </div>
          <CodeBlockHighlighter content={content} />
        </main>
        <aside className="sticky top-5 mt-5 hidden max-w-[440px] self-start text-sm font-light text-gray-400 ">
          <p className="mb-2">CONTENTS</p>
          <ul className="border-l border-gray-400">
            {headers.map(({ header, level }, index) => (
              <a key={index} href={`#${slugify(header)}`}>
                <li
                  className="mb-1 border-l-2 border-transparent hover:border-sky-400 hover:font-medium hover:text-sky-400 "
                  style={{ paddingLeft: `${(level - 1) * 10}px` }}
                >
                  {header}
                </li>
              </a>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
};

export default PostPage;
