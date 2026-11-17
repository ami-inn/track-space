'use client';

import dynamic from 'next/dynamic';

//dynamic import for FriendMap component to disable server-side rendering

const FriendMap = dynamic(() => import('./FriendMap'), { ssr: false });

export default function Page() {
  return <FriendMap />;
}