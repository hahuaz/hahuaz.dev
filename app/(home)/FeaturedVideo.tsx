import React from 'react';

export default function FeaturedVideo() {
  return (
    <div className='my-4'>
      <h1 className='text-2xl text-github-white-link my-1'>Featured Video</h1>
      <iframe
        width='100%'
        height='400'
        src='https://www.youtube.com/embed/1GMROn7Wxsc?rel=0&showinfo=0&modestbranding=1'
        title='YouTube video player'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
      ></iframe>
    </div>
  );
}
