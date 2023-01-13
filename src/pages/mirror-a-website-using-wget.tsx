import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function Article() {
  return (
    <>
      <main className="max-w-screen-xl mx-auto  py-9">
        <div className="[&>p]:max-w-screen-md [&>.code]:max-w-screen-md space-y-2">
          <span className="text-sm text-github-white-comment"> 2023-01-13</span>
          <h1 className=" text-3xl text-github-white-link pb-2 font-semibold">
            Mirror a website using wget
          </h1>
          <p>
            "wget" is a command-line utility used to download files from the
            internet. It supports HTTP, HTTPS, and FTP protocols and can be used
            to download single files, multiple files, or entire website.
          </p>{' '}
          <h3 className="text-lg font-semibold text-github-white-link !mt-8">
            # Spin up Docker
          </h3>
          <p>
            Docker allows for a consistent environment for applications to run
            in, regardless of the host operating system. This greatly reduces
            the risk of OS related errors. Head over to{' '}
            <a
              className="text-blue-400"
              target="_blank"
              href="https://docs.docker.com/get-docker/"
              rel="noreferrer"
            >
              docker.com
            </a>{' '}
            to install it.
          </p>{' '}
          <p>Open up your terminal and run following commands:</p>
          <SyntaxHighlighter
            language="javascript"
            style={codeStyle}
            className="code "
            wrapLines={true}
          >
            {`docker pull ubuntu \ndocker run -it ubuntu`}
          </SyntaxHighlighter>
          <p>
            The "docker pull ubuntu" will download the official Ubuntu image
            from the Docker hub to the local machine.
          </p>
          <p>
            "docker run -it ubuntu" will start a new container using this image.
          </p>
          <p>Execute following commands to install "wget":</p>
          <SyntaxHighlighter
            language="javascript"
            style={codeStyle}
            className="code my-2"
            wrapLines={true}
          >
            {`su \napt-get update \napt-get install wget \nwget --version`}
          </SyntaxHighlighter>
          <p>
            We used "su" command to become a superuser (root) and installed the
            library.
          </p>{' '}
          <h3 className="text-lg font-semibold text-github-white-link !mt-8">
            # Download entire website
          </h3>
          <p>We're ready to mirror the website. It's a very long command.</p>
          <SyntaxHighlighter
            language="javascript"
            style={codeStyle}
            className="code "
            wrapLines={true}
          >
            {`wget --recursive \\
--no-clobber \\
--content-disposition \\
--html-extension \\
--page-requisites \\
--convert-links \\
--restrict-file-names=windows \\
--directory-prefix wget-mirror \\
-e robots=off \\
--span-hosts \\
--domains cdn.shopify.com,uppercasebrands.com \\
https://uppercasebrands.com`}
          </SyntaxHighlighter>
          <p>Let's explain some important params in the above command:</p>
          <ul className="list-disc list-inside">
            <li>
              --recursive: Download the website recursively, i.e. follow all
              links on the website to download all the linked pages and
              resources.
            </li>
            <li>
              --restrict-file-names=windows: Modify file names so that they will
              work better on Windows systems. You can omit it if you're on
              different OS.
            </li>
            <li>
              --html-extension: Append .html extension to files of type
              text/html. This parameter is curicial. If you omit it, browser
              will download the pages when you click a link instead of routing
              them.
            </li>
            <li>
              --page-requisites: Download all files necessary to properly
              display the page, such as images, stylesheets, and scripts.
            </li>
            <li>
              --convert-links: Convert links in downloaded files to point to the
              local files, so that the website can be viewed offline.
            </li>
            <li>
              --directory-prefix wgetdownload: Save all files in a directory
              called "wgetdownload"
            </li>
            <li>
              --domains cdn.shopify.com,uppercasebrands.com : Only download
              files from the specified domains, even if other domains are linked
              to in the downloaded files.
            </li>
          </ul>
          <p>
            These are the params that I found most useful. You can visit{' '}
            <a
              className="text-blue-400"
              target="_blank"
              href="https://www.gnu.org/software/wget/manual/wget.html"
              rel="noreferrer"
            >
              gnu.org
            </a>{' '}
            to learn more.{' '}
          </p>
          <h3 className="text-lg font-semibold text-github-white-link !mt-8">
            # View the website offline
          </h3>
          <p>
            We'll zip the downloaded directory and copy it from container to our
            machine.
          </p>{' '}
          <p>Execute the following command in container:</p>
          <SyntaxHighlighter
            language="javascript"
            style={codeStyle}
            className="code  "
            wrapLines={true}
          >
            {`zip -r wget-mirror.zip wget-mirror`}
          </SyntaxHighlighter>
          <p>
            Then, open up a new terminal in your machine (not in Docker) and
            execute:
          </p>
          <SyntaxHighlighter
            language="javascript"
            style={codeStyle}
            className="code "
            wrapLines={true}
          >
            {`docker container ls`}
          </SyntaxHighlighter>
          <p>
            Above command will log your container ids. Select the appropriate
            one and use it on next command.
          </p>{' '}
          <SyntaxHighlighter
            language="javascript"
            style={codeStyle}
            className="code  "
            wrapLines={true}
          >
            {`docker cp <your-container-id>:/wget-mirror.zip .`}
          </SyntaxHighlighter>
          <p>
            You should be able to see wget-mirror directory in your folder. Go
            ahead and check all the files.
          </p>
        </div>
      </main>
    </>
  );
}
