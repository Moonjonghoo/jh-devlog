import CategoryList from "@/components/post_list/CategoryList";
import PostCard from "@/components/PostCard";
import { getAllPostCount, getCategoryDetailList, getPostList } from "@/lib/post";
import { TPostCard } from "@/types/PostType";

export default async function PostListPage({ category }: { category?: string }) {
  const categoryList = await getCategoryDetailList();
  const allPostCount = await getAllPostCount();
  const postList: TPostCard[] = (await getPostList()) as TPostCard[];
  console.log(categoryList, allPostCount);

  return (
    <section className="mx-auto mt-12 w-full max-w-[950px] px-4">
      <CategoryList allPostCount={allPostCount} categoryList={categoryList} currentCategory={category} />

      <section>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {postList.map((post) => (
            <PostCard key={post.url + post.date} postdata={post} />
          ))}
        </ul>
      </section>
    </section>
  );
}
