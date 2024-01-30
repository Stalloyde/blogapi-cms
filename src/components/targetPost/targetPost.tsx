import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from '../layout/layout';
import styles from './targetPost.module.css';
import formatDate from '../../formatDate';
import '../../index.css';

type PropsType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

type TargetPostsType = {
  image: {
    fieldname: String;
    originalname: String;
    encoding: String;
    mimetype: String;
    destination: String;
    filename: String;
    path: String;
    size: Number;
  };

  author: String;
  title: String;
  content: String;
  date: Date;
  isPublished: Boolean;
  comments: [];
};

type CommentType = {
  _id: string;
  author: {
    id: String;
    username: String;
    isMod: Boolean;
  };
  content: String;
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRerender(false);
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
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchTargetPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/posts/${targetPostId.id}`,
          {
            headers: {
              Authorization: token,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`,
          );
        }

        const responseData = await response.json();
        ('');
        setTargetPostData(responseData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTargetPost();
  }, [rerender]);

  return (
    <Layout token={token} setToken={setToken}>
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
            <div className={styles.postContainer}>
              <div>{targetPostData.content}</div>
            </div>
          </div>

          <hr></hr>

          <div className={styles.commentsContainer}>
            <h3>Comments</h3>
            {!token ? (
              <div>
                Please{' '}
                <Link to='/signup'>
                  <em className={styles.commentLink}>sign up</em>
                </Link>{' '}
                or
                <Link to='/login'>
                  <em className={styles.commentLink}>login</em>
                </Link>{' '}
                to add a comment
              </div>
            ) : (
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
                <button value='Post'>Post</button>
              </form>
            )}
            {targetPostData.comments.length > 0 ? (
              <>
                {targetPostData.comments.map((comment: CommentType) => (
                  <div key={comment._id} className={styles.comment}>
                    <div>{comment.content}</div>
                    <em>
                      {comment.author.username} | {formatDate(comment.date)}
                    </em>
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
