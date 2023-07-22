import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='navbar relative  text-github-white-link pb-24'>
      <div className='max-w-screen-xl mx-auto px-3 py-6'>
        <div className='flex flex-col gap-6'>
          <div className='flex gap-6 items-center'>
            <Link href='/'>
              <div className='p-1 relative gradient-animation w-48 h-48 rounded-full overflow-hidden flex '>
                <img
                  src='/avatar-focused.jpg'
                  alt='hasan biyik avatar'
                  className='rounded-full '
                />
              </div>
            </Link>
            <div>
              <p className='font-semibold text-2xl'>
                Hey there, I&apos;m Hasan Biyik.
              </p>
              <p className='font-normal text-base text-gray-400 '>
                Highly career-focused and committed to achieving success in my
                field.
              </p>
              <p>
                <span className='text-gray-400 '>$</span>{' '}
                <span className='cursor-animation'></span>
              </p>
            </div>
          </div>
          <div>
            <ul className='flex gap-3 text-sm items-center'>
              <div className='flex gap-2'>
                <a
                  href='https://github.com/hahuaz'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Image
                    src='/github.svg'
                    alt='Github Logo'
                    className='dark:invert '
                    width={30}
                    height={30}
                    priority
                  />
                </a>
                <a
                  href='https://www.linkedin.com/in/hasan-biyik-51046a116/'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Image
                    src='/linkedin.svg'
                    alt='Linkedin Logo'
                    className='dark:invert   '
                    width={30}
                    height={30}
                    priority
                  />
                </a>
              </div>

              <span>-</span>
              <a
                href='/hasan-biyik.pdf'
                target='_blank'
                rel='noreferrer'
                className='font-semibold   '
              >
                Resume
              </a>
              <span className=' text-xl'>|</span>
              <span>work.hahuaz@gmail.com</span>
            </ul>
          </div>
        </div>

        <div>
          <svg
            style={{
              '-webkit-filter': 'drop-shadow(0 0 20px #3be8b0)',
              filter: 'drop-shadow(0 0 20px #3be8b0)',
            }}
            className='waves block absolute bottom-0 left-0 overflow-hidden'
            viewBox='0 0 1440 80'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M0,40L21.8,32C43.6,24,87,8,131,16C174.5,24,218,56,262,56C305.5,56,349,24,393,24C436.4,24,480,56,524,56C567.3,56,611,24,655,24C698.2,24,742,56,785,64C829.1,72,873,56,916,56C960,56,1004,72,1047,56C1090.9,40,1135,0,1178,0C1221.8,0,1265,40,1309,56C1352.7,72,1396,64,1418,64L1440,72'
              strokeDasharray='1650'
              strokeDashoffset='1650'
              fill='none'
              strokeWidth='2px'
              stroke=' #3be8b0'
            >
              <animate
                attributeName='stroke-dashoffset'
                from='1650'
                to='0'
                dur='1.8s'
                fill='freeze'
                keySplines='.42,0,.58,1'
                calcMode='spline'
                keyTimes='0; 1'
              ></animate>
            </path>
          </svg>
        </div>
      </div>
    </div>
  );
}
