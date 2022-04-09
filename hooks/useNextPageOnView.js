import { useCallback, useRef } from 'react';

const useNextPageOnView = (setPage, hasNext, loading) => {
    const observer = useRef();
    const lastCardRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNext) {
                setPage(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [hasNext, loading])
    return { lastCardRef };
}

export default useNextPageOnView;