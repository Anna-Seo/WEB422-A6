import { Container, Nav, Navbar, Form, Button, NavDropdown } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { searchHistoryAtom } from '@/store'
import { useAtom } from 'jotai'
import Link from 'next/link'
import { addToHistory } from '@/lib/userData'
import { readToken, removeToken } from '@/lib/authenticate'

export default function MainNav() {
    const [searchField, setSearchField] = useState("");
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    var [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    var queryString = "";
    let token = readToken();

    async function submitForm(e) {
        e.preventDefault();
        setIsExpanded(false);
        router.push('/artwork?title=true&q=' + searchField);
        queryString = 'title=true&q=' + searchField;
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
    }

    function logout() {
        setIsExpanded(false);
        removeToken();
        router.push('/login');
    }

    return <>
        <Navbar className="fixed-top" expand="lg" bg="dark" variant="dark" expanded={isExpanded}>
            <Container>
                <Navbar.Brand>Anna Seo</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={()=>setIsExpanded(e => !e)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link href="/" passHref legacyBehavior ><Nav.Link active={router.pathname === "/"} onClick={()=>setIsExpanded(false)}>Home</Nav.Link></Link>
                        {token && <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} onClick={()=>setIsExpanded(false)}>Advanced Search</Nav.Link></Link>}
                    </Nav>
                    {
                        !token &&
                        <Nav>
                            <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} onClick={()=>setIsExpanded(false)}>Register</Nav.Link></Link>
                            <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={()=>setIsExpanded(false)}>Login</Nav.Link></Link>
                        </Nav>
                    }     
                    &nbsp;
                    {
                        token &&
                        <Form className="d-flex" onSubmit={submitForm}>
                            <Form.Control type="search" placeholder="Search" value={searchField} onChange={(e) => setSearchField(e.target.value)} />
                            &nbsp;
                            &nbsp;
                            <Button type="submit" className="btn btn-success">Search</Button>
                        </Form>
                    }
                    &nbsp;
                    {
                        token &&
                        <Nav>
                            <NavDropdown title={token.userName}>
                                <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item onClick={()=>setIsExpanded(false)}>Favourites</NavDropdown.Item></Link>
                                <Link href="/history" passHref legacyBehavior><NavDropdown.Item onClick={()=>setIsExpanded(false)}>Search History</NavDropdown.Item></Link>
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <br />
        <br />
    </>;
}