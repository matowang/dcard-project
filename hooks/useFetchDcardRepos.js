import { useEffect, useState, useRef } from "react"

const useFetchDcardRepos = (page, sort, type, direction) => {
    const [reposData, setReposData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const [error, setError] = useState(false);

    const fetchController = useRef();

    useEffect(() => {
        const fetchRepos = async () => {
            console.log("Fetching repos...")
            setLoading(true);

            if (fetchController.current) fetchController.current.abort();
            fetchController.current = new AbortController();

            const res = await fetch(`https://api.github.com/orgs/dcard/repos?type=${type}&sort=${sort}&page=${page}&direction=${direction}&per_page=10`, {
                headers: {
                    'accept': "application/vnd.github.v3+json",
                },
                signal: fetchController.current.signal
            });
            const fetchedRepos = await res.json();
            if (page === 1) {
                setReposData(fetchedRepos);
            } else {
                setReposData([...reposData, ...fetchedRepos]);
            }
            setHasNext(!!fetchedRepos.length);
            setLoading(false);
        }
        try {
            fetchRepos();
            setError(false);
        } catch (e) {
            console.error(e);
            setError(true);
        }
    }, [page, sort, type, direction]);
    return { reposData, loading, hasNext, error };
}

export default useFetchDcardRepos;