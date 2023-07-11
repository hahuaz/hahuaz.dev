export const metadata = {
  title: 'Hasan Biyik - Portfolio',
  description:
    'Explore my work in software development, web technologies, and programming languages.',
};

import { getPostMetadata } from '@/lib/post';
import ArticleCard from './ArticleCard';
import FeaturedVideo from './FeaturedVideo';

const HomePage = () => {
  const postMetadata = getPostMetadata();

  return (
    <>
      <div className='max-w-screen-xl mx-auto flex gap-20 mt-5'>
        <div className='max-w-2xl'>
          {postMetadata.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
        <div className='w-full'>
          <FeaturedVideo />
        </div>
      </div>
    </>
  );
};

export default HomePage;
