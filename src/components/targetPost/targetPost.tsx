import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from '../layout/layout';
import styles from './targetPost.module.css';
import formatDate from '../../formatDate';
import '../../index.css';
import deleteIcon from '../../assets/icons8-delete-50.png';

type PropsType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

type TargetPostsType = {
  image: { url: string };
  author: { username: string };
  title: string;
  content: string;
  date: Date;
  isPublished: Boolean;
  comments: [];
};

type CommentType = {
  _id: string;
  author: {
    id: string;
    username: string;
    isMod: Boolean;
  };
  content: string;
  date: Date;
};

function TargetPost({ token, setToken }: PropsType) {
  const [targetPostData, setTargetPostData] = useState<
    TargetPostsType | undefined
  >();
  const [newComment, setNewComment] = useState('');
  const [rerender, setRerender] = useState(false);
  const targetPostId = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (commentId: string) => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this comment?',
    );

    if (confirmation) {
      try {
        const response = await fetch(
          `http://localhost:3000/mod/posts/${targetPostId.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              commentId,
            }),
          },
        );
        const responseData = await response.json();

        if (responseData.errors) {
          throw new Error(responseData.errors[0].msg);
        } else {
          setTargetPostData(responseData);
          setRerender(true);
        }
      } catch (err: any) {
        throw new Error(err);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:3000/mod/posts/${targetPostId.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            newComment,
          }),
        },
      );

      const responseData = await response.json();
      if (responseData.errors) {
        setErrorMessage(responseData.errors[0].msg);
      } else {
        setNewComment('');
        setErrorMessage('');
        setRerender(true);
        setSubmitting(false);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchTargetPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/mod/posts/${targetPostId.id}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) navigate('/mod/login');
          throw new Error(
            `This is an HTTP error: The status is ${response.status}: ${response}`,
          );
        }

        const responseData = await response.json();
        setTargetPostData(responseData);
        setRerender(false);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTargetPost();
  }, [token, rerender]);

  return (
    <Layout token={token} setToken={setToken} closeModal={() => {}}>
      {loading && <div className='loading'>Loading...</div>}
      {error && !loading && <div className='error'>{error}</div>}

      {!error && !loading && targetPostData !== undefined && (
        <>
          <div className={styles.contentContainer}>
            <h2>{targetPostData.title}</h2>
            <em>
              Written by: {targetPostData.author.username} | Date:{' '}
              {formatDate(targetPostData.date)}
            </em>
            {targetPostData.image && <img src={targetPostData.image.url}></img>}
            <div className={styles.postContainer}>
              <div>{targetPostData.content}</div>
            </div>
          </div>

          <hr></hr>

          <div className={styles.commentsContainer}>
            <h3>Comments</h3>

            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor='newComment'>Add Comment:</label>
              {errorMessage && (
                <p className={styles.errorMessage}>*Input required</p>
              )}
              <textarea
                value={newComment}
                id='newComment'
                name='newComment'
                placeholder='Write a comment...'
                required
                onChange={(e) => {
                  setNewComment(e.target.value);
                }}
              />

              {submitting ? (
                <button value='Post' disabled>
                  Posting..
                </button>
              ) : (
                <button value='Post'>Post</button>
              )}
            </form>

            {targetPostData.comments.length > 0 ? (
              <>
                {targetPostData.comments.map((comment: CommentType) => (
                  <div key={comment._id} className={styles.comment}>
                    <div>{comment.content}</div>
                    <div>
                      {comment.author.username} | {formatDate(comment.date)}
                    </div>
                    <div
                      id={comment._id}
                      className={styles.commentAction}
                      onClick={() => handleDelete(comment._id)}>
                      <img src={deleteIcon} alt='delete'></img>
                      Delete
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className={styles.comment}> No Comments </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

export default TargetPost;
