import { useState } from 'react';

import useFetchDcardRepos from '../hooks/useFetchDcardRepos';
import useNextPageOnView from '../hooks/useNextPageOnView';

import { CircularProgress, LinearProgress } from '@mui/material';

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

  const handleForm = () => {
    setPage(1);
  }

  const { lastCardRef } = useNextPageOnView(setPage, hasNext, loading);


  return (
    <main className="index" >
      {loading && page === 1 && <div className="linear-progress-container"><LinearProgress /></div>}
      <header className="header">
        <h1>Dcard Repos</h1>
        <form className="header__form" onChange={handleForm}>
          <label className="dropdown-label" >Type:
            <select value={type} className="dropdown"
              onChange={(e) => { setType(e.target.value) }}>{types.map((item) =>
                <option className="dropdown__item" key={'ditem-' + item}>{item}</option>
              )}</select>
          </label>
          <label className="dropdown-label">Sort:
            <select value={sort} className="dropdown"
              onChange={(e) => { setSort(e.target.value) }}>{sorts.map((item) =>
                <option className="dropdown__item" key={'ditem-' + item}>{item}</option>
              )}</select>
          </label>
          <label className="dropdown-label">Direction:
            <select value={direction} className="dropdown"
              onChange={(e) => { setDirection(e.target.value) }}>{directions.map((item) =>
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
      {!error && !loading && !reposData.length && <p>No Repos to show</p>}
      {error && <p className="error-message">ERROR: {error}</p>}
      {loading && <div className="circular-progress-container"><CircularProgress /></div>}
    </main >
  )
}

export default Index;