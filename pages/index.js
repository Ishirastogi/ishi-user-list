import Head from "next/head";
import { Container, Navbar } from "react-bootstrap";
import UserList from "../components/UserList";

const Home = () => {
  return (
    <div>
      <Head>
        <title>NEXTJS Task 2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">NEXTJS Task 2 - User List</Navbar.Brand>
          <Navbar.Text className="ms-auto">
            Assignment submitted by Ishi Rastogi
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container>
        <h1 className="mt-4">Users</h1>
        <UserList />
      </Container>
    </div>
  );
};

export default Home;
