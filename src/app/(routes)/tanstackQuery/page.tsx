'use client';

import React from 'react';
import { baseUrl } from '@/app/lib/api';
import { useQuery } from '@tanstack/react-query';

const TanStackQuery = () => {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch(baseUrl).then((response) => response.json()),
  });

  console.log(data);

  return (
    <div>
      <h1>TanStackQuery 연습해보기</h1>
    </div>
  );
};

export default TanStackQuery;
