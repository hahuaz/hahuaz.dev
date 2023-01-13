export const articles = [
  {
    createdAt: '2023-01-13',
    title: 'Mirror a website using wget',
    slug: 'mirror-a-website-using-wget',
    summary:
      'Wget is a command-line tool used to download files from the internet for offline viewing.',
    tags: ['docker'],
    image: '/article/wget.webp',
  },
];

const _slugify = (text: string) => {
  return text
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/_/g, '-') // Replace _ with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/-$/g, ''); // Remove trailing -
};
