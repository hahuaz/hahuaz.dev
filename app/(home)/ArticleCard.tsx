import Link from "next/link";

export default function ArticleCard({
  createdAt,
  title,
  summary,
  slug,
  tags,
  image,
}: any) {
  return (
    <>
      <div className="flex items-center justify-between gap-5 py-9 xl:gap-6">
        <div>
          <div>
            <span className="mr-2 text-sm text-github-white-comment">
              {createdAt}
            </span>
            {tags.map((tag: string, i: number) => {
              return (
                <span
                  key={i}
                  className="mx-1 rounded border border-github-white-comment bg-github-gray px-1 text-xs"
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <Link
            href={`/posts/${slug}`}
            className="inline-block text-2xl text-github-white-link"
          >
            {title}
          </Link>
          <p>{summary}</p>
        </div>
        <Link href={`/posts/${slug}`} className="">
          <div className="h-24 w-24  lg:h-32 lg:w-32">
            <img
              src={image}
              className="h-full w-full rounded-full object-cover"
              alt={slug}
            ></img>
          </div>
        </Link>
      </div>
      <hr className="border-gray-600"></hr>
    </>
  );
}
