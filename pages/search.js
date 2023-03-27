import { Row, Col, Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { searchHistoryAtom } from '@/store';
import { useAtom } from 'jotai'
import { addToHistory } from '@/lib/userData';

export default function AdvancedSearch() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            searchBy: 'title',
            geoLocation: '',
            medium: '',
            isOnView: '',
            isHighlight: '',
            q: ''
        },
    });

    const router = useRouter();
    var queryString = "";
    async function submitForm(data) {
        queryString += `${data.searchBy}=true`;
        if (data.geoLocation) {
            queryString += `&geoLocation=${data.geoLocation}`;
        }
        if (data.medium) {
            queryString += `&medium=${data.medium}`;
        }
        queryString += `&isOnView=${data.isOnView}&isHighlight=${data.isHighlight}&q=${data.q}`;
        router.push('/artwork?' + queryString);
        setSearchHistory(await addToHistory(queryString));
    }

    const watchq = watch("q");
    function watchQ() {
        if(watchq == '') {
            const element = document.getElementById('q');
            element.classList.add('is-invalid');
        }
    }

    return <>
        <Form onSubmit={handleSubmit(submitForm)}>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Search Query</Form.Label>
                        <Form.Control type="text" id="q" placeholder="" name="q" {...register('q')} required/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Form.Label>Search By</Form.Label>
                    <Form.Select name="searchBy" className="mb-3 form-select" defaultValue={"title"} {...register('searchBy')}>
                        <option value="title">Title</option>
                        <option value="tags">Tags</option>
                        <option value="artistOrCulture">Artist or Culture</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Geo Location</Form.Label>
                        <Form.Control type="text" placeholder="" name="geoLocation" {...register('geoLocation')}/>
                        <Form.Text className="text-muted">
                            Case Sensitive String (ie &quot;Europe&quot;, &quot;France&quot;, &quot;Paris&quot;, &quot;China&quot;, &quot;New York&quot;, etc.), with multiple values separated by the | operator
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Medium</Form.Label>
                        <Form.Control type="text" placeholder="" name="medium" {...register('medium')}/>
                        <Form.Text className="text-muted">
                            Case Sensitive String (ie: &quot;Ceramics&quot;, &quot;Furniture&quot;, &quot;Paintings&quot;, &quot;Sculpture&quot;, &quot;Textiles&quot;, etc.), with multiple values separated by the | operator
                        </Form.Text>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Check
                        type="checkbox"
                        label="Highlighted"
                        name="isHighlight"
                        {...register('isHighlight')}
                    />
                    <Form.Check
                        type="checkbox"
                        label="Currently on View"
                        name="isOnView"
                        {...register('isOnView')}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <br />
                    <Button variant="secondary" type="submit" onClick={watchQ}>
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
    </>
}