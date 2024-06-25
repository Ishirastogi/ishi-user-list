import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ListGroup,
  Spinner,
  Image,
  Alert,
  Col,
  Row,
  Pagination,
  Container,
  FormControl,
  InputGroup,
} from "react-bootstrap";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://602e7c2c4410730017c50b9d.mockapi.io/users"
        );
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = users.filter((user) =>
      `${user.profile.firstName} ${user.profile.lastName}`
        .toLowerCase()
        .includes(searchValue)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const renderPagination = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      pageNumbers.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </Pagination.Item>,
        <Pagination.Item
          key={2}
          active={2 === currentPage}
          onClick={() => handlePageChange(2)}
        >
          2
        </Pagination.Item>
      );

      if (currentPage > 3) {
        pageNumbers.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }

      const startPage = Math.max(3, currentPage - 1);
      const endPage = Math.min(totalPages - 2, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }

      pageNumbers.push(
        <Pagination.Item
          key={totalPages - 1}
          active={totalPages - 1 === currentPage}
          onClick={() => handlePageChange(totalPages - 1)}
        >
          {totalPages - 1}
        </Pagination.Item>,
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {pageNumbers}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (filteredUsers.length === 0) {
    return <Alert variant="info">No data to show</Alert>;
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <FormControl
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col md={4} className="mb-4">
          <ListGroup>
            {currentUsers.map((user, i) => (
              <ListGroup.Item
                key={user.id + i}
                onClick={() => handleUserClick(user)}
              >
                <Row className="align-items-center">
                  <Col xs={3}>
                    <Image
                      src={user.avatar}
                      roundedCircle
                      alt="Avatar"
                      width="50"
                      height="50"
                      className="me-2"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/150?text=${user.profile.firstName.slice(
                          0,
                          1
                        )}`; // Fallback to default image on error
                      }}
                    />
                  </Col>
                  <Col xs={9}>
                    <div>
                      <div>
                        {user.profile.firstName} {user.profile.lastName}
                      </div>
                      <small>{user.jobTitle}</small>
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mt-3">{renderPagination()}</div>
        </Col>
        <Col md={8}>
          {selectedUser ? (
            <div>
              <h4>
                {selectedUser.profile.firstName} {selectedUser.profile.lastName}
              </h4>
              <p>
                <strong>Username:</strong> {selectedUser.profile.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.profile.email}
              </p>
              <p>
                <strong>Job Title:</strong> {selectedUser.jobTitle}
              </p>
              <p>
                <strong>Bio:</strong> {selectedUser.Bio}
              </p>
              <Image
                src={selectedUser.avatar}
                alt="Avatar"
                rounded
                width="150"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/150?text=${selectedUser.profile.firstName.slice(
                    0,
                    1
                  )}`; // Fallback to default image on error
                }}
              />
            </div>
          ) : (
            <Alert variant="info">Select a user to see details</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserList;
