'use client';

import { useState, useEffect, useRef } from 'react';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ModalMenuSlider() {
  const [showNav, setShowNav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showNav) {
        const target = e.target as Node;
        if (
          toggleRef.current &&
          !toggleRef.current.contains(target) &&
          navRef.current &&
          !navRef.current.contains(target)
        ) {
          setShowNav(false);
        }
      }
    };

    const handleModalOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('modal-container')) {
        setShowModal(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('click', handleModalOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('click', handleModalOutsideClick);
    };
  }, [showNav]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    alert('Form submitted!');
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

        body.show-nav nav {
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
          z-index: 1000;
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
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .close-btn {
          background: transparent;
          font-size: 25px;
          position: absolute;
          top: 0;
          right: 0;
          padding: 10px;
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

      <body className={showNav ? 'show-nav' : ''}>
        <nav id="navbar" ref={navRef}>
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
            id="toggle"
            className="toggle"
            ref={toggleRef}
            onClick={() => setShowNav(!showNav)}
          >
            <FontAwesomeIcon icon={faBars} size="2x" />
          </button>

          <h1>My Landing Page</h1>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, amet!
          </p>

          <button className="cta-btn" id="open" onClick={() => setShowModal(true)}>
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

        <div className={`modal-container ${showModal ? 'show-modal' : ''}`} id="modal">
          <div className="modal">
            <button className="close-btn" id="close" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faTimes} />
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
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter Password"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password2">Confirm Password</label>
                  <input
                    type="password"
                    id="password2"
                    placeholder="Confirm Password"
                    className="form-input"
                    required
                  />
                </div>
                <input type="submit" value="Submit" className="submit-btn" />
              </form>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}