'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function InfiniteScrollBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const limit = 5;

  // Fetch posts from API
  const fetchPosts = useCallback(async (pageNum: number) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      // Use page + 1 because JSONPlaceholder pages are 1-indexed
      const actualPage = pageNum + 1;
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${actualPage}`
      );
      const data = await res.json();
      
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          const newPosts = [...prev, ...data];
          // Remove duplicates by id
          const uniquePosts = Array.from(
            new Map(newPosts.map(post => [post.id, post])).values()
          );
          return uniquePosts;
        });
        // Increment page after successful fetch
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Initial fetch
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts(0);
    }
  }, [posts.length, fetchPosts]);

  // Filter posts based on input
  useEffect(() => {
    if (!filter.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const term = filter.toUpperCase();
    const filtered = posts.filter(
      post =>
        post.title.toUpperCase().includes(term) ||
        post.body.toUpperCase().includes(term)
    );
    setFilteredPosts(filtered);
  }, [filter, posts]);

  // Set up Intersection Observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && hasMore) {
        fetchPosts(page);
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px", // Load more when 100px from bottom
      threshold: 0.1,
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observerRef.current.observe(currentLoader);
    }

    return () => {
      if (observerRef.current && currentLoader) {
        observerRef.current.unobserve(currentLoader);
      }
    };
  }, [loading, hasMore, page, fetchPosts]);

  // Clear filter and reset when filter is cleared
  useEffect(() => {
    if (!filter.trim() && posts.length === 0) {
      fetchPosts(0);
    }
  }, [filter, posts.length, fetchPosts]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Blog</h1>

      <div style={styles.filterContainer}>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter posts..."
          style={styles.filterInput}
        />
      </div>

      <div style={styles.postsContainer}>
        {filteredPosts.map(post => (
          <div key={post.id} style={styles.post}>
            <div style={styles.number}>{post.id}</div>
            <div style={styles.postInfo}>
              <h2 style={styles.postTitle}>{post.title}</h2>
              <p style={styles.postBody}>{post.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div 
        ref={loaderRef}
        style={{
          ...styles.loaderContainer,
          height: hasMore ? '100px' : 'auto',
        }}
      >
        {loading && (
          <div style={styles.loader}>
            <div style={styles.circle} />
            <div style={{ ...styles.circle, animationDelay: '0.1s' }} />
            <div style={{ ...styles.circle, animationDelay: '0.2s' }} />
          </div>
        )}
      </div>

      {!hasMore && posts.length > 0 && (
        <p style={styles.endMessage}>No more posts to load</p>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Roboto', sans-serif;
          overflow-y: auto;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#296ca8',
    color: '#fff',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    minHeight: '100vh',
    padding: '20px',
  },
  title: {
    marginBottom: '10px',
    textAlign: 'center' as const,
    marginTop: '20px',
  },
  filterContainer: {
    marginTop: '20px',
    width: '80vw',
    maxWidth: '800px',
    marginBottom: '20px',
  },
  filterInput: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '3px',
  },
  postsContainer: {
    width: '80vw',
    maxWidth: '800px',
  },
  post: {
    position: 'relative' as const,
    backgroundColor: '#4992d3',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    borderRadius: '3px',
    padding: '20px',
    margin: '40px 0',
    display: 'flex' as const,
    width: '100%',
  },
  number: {
    position: 'absolute' as const,
    top: '-15px',
    left: '-15px',
    fontSize: '15px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    color: '#296ca8',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '7px 10px',
  },
  postInfo: {
    marginLeft: '20px',
  },
  postTitle: {
    margin: 0,
  },
  postBody: {
    margin: '15px 0 0',
    lineHeight: 1.3,
  },
  loaderContainer: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    width: '100%',
    margin: '20px 0',
  },
  loader: {
    display: 'flex' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  circle: {
    backgroundColor: '#fff',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    margin: '5px',
    animation: 'bounce 0.5s ease-in infinite',
  },
  endMessage: {
    marginTop: '20px',
    textAlign: 'center' as const,
    padding: '20px',
  },
};