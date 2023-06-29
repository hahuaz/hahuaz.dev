import Link from 'next/link';

export function ArticleCard({
  createdAt,
  title,
  summary,
  slug,
  tags,
  image,
}: any) {
  return (
    <>
      <div className='max-w-screen-md mx-auto'>
        <div className='flex gap-10 items-center pl-9 py-9'>
          <div>
            <div>
              <span className='text-sm text-github-white-comment'>
                {createdAt}
              </span>
              {tags.map((tag: string, i: number) => {
                return (
                  <span
                    key={i}
                    className='mx-2 rounded text-xs px-1 border border-github-white-comment bg-github-gray'
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <Link
              href={`/posts/${slug}`}
              className='inline-block text-2xl text-github-white-link'
            >
              {title}
            </Link>
            <p>{summary}</p>
          </div>
          <Link href={`/posts/${slug}`} className=''>
            <div className='h-40 w-40'>
              <img
                src={image}
                className='rounded-full object-cover h-40 w-40'
              ></img>
            </div>
          </Link>
        </div>
        <hr className='border-gray-600'></hr>
      </div>
    </>
  );
}
