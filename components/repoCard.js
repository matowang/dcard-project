import { Card, CardActions, Button, CardContent } from '@mui/material';

const RepoCard = ({ html_url, name, description, visibility, updated_at, created_at, pushed_at, stargazers_count }) => (
    <Card className="repo-card">
        <CardContent>
            <h2>{name}</h2>
            <p>{description}</p>
            <p>Visibility: {visibility}</p>
            <p>Created: {created_at.split('T')[0]}</p>
            <p>Updated: {updated_at.split('T')[0]}</p>
            <p>Pushed: {pushed_at.split('T')[0]}</p>
            <p>Stars: {stargazers_count}</p>
        </CardContent>
        <CardActions>
            <Button size="small" href={html_url} target="_blank">Link</Button>
        </CardActions>
    </Card>
)

export default RepoCard;