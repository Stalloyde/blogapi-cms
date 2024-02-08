import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './modalForm.module.css';

type PropsType = {
  token: string;
  editId: string | null;
  submitting: Boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
};

function ModalForm({
  token,
  editId,
  submitting,
  setSubmitting,
  closeModal,
}: PropsType) {
  const [toPublish, setToPublish] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<'' | File>('');
  const navigate = useNavigate();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  const handleSubmitCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('toPublish', toPublish.toString());
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
        closeModal();
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleSubmitEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('toPublish', toPublish.toString());
    formData.append('image', image);
    if (editId) formData.append('editId', editId);

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
        closeModal();
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
        } catch (err: any) {
          throw new Error(err.msg);
        }
      };
      editTarget();
    }, []);

    return (
      <>
        <div className={styles.newPostOverlay} onClick={closeModal}></div>
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
              onChange={handleImage}
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
              checked={Boolean(toPublish)}
              onChange={() => {
                setToPublish(!toPublish);
              }}
            />
            <label htmlFor='publish'>
              Check to Publish. Uncheck to save without publishing
            </label>
          </div>
          <div>
            {submitting ? (
              <button type='submit' disabled>
                Updating...
              </button>
            ) : (
              <button type='submit'>Update Post</button>
            )}
          </div>
        </form>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.newPostOverlay} onClick={closeModal}></div>
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
              onChange={handleImage}
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
          <div>
            {submitting ? (
              <button type='submit' disabled>
                Creating Post...
              </button>
            ) : (
              <button type='submit'>Create Post</button>
            )}
          </div>
        </form>
      </>
    );
  }
}

export default ModalForm;
