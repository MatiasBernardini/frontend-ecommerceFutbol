import axios from "../axios";
import React, { useRef, useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import "./Navigation.css";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart, FaBell } from "react-icons/fa";
import { logout, resetNotifications } from "../features/userSlice";

function Navigation() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  useEffect(() => {
    setNotificationsVisible(false);
  }, [user?.notifications]);

  function handleLogout() {
    dispatch(logout());
  }

  const unreadNotifications = user?.notifications?.reduce((acc, current) => {
    if (current.status === "unread") return acc + 1;
    return acc;
  }, 0);

  function handleToggleNotifications() {
    if (bellRef.current) {
      const position = bellRef.current.getBoundingClientRect();
      setBellPos(position);
    }

    setNotificationsVisible(!notificationsVisible);
    dispatch(resetNotifications());
    if (unreadNotifications > 0) axios.post(`/users/${user._id}/updateNotifications`);
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Ecomern</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            {user && !user.isAdmin && (
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart size={20} />
                  {user?.cart.count > 0 && (
                    <span className="badge badge-warning" id="cartcount">
                      {user.cart.count}
                    </span>
                  )}
                </Nav.Link>
              </LinkContainer>
            )}

            {user && (
              <>
                <Nav.Link style={{ position: "relative" }} onClick={handleToggleNotifications}>
                  <FaBell
                    ref={bellRef}
                    size={20}
                    style={{ position: "relative", cursor: "pointer" }}
                  />
                  {unreadNotifications > 0 && (
                    <span className="badge badge-warning" id="notification-count">
                      {unreadNotifications}
                    </span>
                  )}
                </Nav.Link>

                <NavDropdown title={`${user.email}`} id="basic-nav-dropdown">
                  {user.isAdmin && (
                    <>
                      <LinkContainer to="/admin">
                        <NavDropdown.Item>Tablero</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/new-product">
                        <NavDropdown.Item>Crear nuevo producto</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}

                  {!user.isAdmin && (
                    <>
                      <LinkContainer to="/cart">
                        <NavDropdown.Item>Carrito</NavDropdown.Item>
                      </LinkContainer>

                      <LinkContainer to="/orders">
                        <NavDropdown.Item>Mis Ordenes</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}

                  <NavDropdown.Divider />
                  <Button variant="Danger" onClick={handleLogout} className="logout-btn">
                    Logout
                  </Button>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {notificationsVisible && (
        <div
          className="notifications-container"
          ref={notificationRef}
          style={{
            position: "absolute",
            top: bellPos.top + 30,
            right: 0,
            display: notificationsVisible ? "block" : "none",
          }}
        >
          {user?.notifications.length > 0 ? (
            user?.notifications.map((notification, index) => (
              <p
                key={index}
                className={`notification-${notification.status}`}
                style={{ padding: "5px 10px" }}
              >
                {notification.message}
                <br />
                <span>{notification.time.split("T")[0] + " " + notification.time.split("T")[1]}</span>
              </p>
            ))
          ) : (
            <p>No Tienes Notificaciones</p>
          )}
        </div>
      )}
    </Navbar>
  );
}

export default Navigation;
