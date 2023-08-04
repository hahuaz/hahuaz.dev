export const metadata = {
  title: "Hasan Biyik - Portfolio",
  description:
    "Explore my work in software development, web technologies, and programming languages.",
};

import { getPostMetadata } from "@/lib/post";
import ArticleCard from "./ArticleCard";
import FeaturedVideo from "./FeaturedVideo";

const HomePage = () => {
  const postMetadata = getPostMetadata();

  return (
    <>
      <div className="mx-auto mt-5 grid max-w-screen-xl grid-cols-1 justify-items-center gap-5 px-2 xl:grid-cols-2 xl:gap-20 xl:px-4 ">
        <div className="max-w-2xl ">
          {postMetadata.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
        <div className=" w-full max-w-2xl">
          <FeaturedVideo />
        </div>
      </div>
    </>
  );
};

export default HomePage;
