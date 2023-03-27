import Card from 'react-bootstrap/Card';
import useSWR from 'swr';
import Error from 'next/error';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';

export default function ArtworkCard(objectID) {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID.objectID}`, fetcher);
    if(data){
        return <>
        <Card>
              <Card.Img variant="top" src={data.primaryImageSmall || "https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d"} />
              <Card.Body>
                <Card.Title>{data.title||'N/A'}</Card.Title>
                <Card.Text>
                    <strong>Date: </strong>{data.objectDate||'N/A'}<br/>
                    <strong>Classification: </strong>{data.classification||'N/A'}<br/>
                    <strong>Medium: </strong>{data.medium||'N/A'}<br/>
                </Card.Text>
                <Link href={'/artwork/' + data.objectID} passHref><Button variant="outline-secondary"><b>ID: </b>{data.objectID}</Button></Link>
              </Card.Body>
            </Card>
        </>
    }
    else if(error){
      return <Error statusCode={404} />
    }
    else {
        return null;
    }
}