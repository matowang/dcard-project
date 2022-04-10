import { useEffect, useState, useRef } from "react"

const useFetchDcardRepos = (page, sort, type, direction) => {
    const [reposData, setReposData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasNext, setHasNext] = useState(true);
    const [error, setError] = useState('');

    //Used when user uses same query from the past to prevent refetching
    const storedFetches = useRef({});

    const fetchController = useRef();

    //set empty with new query
    useEffect(() => {
        setReposData([]);
    }, ([sort, type, direction]));

    useEffect(() => {

        const fetchRepos = async () => {

            setLoading(true);

            //Abort previous fetch when new query comes
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

                    if (fetchedRepos.constructor.name !== 'Array') throw 'Rate Limit Exceeded';
                    storedFetches.current[queryKey] = fetchedRepos;
                }

                setReposData(prevReposData => [...prevReposData, ...fetchedRepos]);
                setHasNext(!!fetchedRepos.length);
                setError('');
            } catch (e) {
                if (e.name === 'AbortError') return
                console.error(e);
                setError(e.toString());
            }
            setLoading(false);
            return () => fetchController.current.abort();
        }

        fetchRepos();

    }, [page, sort, type, direction]);
    return { reposData, loading, hasNext, error };
}

export default useFetchDcardRepos;