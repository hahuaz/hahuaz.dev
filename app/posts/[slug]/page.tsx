import { getPostMetadata, getPost } from '@/lib/post';

import CodeBlockHighlighter from './CodeBlockHighlighter';

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post) => ({
    slug: post.slug,
  }));
};

const PostPage = ({ params: { slug } }: any) => {
  const {
    content,
    data: { title, createdAt },
  } = getPost(slug);

  return (
    <main className='max-w-screen-xl mx-auto py-9 px-2'>
      <div className=''>
        <span className='text-sm text-github-white-comment'>{createdAt}</span>
        <h1 className=' text-3xl text-github-white-link pb-2 font-semibold'>
          {title}
        </h1>
      </div>
      <CodeBlockHighlighter content={content} />
    </main>
  );
};

export default PostPage;
