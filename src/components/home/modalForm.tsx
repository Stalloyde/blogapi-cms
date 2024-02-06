import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './modalForm.module.css';

function ModalForm({ setModalForm, token, editId, setEditId }) {
  const [toPublish, setToPublish] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!submitting) {
      setModalForm(false);
      setEditId(null);
    }
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('toPublish', toPublish);
    formData.append('image', image);

    try {
      const response = await fetch(`http://localhost:3000/mod/posts`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) navigate('/mod/login');
        throw new Error(
          `This is an HTTP error: The status is ${response.status}: ${response}`,
        );
      } else {
        setModalForm(false);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('toPublish', toPublish);
    formData.append('image', image);
    formData.append('editId', editId);

    try {
      const response = await fetch(`http://localhost:3000/mod/posts`, {
        method: 'PUT',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) navigate('/mod/login');
        throw new Error(
          `This is an HTTP error: The status is ${response.status}: ${response}`,
        );
      } else {
        setModalForm(false);
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  if (editId) {
    useEffect(() => {
      const editTarget = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/mod/posts/${editId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            },
          );

          if (!response.ok) {
            throw new Error(
              `This is an HTTP error: The status is ${response.status}: ${response}`,
            );
          } else {
            const responseData = await response.json();
            setTitle(responseData.title);
            setContent(responseData.content);
            setToPublish(responseData.isPublished);
            setImage(responseData.image);
          }
        } catch (err) {
          throw new Error(err.msg);
        }
      };
      editTarget();
    }, []);

    return (
      <>
        <div className={styles.newPostOverlay} onClick={handleClick}></div>
        <form
          className={styles.form}
          onSubmit={handleSubmitEdit}
          encType='multipart/form-data'>
          <h2>Edit Post</h2>
          <div>
            <label htmlFor='title'>Title: </label>
            <input
              required
              type='text'
              name='title'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={45}
            />
          </div>

          <div>
            <label htmlFor='image'>*Optional: Change Image (PNG, JPEG): </label>
            <input
              type='file'
              accept='image/png, image/jpeg, image/*'
              name='image'
              id='image'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <label htmlFor='content'>Content: </label>
            <textarea
              required
              name='content'
              id='content'
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

          {submitting ? (
            <button type='submit' disabled>
              Updating...
            </button>
          ) : (
            <button type='submit'>Update Post</button>
          )}
        </form>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.newPostOverlay} onClick={handleClick}></div>
        <form
          className={styles.form}
          onSubmit={handleSubmitCreate}
          encType='multipart/form-data'>
          <h2>Create New Post</h2>
          <div>
            <label htmlFor='title'>Title: </label>
            <input
              required
              type='text'
              name='title'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={45}
            />
          </div>

          <div>
            <label htmlFor='image'>Upload Image (PNG, JPEG): </label>
            <input
              type='file'
              accept='image/png, image/jpeg, image/*'
              name='image'
              id='image'
              required
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <label htmlFor='content'>Content: </label>
            <textarea
              required
              name='content'
              id='content'
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

          {submitting ? (
            <button type='submit' disabled>
              Creating Post...
            </button>
          ) : (
            <button type='submit'>Create Post</button>
          )}
        </form>
      </>
    );
  }
}

export default ModalForm;
