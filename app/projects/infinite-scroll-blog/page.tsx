"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const POSTS_PER_PAGE = 5;

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterTerm, setFilterTerm] = useState<string>("");

  // Mimics the old `let page = 1;`
  const pageRef = useRef<number>(1);

  // Fetch posts for the current pageRef
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${POSTS_PER_PAGE}&_page=${pageRef.current}`
      );

      if (!response.ok) {
        console.error("Failed to fetch posts", response.statusText);
        return;
      }

      const data: Post[] = await response.json();
      setPosts((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  }, []);

  // Initial load (no loader delay needed here)
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      await fetchPosts();
      setIsLoading(false);
    };
    loadInitial();
  }, [fetchPosts]);

  // Show loader and then fetch more posts (mimics showLoading())
  const loadMorePosts = useCallback(() => {
    if (isLoading) return;

    // Show the loader immediately
    setIsLoading(true);

    // Keep loader visible for a bit, then fetch next page
    setTimeout(async () => {
      pageRef.current += 1; // move to next page

      try {
        await fetchPosts();
      } finally {
        // Hide loader after fetch finishes
        setIsLoading(false);
      }
    }, 1000); // 1 second like the original demo feel
  }, [isLoading, fetchPosts]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      // When scrolled to (or very near) the bottom, load more posts
      if (scrollHeight - scrollTop <= clientHeight + 1) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, loadMorePosts]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(event.target.value);
  };

  const normalizedFilter = filterTerm.trim().toUpperCase();
  const filteredPosts =
    normalizedFilter.length === 0
      ? posts
      : posts.filter((post) => {
          const title = post.title.toUpperCase();
          const body = post.body.toUpperCase();
          return (
            title.includes(normalizedFilter) || body.includes(normalizedFilter)
          );
        });

  return (
    <>
      <main>
        <h1>My Blog</h1>

        <div className="filter-container">
          <input
            type="text"
            id="filter"
            className="filter"
            placeholder="Filter posts..."
            value={filterTerm}
            onChange={handleFilterChange}
          />
        </div>

        <div id="posts-container">
          {filteredPosts.map((post) => (
            <div key={post.id} className="post">
              <div className="number">{post.id}</div>
              <div className="post-info">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-body">{post.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Loader shows when isLoading is true */}
        <div className={`loader ${isLoading ? "show" : ""}`}>
          <div className="circle" />
          <div className="circle" />
          <div className="circle" />
        </div>
      </main>

      {/* Global styles based on original style.css */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

        * {
          box-sizing: border-box;
        }

        body {
          background-color: #296ca8;
          color: #fff;
          font-family: "Roboto", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding-bottom: 100px;
        }

        main {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          margin-bottom: 0;
          text-align: center;
        }

        .filter-container {
          margin-top: 20px;
          width: 80vw;
          max-width: 800px;
        }

        .filter {
          width: 100%;
          padding: 12px;
          font-size: 16px;
        }

        .post {
          position: relative;
          background-color: #4992d3;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border-radius: 3px;
          padding: 20px;
          margin: 40px 0;
          display: flex;
          width: 80vw;
          max-width: 800px;
        }

        .post .post-title {
          margin: 0;
        }

        .post .post-body {
          margin: 15px 0 0;
          line-height: 1.3;
        }

        .post .post-info {
          margin-left: 20px;
        }

        .post .number {
          position: absolute;
          top: -15px;
          left: -15px;
          font-size: 15px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          color: #296ca8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 7px 10px;
        }

        .loader {
          opacity: 0;
          display: flex;
          position: fixed;
          bottom: 50px;
          transition: opacity 0.3s ease-in;
        }

        .loader.show {
          opacity: 1;
        }

        .circle {
          background-color: #fff;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin: 5px;
          animation: bounce 0.5s ease-in infinite;
        }

        .circle:nth-of-type(2) {
          animation-delay: 0.1s;
        }

        .circle:nth-of-type(3) {
          animation-delay: 0.2s;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default BlogPage;
