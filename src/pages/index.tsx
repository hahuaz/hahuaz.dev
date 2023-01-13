import { ArticleCard } from '../components';

import { articles } from '../assets';

export default function Home() {
  return (
    <div className="">
      {articles.map((article, i) => {
        return <ArticleCard key={i} {...article}></ArticleCard>;
      })}
    </div>
  );
}
