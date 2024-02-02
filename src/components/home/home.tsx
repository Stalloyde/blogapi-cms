import { useState, useEffect } from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../layout/layout';
import styles from './home.module.css';
import formatDate from '../../formatDate';
import editIcon from '../../assets/icons8-edit-50.png';
import deleteIcon from '../../assets/icons8-delete-50.png';
import createIcon from '../../assets/icons8-add-48.png';
import ModalForm from './modalForm';

type PropsType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
};

type PostsType = {
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
}[];

function Card({ post, token, setPosts, setModalForm, setEditId }) {
  const handleEdit = (editId) => {
    setModalForm(true);
    setEditId(editId);
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to delete this post?',
    );

    if (confirmation) {
      const targetPostId = post._id;

      try {
        const response = await fetch(`http://localhost:3000/mod/posts`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            targetPostId,
          }),
        });

        const responseData = await response.json();

        if (responseData.errors) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}: ${response}`,
          );
        } else {
          setPosts(responseData);
        }
      } catch (err: any) {
        throw new Error(err.message);
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardActions}>
        <div onClick={() => handleEdit(post._id)}>
          <img src={editIcon} alt='edit'></img>
          Edit
        </div>
        <div onClick={handleDelete}>
          <img src={deleteIcon} alt='delete'></img>
          Delete
        </div>
      </div>

      <Link to={`./${post._id}`}>
        <div>
          <h3>{post.title}</h3>
          <em>{formatDate(post.date)}</em>
        </div>

        <LinesEllipsis
          text={post.content}
          maxLine='4'
          ellipsis='..'
          trimRight
          basedOn='letters'
          className={styles.content}
        />
        <div className={styles.cardInfo}>
          <div className={styles.publishStatus}>
            {post.isPublished ? (
              <em className={styles.published}>Published</em>
            ) : (
              <em className={styles.unpublished}>Not Published</em>
            )}
          </div>

          <div className={styles.comments}>
            <em>{post.comments.length} Comments </em>
          </div>
        </div>
      </Link>
    </div>
  );
}

function Home({ token, setToken }: PropsType) {
  const [posts, setPosts] = useState<PostsType>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalForm, setModalForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const handleCreatePost = () => {
    setModalForm(true);
  };

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/mod/posts', {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          if (response.status === 401) navigate('/mod/login');
          throw new Error(
            `This is an HTTP error: The status is ${response.status}: ${response}`,
          );
        }
        const responseData = await response.json();
        setPosts(responseData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [token, modalForm]);

  return (
    <Layout token={token} setToken={setToken}>
      {loading && <div className='loading'>Loading...</div>}
      {error && !loading && <div className='error'>{error}</div>}

      {!error && !loading && (
        <>
          <div className={styles.mainHeader}>
            <h2>All Posts</h2>
          </div>

          <div className={styles.cardContainer}>
            <div
              className={`${styles.card} ${styles.newProject}`}
              onClick={handleCreatePost}>
              <div>Create New Post</div>
              <img src={createIcon} alt='create' />
            </div>
            {posts.map((post, index) => (
              <Card
                post={post}
                setPosts={setPosts}
                setModalForm={setModalForm}
                setEditId={setEditId}
                key={index}
                token={token}
              />
            ))}
          </div>
          {modalForm && (
            <ModalForm
              setModalForm={setModalForm}
              editId={editId}
              setEditId={setEditId}
              token={token}
            />
          )}
        </>
      )}
    </Layout>
  );
}

export default Home;
