'use client';

import { useState, useMemo } from 'react';
import { baseUrl } from '@/app/lib/api';
import { calculatePagination } from '@/app/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function PaginationPage() {
  const ITEMS_PER_PAGE = 5; // 한 페이지당 게시물 수
  const BUTTONS_PER_PAGE = 5; // 화면에 보여질 페이지 버튼 개수
  const [page, setPage] = useState(1); // 현재 페이지 번호

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => fetch(baseUrl).then((res) => res.json()),
  });

  const paginationInfo = useMemo(() => {
    // 총 게시물 수, 현재 페이지 번호, 한 페이지당 게시물 수, 화면에 보여질 페이지 버튼 개수를 인자로 전달
    return calculatePagination(posts.length, page, ITEMS_PER_PAGE, BUTTONS_PER_PAGE);
  }, [posts.length, page]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div className="flex flex-col gap-4 items-center p-4">
      <h1 className="text-2xl font-bold">페이지네이션 기능</h1>

      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {posts.slice(paginationInfo.startIndex, paginationInfo.endIndex).map((post) => (
          <div key={post.id} className="p-4 border rounded shadow">
            <h2 className="font-bold">
              {post.id}. {post.title}
            </h2>
            <p className="mt-2">{post.body}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {paginationInfo.currentSet > 1 && (
          <button
            onClick={() => setPage(paginationInfo.startPage - 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            &lt;
          </button>
        )}

        {Array.from({ length: paginationInfo.endPage - paginationInfo.startPage + 1 }, (_, i) => (
          <button
            key={paginationInfo.startPage + i}
            onClick={() => setPage(paginationInfo.startPage + i)}
            className={`px-3 py-1 rounded text-black ${
              page === paginationInfo.startPage + i ? 'bg-blue-500' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {paginationInfo.startPage + i}
          </button>
        ))}

        {paginationInfo.endPage < paginationInfo.totalPages && (
          <button
            onClick={() => setPage(paginationInfo.endPage + 1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
}
