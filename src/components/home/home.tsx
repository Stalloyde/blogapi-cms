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

type PostsType = {
  _id: string;
  image: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: Number;
    url: string;
  };

  author: string;
  title: string;
  content: string;
  date: Date;
  isPublished: Boolean;
  comments: [];
}[];

type PropsType = {
  post: PostsType[0];
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setPosts: React.Dispatch<React.SetStateAction<PostsType>>;
  openModal: (editId: string) => void;
  closeModal: () => void;
};

function Card({ post, token, setPosts, openModal }: PropsType) {
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
        <div onClick={() => openModal(post._id)}>
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
  const [editId, setEditId] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const openModal = (editId: string | null) => {
    if (editId) {
      setEditId(editId);
      setModalForm(true);
    } else {
      console.log('asad');
      setModalForm(true);
    }
  };

  const closeModal = () => {
    if (!submitting) {
      setSubmitting(false);
      setModalForm(false);
      setEditId(null);
    }
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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [token, modalForm]);

  return (
    <Layout token={token} setToken={setToken} closeModal={closeModal}>
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
              onClick={() => openModal(null)}>
              <div>Create New Post</div>
              <img src={createIcon} alt='create' />
            </div>
            {posts.map((post, index) => (
              <Card
                post={post}
                setToken={() => {}} //dummy prop
                setPosts={setPosts}
                key={index}
                token={token}
                openModal={openModal}
                closeModal={closeModal}
              />
            ))}
          </div>
          {modalForm && (
            <ModalForm
              editId={editId}
              token={token}
              submitting={submitting}
              setSubmitting={setSubmitting}
              closeModal={closeModal}
            />
          )}
        </>
      )}
    </Layout>
  );
}

export default Home;
