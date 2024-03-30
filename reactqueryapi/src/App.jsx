import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import './App.css';

const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

function App() {
  const queryClient = useQueryClient();

  // GET example
  const { data: postsData, error: postsError, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch(apiUrl)
        .then(res => res.json()),
  });

  // POST example
  const { mutate: addPost, isPending: addPostPending, isError: addPostError } = useMutation({
    mutationFn: (newPost) =>  
      fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: {"Content-Type": "application/json; charset=utf-8"},
      }).then((res)=> res.json()),
    onSuccess: (newPost) =>{
      queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost] )
    },
  });

  // PUT example
  const { mutate: updatePost, isPending: updatePostPending, isError: updatePostError } = useMutation({
    mutationFn: (updatedPost) => 
      fetch(`${apiUrl}/${updatedPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: {"Content-Type": "application/json; charset=utf-8"},
      }).then((res)=> res.json()),

    onSuccess: (updatedPost) =>{
      queryClient.setQueryData(['posts'], (oldPosts) => {
        const updatedPosts = oldPosts.map(post => {
          if (post.id === updatedPost.id) {
            return updatedPost;
          }
          return post;
        });
        return updatedPosts;
      });
    },

  });

  // PATCH example
  const { mutate: patchPost, isPending: patchPostPending, isError: patchPostError } = useMutation({
    mutationFn: (updatedPost) => 
      fetch(`${apiUrl}/${updatedPost.id}`, {
        method: 'PATCH',
        body: JSON.stringify(updatedPost),
        headers: {"Content-Type": "application/json; charset=utf-8"},
      }).then((res)=> res.json()),

    onSuccess: (updatedPost) =>{
      queryClient.setQueryData(['posts'], (oldPosts) => {
        const updatedPosts = oldPosts.map(post => {
          if (post.id === updatedPost.id) {
            return updatedPost;
          }
          return post;
        });
        return updatedPosts;
      });
    },

  });

  // DELETE example
  const { mutate: deletePost, isPending: deletePostPending, isError: deletePostError } = useMutation({
    mutationFn: (postId) => 
      fetch(`${apiUrl}/${postId}`, {
        method: 'DELETE',
      }),

    onSuccess: (deletedPostId) =>{
      queryClient.setQueryData(['posts'], (oldPosts) => oldPosts.filter(post => post.id !== deletedPostId));
    },
  });

  const handleAddPost = async () => {
    addPost({
      userId: 1,
      title: 'New Post',
      body: 'This is a new post',
    });
  };

  const handleUpdatePost = async () => {
    updatePost({
      id: 1,
      userId: 1,
      title: 'Updated Post',
      body: 'This post has been updated',
    });
  };

  const handlePatchPost = async () => {
    patchPost({
      id: 1,
      title: 'Patched Post',
    });
  };

  const handleDeletePost = async (postId) => {
    deletePost(postId);
  };

  if(postsError || addPostError || updatePostError || patchPostError || deletePostError) return <div>There was an error!</div>;
  if(postsLoading || addPostPending || updatePostPending || patchPostPending || deletePostPending) return <div>Data Is Loading...</div>;

  return (
    <div>
      <button onClick={handleAddPost}>Add Post</button>
      <button onClick={handleUpdatePost}>Update Post</button>
      <button onClick={handlePatchPost}>Patch Post</button>
      <button onClick={() => handleDeletePost(1)}>Delete Post</button>
      <h1>Posts:</h1>
      {postsData && postsData.map(post => (
        <div key={post.id}>
          <h4>ID: {post.id}</h4>
          <h4>Title: {post.title}</h4>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
