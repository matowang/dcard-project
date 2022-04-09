import { useEffect, useState, useRef } from "react"

const useFetchDcardRepos = (page, sort, type, direction) => {
    const [reposData, setReposData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);
    const [error, setError] = useState('');

    const storedFetches = useRef({});

    const fetchController = useRef();

    useEffect(() => {

        const fetchRepos = async () => {

            setLoading(true);

            if (fetchController.current) fetchController.current.abort();
            fetchController.current = new AbortController();

            try {
                let fetchedRepos;
                const queryKey = page + sort + type + direction;
                if (storedFetches.current[queryKey]) {
                    fetchedRepos = storedFetches.current[queryKey];
                    console.log("Using stored fetch...");
                } else {
                    console.log("Fetching repos...")
                    const res = await fetch(`https://api.github.com/orgs/dcard/repos?type=${type}&sort=${sort}&page=${page}&direction=${direction}&per_page=10`, {
                        headers: {
                            'accept': "application/vnd.github.v3+json",
                        },
                        signal: fetchController.current.signal
                    });
                    fetchedRepos = await res.json();
                    storedFetches.current[queryKey] = fetchedRepos;
                }
                if (page === 1) {
                    setReposData(fetchedRepos);
                } else {
                    setReposData([...reposData, ...fetchedRepos]);
                }
                setHasNext(!!fetchedRepos.length);
                setError('');
            } catch (e) {
                console.error(e);
                setError(e.toString());
            }
            setLoading(false);
        }

        fetchRepos();

    }, [page, sort, type, direction]);
    return { reposData, loading, hasNext, error };
}

export default useFetchDcardRepos;