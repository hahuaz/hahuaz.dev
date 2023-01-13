import { GithubSvg } from '../assets';
export function Navbar() {
  return (
    <div className="bg-github-gray text-github-white-link">
      <div className="max-w-screen-xl mx-auto px-3 py-3">
        <div className="flex justify-between items-center">
          <div className="">
            <span className="font-semibold text-lg">&gt;</span>{' '}
            <span className="font-semibold">Hasan Biyik</span>
            <span className="cursor-animation"></span>
          </div>
          <div>
            <ul className="flex gap-3 text-sm items-center">
              <a href="https://github.com/hahuaz">
                <GithubSvg fill="white"></GithubSvg>
              </a>
              <span>-</span>
              <a href="/hasan-biyik.pdf" className="font-semibold">
                Resume
              </a>
              <span className="mb-1 text-xl">|</span>
              <span>work.hahuaz@gmail.com</span>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
