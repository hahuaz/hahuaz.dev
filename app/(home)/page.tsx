export const metadata = {
  title: 'Hasan Biyik - Portfolio',
  description:
    'Explore my work in software development, web technologies, and programming languages.',
};

import { getPostMetadata } from '@/lib/post';
import { ArticleCard } from './ArticleCard';

const HomePage = () => {
  const postMetadata = getPostMetadata();

  return postMetadata.map((post) => <ArticleCard key={post.slug} {...post} />);
};

export default HomePage;
