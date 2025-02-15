import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>프론트엔드 기능 개발</h1>

      <ul>
        <li>
          <Link href="/pagination">페이지네이션</Link>
        </li>
      </ul>
    </div>
  );
}
