'use client';

import React, { useEffect, useState, useMemo } from 'react';

// 페이지네이션 API 주소
const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Pagination = () => {
  // 1. 상수값들은 컴포넌트 외부로 분리
  const ITEMS_PER_PAGE = 5; // 한 페이지당 게시물 수
  const BUTTONS_PER_PAGE = 5; // 화면에 보여질 페이지 버튼 개수

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);

  // 2. 계산 로직을 useMemo로 최적화
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE); // 총 페이지 수
    const currentSet = Math.ceil(page / BUTTONS_PER_PAGE); // 현재 페이지 번호
    const startPage = (currentSet - 1) * BUTTONS_PER_PAGE + 1; // 현재 보여지는 버튼 시작 번호
    const endPage = Math.min(startPage + BUTTONS_PER_PAGE - 1, totalPages); // 현재 보여지는 버튼 끝 번호

    return {
      totalPages,
      currentSet,
      startPage,
      endPage,
      startPost: (page - 1) * ITEMS_PER_PAGE,
      endPost: page * ITEMS_PER_PAGE,
    };
  }, [posts.length, page]);

  // 3. 에러 상태 관리 추가
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 4. 페이지 변경 핸들러 분리
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1>페이지네이션 기능</h1>

      {/* 게시글 목록 */}
      <div className="flex flex-col gap-4">
        {posts.slice(paginationInfo.startPost, paginationInfo.endPost).map((post) => (
          <div key={post.id} className="p-4 border rounded">
            <h2 className="font-bold">
              {post.id}. {post.title}
            </h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex gap-2">
        {paginationInfo.currentSet > 1 && (
          <button onClick={() => handlePageChange(paginationInfo.startPage - 1)} className="px-2 py-1 border rounded">
            &lt;
          </button>
        )}

        {Array.from({ length: paginationInfo.endPage - paginationInfo.startPage + 1 }, (_, i) => (
          <button
            key={paginationInfo.startPage + i}
            onClick={() => handlePageChange(paginationInfo.startPage + i)}
            className={`
              px-2 py-1 rounded text-black w-10 h-10
              ${page === paginationInfo.startPage + i ? 'bg-blue-500' : 'bg-gray-200'}
            `}
          >
            {paginationInfo.startPage + i}
          </button>
        ))}

        {paginationInfo.endPage < paginationInfo.totalPages && (
          <button onClick={() => handlePageChange(paginationInfo.endPage + 1)} className="px-2 py-1 border rounded">
            &gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;

/* 
페이지네이션에서 Math.ceil()을 사용하는 이유:

Math.ceil()은 소수점을 올림하는 함수.
예를 들어, 100개의 게시글을 5개씩 보여줄 때, 총 페이지는 20개입니다.
하지만 19페이지까지는 게시글이 4개씩 보여지고, 20페이지에는 1개의 게시글만 보여집니다.

이런 경우를 위해 Math.ceil()을 사용합니다.
Math.ceil()을 사용하면 총 페이지는 20개가 되고, 각 페이지에는 5개씩 게시글이 보여집니다.
*/

/*
useMemo 사용 이유

1. 계산 로직을 최적화하기 위해
2. 불필요한 리렌더링 방지
3. 성능 최적화

useMemo는 컴포넌트가 리렌더링될 때 특정 값이 변경되지 않았다면 이전에 계산한 값을 재사용합니다.
이렇게 하면 불필요한 계산을 방지하고 성능을 향상시킬 수 있습니다.
*/
