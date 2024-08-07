import fs from "fs";
import path from "path";
import dayjs from "dayjs";
import matter from "gray-matter";
import readingTime from "reading-time";
import { sync } from "glob";

const BASE_PATH = "src/posts";
const POSTS_PATH = path.join(process.cwd(), BASE_PATH);

//모든 MDX 파일을 조회합니다.

export const getPostPaths = (category?: string) => {
  const folder = category || "**";
  const paths: string[] = sync(`${POSTS_PATH}/${folder}/**/*.mdx`);
  return paths.map((p) => p.split(path.sep).join(path.posix.sep));
  // 동일한형식으로 맥이든아니든
};
// MDX 파일 파싱 : abstract / detail 구분
const parsePost = async (postPath: string) => {
  const postAbstract = parsePostAbstract(postPath);

  const postDetail = await parsePostDetail(postPath);
  return { ...postAbstract, ...postDetail };
};
// MDX Abstract
// url, cg path, cg name, slug
export const parsePostAbstract = (postPath: string) => {
  // category1/title1/content
  // console.log(postPath.slice(9));

  const filePath = postPath.slice(postPath.indexOf(BASE_PATH)).replace(`${BASE_PATH}/`, "").replace(".mdx", "");

  // category1, title1
  const [category, slug] = filePath.split("/");

  // /blog/category1/title1
  const url = `/blog/${category}/${slug}`;

  return { url, category, slug };
};

// MDX Detail
const parsePostDetail = async (postPath: string) => {
  const file = fs.readFileSync(postPath, "utf8");
  const { data, content } = matter(file);
  const grayMatter = data;
  const readingMinutes = Math.ceil(readingTime(content).minutes);
  const dateString = dayjs(grayMatter.date).locale("ko").format("YYYY년 MM월 DD일");
  return { ...grayMatter, dateString, content, readingMinutes };
};

export const getCategoryPublicName = (dirPath: string) =>
  dirPath
    .split("_")
    .map((token) => token[0].toUpperCase() + token.slice(1, token.length))
    .join(" ");

const sortPostList = (PostList: any[]) => {
  return PostList.sort((a, b) => (a.date > b.date ? -1 : 1));
};

// 모든 포스트 목록 조회
export const getPostList = async (category?: string) => {
  const paths: string[] = getPostPaths(category);

  const posts = await Promise.all(
    paths.map((postPath) => {
      return parsePost(postPath);
    })
  );

  return posts;
};

export const getSortedPostList = async (category?: string) => {
  const postList = await getPostList(category);
  return sortPostList(postList);
};

export const getSitemapPostList = async () => {
  const postList = await getPostList();
  const baseUrl = "http://localhost:3000";
  const sitemapPostList = postList.map(({ url }) => ({
    lastModified: new Date(),
    url: `${baseUrl}${url}`,
  }));
  return sitemapPostList;
};

export const getAllPostCount = async () => (await getPostList()).length;

export const getCategoryList = () => {
  const cgPaths: string[] = sync(`${POSTS_PATH}/*`).map((p) => p.split(path.sep).join(path.posix.sep));

  const cgList = cgPaths.map((path) => path.split("/").slice(-1)?.[0]);

  return cgList;
};

export const getCategoryDetailList = async () => {
  const postList = await getPostList();
  const result: { [key: string]: number } = {};
  for (const post of postList) {
    const category = post.category;
    if (result[category]) {
      result[category] += 1;
    } else {
      result[category] = 1;
    }
  }
  const detailList: any[] = Object.entries(result).map(([category, count]) => ({
    dirName: category,
    publicName: getCategoryPublicName(category),
    count,
  }));

  return detailList;
};

// post 상세 페이지 내용 조회
export const getPostDetail = async (category: string, slug: string) => {
  const filePath = `${POSTS_PATH}/${category}/${slug}/content.mdx`;
  const detail = await parsePost(filePath);
  return detail;
};

export const parseToc = (content: string): any[] => {
  const regex = /^(##|###) (.*$)/gim;
  const headingList = content.match(regex);
  return (
    headingList?.map((heading: string) => ({
      text: heading.replace("##", "").replace("#", ""),
      link:
        "#" +
        heading
          .replace("# ", "")
          .replace("#", "")
          .replace(/[\[\]:!@#$/%^&*()+=,.]/g, "")
          .replace(/ /g, "-")
          .toLowerCase()
          .replace("?", ""),
      indent: (heading.match(/#/g)?.length || 2) - 2,
    })) || []
  );
};
