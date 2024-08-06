import { TPostCard } from "@/types/PostType";
import Link from "next/link";
import Image from "next/image";

export default function PostCard({ postdata }: { postdata: TPostCard }) {
  return (
    <Link href={postdata.url}>
      <li className="flex h-full flex-col gap-3 overflow-hidden rounded-md border shadow-md transition hover:shadow-xl dark:border-slate-700 dark:hover:border-white">
        <div className="relative aspect-video w-full rounded-t-md border-b">
          <Image
            src={postdata.thumbnail}
            alt={`thumbnail for ${postdata.title}`}
            sizes="(max-width: 1000px) 50vw, 450px"
            fill
            priority
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 pt-1">
          <div>
            <h2 className="mb-3 mt-1 text-lg font-bold sm:text-xl md:text-lg">{postdata.title}</h2>
          </div>
          <div className="flex justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span>{postdata.dateString}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{postdata.readingMinutes}분</span>
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
}
