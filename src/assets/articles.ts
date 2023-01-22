export const articles = [
  {
    createdAt: '2023-01-22',
    title: 'Upload a file to S3 by using signed URL',
    slug: 'upload-a-file-to-s3-by-using-signed-url',
    summary:
      'Pre-signed URL can be used by clients to upload a file to an S3 bucket, without requiring the client to have AWS credentials or permission.',
    tags: ['cdk', 's3'],
    image: '/article/upload-a-file-to-s3-by-using-signed-url/upload.png',
  },
  {
    createdAt: '2023-01-16',
    title: 'Deploy SPA to AWS',
    slug: 'deploy-spa-to-aws',
    summary:
      'Deploying a Single Page Application (SPA) to Amazon Web Services (AWS) is a popular and powerful way to host your web app.',
    tags: ['cdk', 'ts'],
    image: '/article/deploy-spa-to-aws/aws-website-hosting.png',
  },
  {
    createdAt: '2023-01-13',
    title: 'Mirror a website using wget',
    slug: 'mirror-a-website-using-wget',
    summary:
      'Wget is a command-line tool used to download files from the internet for offline viewing.',
    tags: ['docker'],
    image: '/article/mirror-a-website-using-wget/wget.webp',
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
