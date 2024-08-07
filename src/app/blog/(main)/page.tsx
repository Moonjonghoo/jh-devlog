import PostCard from "@/components/PostCard";
import { getPostList } from "@/lib/post";
import { TPostCard } from "@/types/PostType";

export default async function PostListPage() {
  const postList: TPostCard[] = (await getPostList()) as TPostCard[];

  return (
    <section>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {postList.map((post) => {
          return <PostCard postdata={post} key={post.title} />;
        })}
      </ul>
    </section>
  );
}
