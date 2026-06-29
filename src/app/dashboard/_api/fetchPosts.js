const POSTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/posts`;

export async function fetchPosts() {
  const response = await fetch(POSTS_URL);
  console.log(POSTS_URL )
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
