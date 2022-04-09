import { useState, useRef, useCallback } from 'react';

import useFetchDcardRepos from '../hooks/useFetchDcardRepos';

import { CircularProgress } from '@mui/material';

import RepoCard from '../components/repoCard';

const types = ['all', 'public', 'private', 'forks', 'sources', 'member', 'internal'];
const sorts = ['created', 'updated', 'pushed', 'full_name']
const directions = ['asc', 'desc'];

const Index = () => {
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('created');
  const [direction, setDirection] = useState('desc');

  const [page, setPage] = useState(1);

  const { reposData, loading, hasNext, error } = useFetchDcardRepos(page, sort, type, direction);


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

  const handleForm = (e) => {
    console.log("update form");
    setPage(1);
  }
  return (
    <main className="index" >
      <h1>Dcard Repos</h1>
      <header>
        <form onChange={handleForm}>
          <label>Type:
            <select value={type} className="dropdown" onChange={(e) => { setType(e.target.value) }}>{types.map((item) =>
              <option className="dropdown__item" key={'ditem-' + item}>{item}</option>
            )}</select>
          </label>
          <label>Sort:
            <select value={sort} className="dropdown" onChange={(e) => { setSort(e.target.value) }}>{sorts.map((item) =>
              <option className="dropdown__item" key={'ditem-' + item}>{item}</option>
            )}</select>
          </label>
          <label>Direction:
            <select value={direction} className="dropdown" onChange={(e) => { setDirection(e.target.value) }}>{directions.map((item) =>
              <option className="dropdown__item" key={'ditem-' + item}>{item}</option>
            )}</select>
          </label>
        </form>
      </header>
      <ul className="repo-list">{reposData.map((data, i) => <li className="repo-list__item" key={data.id}>
        {i + 1 === reposData.length ?
          <div style={{ border: "red" }} ref={lastCardRef}>
            <RepoCard {...data} />
          </div> :
          <RepoCard {...data} />}
      </li>)}</ul>
    </main >
  )
}

export default Index;