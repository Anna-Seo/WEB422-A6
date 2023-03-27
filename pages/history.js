import { useAtom } from 'jotai'
import { searchHistoryAtom, favouritesAtom } from '@/store'
import { useRouter } from 'next/router'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Button } from 'react-bootstrap'
import styles from '../styles/History.module.css'
import { removeFromHistory } from '@/lib/userData'

export default function History() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    let parsedHistory = [];
    const router = useRouter();
    if(!favouritesList) return null;

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    function historyClicked(e, index) {
        e.preventDefault();
        router.push('/artwork?' + searchHistory[index]);
    }

    async function removeHistoryClicked(e, index) {
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]));
    }

    if (parsedHistory.length > 0) {
        return <>
            <ListGroup>
                {parsedHistory.map((historyItem, index) => (
                    <ListGroup.Item key={index} onClick={e => historyClicked(e, index)} className={styles.historyItem}>
                        {
                            Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))
                        }
                        <Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    }
    else {
        return (
            <Card>
                <Card.Body>
                    <h4>Nothing Here</h4> Try searching for some artwork.
                </Card.Body>
            </Card>
        )
    }
}