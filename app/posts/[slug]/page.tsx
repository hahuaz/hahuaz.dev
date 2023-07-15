import { getPostMetadata, getPost, slugify } from '@/lib/post';

import CodeBlockHighlighter from './CodeBlockHighlighter';

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
      <div className='max-w-screen-xl mx-auto py-9 px-2 flex gap-10'>
        <main className='max-w-[80ch]'>
          <div className=''>
            <span className='text-sm text-github-white-comment'>
              {createdAt}
            </span>
            <h1 className=' text-3xl text-github-white-link pb-2 font-semibold'>
              {title}
            </h1>
          </div>
          <CodeBlockHighlighter content={content} />
        </main>
        <aside className='sticky self-start top-5 mt-5 text-gray-400 text-sm font-light max-w-[440px]'>
          <p className='mb-2'>CONTENTS</p>
          <ul className='border-l border-gray-400'>
            {headers.map(({ header, level }, index) => (
              <a key={index} href={`#${slugify(header)}`}>
                <li
                  className='mb-1 border-l-2 border-transparent hover:text-sky-400 hover:border-sky-400 hover:font-medium '
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
