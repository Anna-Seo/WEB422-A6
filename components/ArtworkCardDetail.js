import Card from 'react-bootstrap/Card'
import useSWR from 'swr'
import Error from 'next/error'
import { useAtom } from 'jotai'
import { favouritesAtom } from '@/store'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import { addToFavourites, removeFromFavourites } from '@/lib/userData'

export default function ArtworkCardDetail(objectID) {
    objectID = objectID.objectID;
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);
    useEffect(()=>{
        setShowAdded(favouritesList?.includes(objectID))
    }, [favouritesList])    

    async function favouritesClicked() {
        if(showAdded) {
            setFavouritesList(await removeFromFavourites(objectID));
            setShowAdded(false);
        }
        else {
            setFavouritesList(await addToFavourites(objectID));
            setShowAdded(true);
        }
    }

    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null, fetcher);
    if (error) {
        return <Error statusCode={404} />
    }
    if (data) {
        if(!data.artistWikidata_URL){
            return (
                <Card>
                    <Card.Img variant="top" src={data.primaryImage || "https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d"}/>
                    <Card.Body>
                        <Card.Title>{data.title || 'N/A'}</Card.Title>
                        <Card.Text>
                            <strong>Date: </strong>{data.objectDate || 'N/A'}<br/>
                            <strong>Classification: </strong>{data.classification || 'N/A'}<br/>
                            <strong>Medium: </strong>{data.medium || 'N/A'}<br/><br />
                            <strong>Artist: </strong>{data.artistDisplayName || 'N/A'}<br/>
                            <strong>Credit Line: </strong>{data.creditLine || 'N/A'}<br/>
                            <strong>Dimensions: </strong>{data.dimensions || 'N/A'}<br/>
                        </Card.Text>
                        <Button variant={showAdded? "primary":"outline-primary"} onClick={favouritesClicked}>{showAdded? "+ Favourite (added)":"+ Favourite"}</Button>
                    </Card.Body>
                </Card >
            );
        }
        else{
            return (
                <Card>
                    <Card.Img variant="top" src={data.primaryImage || "https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d"}/>
                    <Card.Body>
                        <Card.Title>{data.title || 'N/A'}</Card.Title>
                        <Card.Text>
                            <strong>Date: </strong>{data.objectDate || 'N/A'}<br/>
                            <strong>Classification: </strong>{data.classification || 'N/A'}<br/>
                            <strong>Medium: </strong>{data.medium || 'N/A'}<br/>
                            <br />
                            <br />
                            <strong>Artist: </strong>{data.artistDisplayName || 'N/A'} <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a><br/>
                            <strong>Credit Line: </strong>{data.creditLine || 'N/A'}<br/>
                            <strong>Dimensions: </strong>{data.dimensions || 'N/A'}<br/>
                        </Card.Text>
                        <Button variant={showAdded? "primary":"outline-primary"} onClick={favouritesClicked}>{showAdded? "+ Favourite (added)":"+ Favourite"}</Button>
                    </Card.Body>
                </Card >
            );
        }
    }
    else {
        return null;
    }
}