'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ModalMenuSlider() {
  const [showNav, setShowNav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const closeNavbar = (e: MouseEvent) => {
      if (
        showNav &&
        e.target !== toggleRef.current &&
        !toggleRef.current?.contains(e.target as Node) &&
        e.target !== navbarRef.current &&
        !navbarRef.current?.contains(e.target as Node)
      ) {
        setShowNav(false);
      }
    };

    if (showNav) {
      document.body.addEventListener('click', closeNavbar);
    }

    return () => {
      document.body.removeEventListener('click', closeNavbar);
    };
  }, [showNav]);

  const handleToggleNav = () => {
    setShowNav(!showNav);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Lato&display=swap');

        :root {
          --modal-duration: 1s;
          --primary-color: #30336b;
          --secondary-color: #be2edd;
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: 'Lato', sans-serif;
          margin: 0;
          transition: transform 0.3s ease;
        }

        body.show-nav {
          transform: translateX(200px);
        }

        nav {
          background-color: var(--primary-color);
          border-right: 2px solid rgba(200, 200, 200, 0.1);
          color: #fff;
          position: fixed;
          top: 0;
          left: 0;
          width: 200px;
          height: 100%;
          z-index: 100;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        nav.show-nav {
          transform: translateX(0);
        }

        nav .logo {
          padding: 30px 0;
          text-align: center;
        }

        nav .logo img {
          height: 75px;
          width: 75px;
          border-radius: 50%;
        }

        nav ul {
          padding: 0;
          list-style-type: none;
          margin: 0;
        }

        nav ul li {
          border-bottom: 2px solid rgba(200, 200, 200, 0.1);
          padding: 20px;
        }

        nav ul li:first-of-type {
          border-top: 2px solid rgba(200, 200, 200, 0.1);
        }

        nav ul li a {
          color: #fff;
          text-decoration: none;
        }

        nav ul li a:hover {
          text-decoration: underline;
        }

        header {
          background-color: var(--primary-color);
          color: #fff;
          font-size: 130%;
          position: relative;
          padding: 40px 15px;
          text-align: center;
        }

        header h1 {
          margin: 0;
        }

        header p {
          margin: 30px 0;
        }

        button,
        input[type='submit'] {
          background-color: var(--secondary-color);
          border: 0;
          border-radius: 5px;
          color: #fff;
          cursor: pointer;
          padding: 8px 12px;
        }

        button:focus {
          outline: none;
        }

        .toggle {
          background-color: rgba(0, 0, 0, 0.3);
          position: absolute;
          top: 20px;
          left: 20px;
        }

        .cta-btn {
          padding: 12px 30px;
          font-size: 20px;
        }

        .container {
          padding: 15px;
          margin: 0 auto;
          max-width: 100%;
          width: 800px;
        }

        .modal-container {
          background-color: rgba(0, 0, 0, 0.6);
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 200;
        }

        .modal-container.show-modal {
          display: block;
        }

        .modal {
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          position: absolute;
          overflow: hidden;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          width: 400px;
          animation-name: modalopen;
          animation-duration: var(--modal-duration);
        }

        .modal-header {
          background: var(--primary-color);
          color: #fff;
          padding: 15px;
        }

        .modal-header h3 {
          margin: 0;
          border-bottom: 1px solid #333;
        }

        .modal-content {
          padding: 20px;
        }

        .modal-form div {
          margin: 15px 0;
        }

        .modal-form label {
          display: block;
          margin-bottom: 5px;
        }

        .modal-form .form-input {
          padding: 8px;
          width: 100%;
        }

        .close-btn {
          background: transparent;
          font-size: 25px;
          position: absolute;
          top: 0;
          right: 0;
        }

        @keyframes modalopen {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className={showNav ? 'show-nav' : ''}>
        <nav ref={navbarRef} className={showNav ? 'show-nav' : ''}>
          <div className="logo">
            <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="user" />
          </div>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact Me</a></li>
          </ul>
        </nav>

        <header>
          <button
            ref={toggleRef}
            className="toggle"
            onClick={handleToggleNav}
            aria-label="Toggle navigation"
          >
            <i className="fa fa-bars fa-2x">☰</i>
          </button>

          <h1>My Landing Page</h1>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, amet!
          </p>

          <button className="cta-btn" onClick={handleOpenModal}>
            Sign Up
          </button>
        </header>

        <div className="container">
          <h2>What is this landing page about?</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia iure
            accusamus ab consectetur eos provident ipsa est perferendis architecto.
            Provident, quaerat asperiores. Quo esse minus repellat sapiente, impedit
            obcaecati necessitatibus.
          </p>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente optio
            officia ipsa. Cum dignissimos possimus et non provident facilis saepe!
          </p>

          <h2>Tell Me More</h2>

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat eaque
            delectus explicabo qui reprehenderit? Aspernatur ad similique minima
            accusamus maiores accusantium libero autem iusto reiciendis ullam
            impedit esse quibusdam, deleniti laudantium rerum beatae, deserunt nemo
            neque, obcaecati exercitationem sit. Earum.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Lifetime Access</li>
            <li>30 Day Money Back</li>
            <li>Tailored Customer Support</li>
          </ul>

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse quam
            nostrum, fugiat, itaque natus officia laborum dolorum id accusantium
            culpa architecto tenetur fuga? Consequatur provident rerum eius ratione
            dolor officiis doloremque minima optio dignissimos doloribus odio
            debitis vero cumque itaque excepturi a neque, expedita nulla earum
            accusamus repellat adipisci veritatis quam. Ipsum fugiat iusto pariatur
            consectetur quas libero dolor dolores dolorem, nostrum ducimus
            doloremque placeat accusamus iste, culpa quaerat consequatur?
          </p>
        </div>

        {/* Modal */}
        <div
          className={`modal-container ${showModal ? 'show-modal' : ''}`}
          onClick={handleModalBackdropClick}
        >
          <div className="modal">
            <button
              className="close-btn"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <i className="fa fa-times">×</i>
            </button>
            <div className="modal-header">
              <h3>Sign Up</h3>
            </div>
            <div className="modal-content">
              <p>Register with us to get offers, support and more</p>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter Name"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter Password"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="password2">Confirm Password</label>
                  <input
                    type="password"
                    id="password2"
                    placeholder="Confirm Password"
                    className="form-input"
                  />
                </div>
                <input type="submit" value="Submit" className="submit-btn" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}