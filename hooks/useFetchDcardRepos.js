import { useEffect, useState } from "react"

const useFetchDcardRepos = (page, sort, type, direction) => {
    const [reposData, setReposData] = useState([]);
    useEffect(() => {
        const fetchRepos = async () => {
            console.log(`https://api.github.com/orgs/dcard/repos?type=${type}&sort=${sort}&page=${page}&direction=${direction}&per_page=10`);
            console.log("Fetching repos...")
            const res = await fetch(`https://api.github.com/orgs/dcard/repos?type=${type}&sort=${sort}&page=${page}&direction=${direction}&per_page=10`, {
                headers: {
                    'accept': "application/vnd.github.v3+json",
                },
            });
            const fetchedRepos = await res.json();
            if (page === 1) {
                setReposData(fetchedRepos);
            } else {
                setReposData([...reposData, ...fetchedRepos]);
            }
        }
        fetchRepos()
            .catch(console.error);
    }, [page, sort, type, direction]);
    return [reposData];
}

export default useFetchDcardRepos;