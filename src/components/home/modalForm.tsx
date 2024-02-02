import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './modalForm.module.css';

function NewPost({ setModalForm, token }) {
  const [toPublish, setToPublish] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
    setModalForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/mod/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          title,
          content,
          toPublish,
        }),
      });

      const responseData = await response.json();

      if (responseData.errors) {
        if (!response.ok) {
          if (response.status === 401) navigate('/mod/login');
          throw new Error(
            `This is an HTTP error: The status is ${response.status}: ${response}`,
          );
        }
      } else {
        setModalForm(false);
        false;
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return (
    <>
      <div className={styles.newPostOverlay} onClick={handleClick}></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Create New Post</h2>
        <div>
          <label htmlFor='title'>Title: </label>
          <input
            type='text'
            name='title'
            id='title'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={45}
          />
        </div>

        <div>
          <label htmlFor='image'>Upload Image (PNG, JPEG): </label>
          <input
            type='file'
            accept='image/png, image/jpeg'
            name='image'
            id='image'
          />
        </div>

        <div>
          <label htmlFor='content'>Content: </label>
          <textarea
            name='content'
            id='content'
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <input
            type='checkbox'
            name='publish'
            id='publish'
            checked={toPublish}
            onChange={() => {
              setToPublish(!toPublish);
            }}
          />
          <label htmlFor='publish'>
            Check to Publish. Uncheck to save without publishing
          </label>
        </div>

        <button type='submit'>Submit</button>
      </form>
    </>
  );
}

export default NewPost;
