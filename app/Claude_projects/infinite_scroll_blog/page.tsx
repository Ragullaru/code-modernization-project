'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function InfiniteScrollBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterTerm, setFilterTerm] = useState('');
  const limit = 5;
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch posts from API
  const getPosts = async (pageNum: number): Promise<Post[]> => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${pageNum}`
    );
    const data = await res.json();
    return data;
  };

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPosts = await getPosts(page);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setPosts(prev => [...prev, ...newPosts]);
    setPage(prev => prev + 1);
    setLoading(false);
  }, [page, loading]);

  // Initial load
  useEffect(() => {
    loadMorePosts();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, loadMorePosts]);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const term = filterTerm.toUpperCase();
    const title = post.title.toUpperCase();
    const body = post.body.toUpperCase();
    return title.includes(term) || body.includes(term);
  });

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

        * {
          box-sizing: border-box;
        }

        .container {
          background-color: #296ca8;
          color: #fff;
          font-family: 'Roboto', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding-bottom: 100px;
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

        .posts-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
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

        .observer-target {
          height: 20px;
          width: 100%;
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

      <div className="container">
        <h1>My Blog</h1>

        <div className="filter-container">
          <input
            type="text"
            className="filter"
            placeholder="Filter posts..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
          />
        </div>

        <div className="posts-container">
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

        <div ref={observerTarget} className="observer-target" />

        <div className={`loader ${loading ? 'show' : ''}`}>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
    </>
  );
}