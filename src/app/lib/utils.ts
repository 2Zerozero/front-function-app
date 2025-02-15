// 페이지네이션 기능 계산 함수
export const calculatePagination = (
  totalItems: number, // 총 게시물 수
  currentPage: number, // 현재 페이지 번호
  itemsPerPage: number, // 한 페이지당 게시물 수
  buttonsPerPage: number // 화면에 보여질 페이지 버튼 개수
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // 총 페이지 수
  const currentSet = Math.ceil(currentPage / buttonsPerPage); // 현재 페이지 번호
  const startPage = (currentSet - 1) * buttonsPerPage + 1; // 현재 보여지는 버튼 시작 번호
  const endPage = Math.min(startPage + buttonsPerPage - 1, totalPages); // 현재 보여지는 버튼 끝 번호

  return {
    totalPages,
    currentSet,
    startPage,
    endPage,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: currentPage * itemsPerPage,
  };
};
