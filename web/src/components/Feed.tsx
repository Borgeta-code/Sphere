"use client";

import { FeedProvider } from "@/context/FeedContext";
import { User } from "@/types/User";

import { NewPost } from "./NewPost";
import PostsList from "./PostsList";

export default function Feed({ user }: { user: User }) {
  return (
    <FeedProvider>
      <div className="w-full h-full flex flex-1 flex-col items-center gap-6 pb-8 mt-24">
        <NewPost user={user} />
        <PostsList user={user} />
      </div>
    </FeedProvider>
  );
}
