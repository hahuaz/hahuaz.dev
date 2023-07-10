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
      <div className='max-w-screen-md mx-auto'>
        <FeaturedVideo />
        {postMetadata.map((post) => (
          <ArticleCard key={post.slug} {...post} />
        ))}
      </div>
    </>
  );
};

export default HomePage;
