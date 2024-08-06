import PostCard from "@/components/PostCard";
import { getPostList } from "@/lib/post";
import { TPostCard } from "@/types/PostType";

export default async function PostListPage() {
  const postList: TPostCard[] = (await getPostList()) as TPostCard[];

  return (
    <section>
      {postList.map((post) => {
        return <PostCard postdata={post} key={post.title} />;
      })}
    </section>
  );
}
