// https://github.com/vercel/swr/blob/bad51f61bf54166abcb0f2a424eafda88157a6ab/examples/basic-typescript/libs/fetch.ts
export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}
