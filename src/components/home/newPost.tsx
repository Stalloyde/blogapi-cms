import { useState, useEffect } from 'react';
import styles from './newPost.module.css';

function NewPost({ setCreatingNewPost }) {
  const [toPublish, setToPublish] = useState(true);

  return (
    <>
      <div
        className={styles.newPostOverlay}
        onClick={() => {
          setCreatingNewPost(false);
        }}></div>
      <form
        className={styles.form}
        onSubmit={() => {
          setCreatingNewPost(false);
        }}>
        <h2>Create New Post</h2>
        <div>
          <label htmlFor='title'>Title: </label>
          <input type='text' name='title' id='title' required />
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
          <textarea name='content' id='content' required />
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
