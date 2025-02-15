'use client';

import React, { useEffect, useState } from 'react';

// 페이지네이션 API 주소
const baseUrl = 'https://jsonplaceholder.typicode.com/posts';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Pagination = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);

  const totalPosts = posts.length; // 총 게시글 수
  const pageRange = 5; // 한 페이지당 게시물 수
  const btnRange = 5; // 화면에 보여질 페이지 버튼 개수

  const startPost = (page - 1) * pageRange + 1; // 시작 게시물 번호
  const endPost = startPost + pageRange - 1; // 끝 게시물 번호

  const currentSet = Math.ceil(page / btnRange); // 현재 페이지 번호
  const totalSet = Math.ceil(Math.ceil(totalPosts / pageRange) / btnRange); // 전체 버튼 세트 수
  const startPage = (currentSet - 1) * btnRange + 1; // 현재 보여지는 버튼 시작 번호
  const endPage = startPage + btnRange - 1; // 현재 보여지는 버튼 끝 번호

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  console.log('currentSet', currentSet);
  console.log('startPage', startPage);
  console.log('endPage', endPage);
  console.log('startPost', startPost);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1>페이지네이션 기능</h1>

      {/* 게시글 목록 */}
      <div className="flex flex-col gap-4">
        {posts.slice(startPost - 1, endPost).map((post) => (
          <div key={post.id}>
            <h2>
              {post.id}. {post.title}
            </h2>
            <p>{post.body}</p>
          </div>
        ))}
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex gap-2">
        {currentSet > 1 && <button onClick={() => setPage(startPage - 1)}>&lt;</button>}
        {Array(btnRange)
          .fill(startPage)
          .map((_, i) => {
            return (
              <button
                key={i}
                onClick={() => setPage(startPage + i)}
                className={`${page === startPage + i ? 'bg-blue-500' : 'bg-gray-300'} w-6 h-6`}
              >
                {startPage + i}
              </button>
            );
          })}
        {currentSet < totalSet && <button onClick={() => setPage(endPage + 1)}>&gt;</button>}
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

https://www.datoybi.com/pagination/
*/

/*
페이지네이션 버튼 생성 코드 풀이

1. Array(btnRange)
   - btnRange = 5 일 때,
   - [undefined, undefined, undefined, undefined, undefined]

2. fill(startPage)
   - [1, 1, 1, 1, 1]

3. map((_, i) => { {startPage + i} }
   - [1, 2, 3, 4, 5] 

풀어서 for 문으로 볼 때,
function createPageNumbers(startPage: number, btnRange: number) {
    // 결과를 담을 빈 배열 생성
    const result: number[] = [];
    
    // btnRange(5)만큼 반복
    for (let i = 0; i < btnRange; i++) {
        // startPage에 i를 더한 값을 배열에 추가
        const pageNumber = startPage + i;
        result.push(pageNumber);
        
        console.log(`
        반복 ${i + 1}번째:
        - i 값: ${i}
        - 계산: ${startPage} + ${i} = ${pageNumber}
        - 현재 배열: [${result}]
        `);
    }
    
    return result;
}
*/
