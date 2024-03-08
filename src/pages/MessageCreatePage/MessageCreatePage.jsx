import { useEffect, useState, React } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Editor } from 'react-draft-wysiwyg';
// eslint-disable-next-line import/no-relative-packages
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Header from '../../components/common/Header';
import styles from './messageCreatePage.module.scss';
import { POST_BASE_URL, PROFILE_IMAGE_URL } from '../../constants/fetchUrl';
import Dropdown from '../../components/Textfield';

function MessageCreatePage() {
  const [invalid, setInvalid] = useState(false);
  const [sender, setSender] = useState('');
  const [profileImage, setProfileImage] = useState(
    'https://learn-codeit-kr-static.s3.ap-northeast-2.amazonaws.com/sprint-proj-image/default_avatar.png',
  );
  const [defaultImage, setDefaultImage] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [imageUrlList, setImageUrlList] = useState([]);
  const [text, setText] = useState('');
  const [relation, setRelation] = useState('지인');
  const [font, setFont] = useState('Noto Sans');
  const navigate = useNavigate();
  const { id } = useParams();
  const messagesURL = `${POST_BASE_URL}/${id}/messages/`;

  useEffect(() => {
    async function getData() {
      try {
        let imageUrls = [];
        const response = await fetch(PROFILE_IMAGE_URL);
        const result = await response.json();
        if (result.length !== 0) {
          ({ imageUrls } = result);
          setImageUrlList(imageUrls);
          setSelectedImage(imageUrls[0]);
          setDefaultImage(imageUrls[0]);
          imageUrls.shift();
        }
      } catch (error) {
        console.log(`${PROFILE_IMAGE_URL}에 대한 fetch error : ${error}`);
      }
    }
    getData();
  }, []);

  const handleSenderChange = e => {
    setSender(e.target.value);
  };

  const handleInputBlur = () => {
    if (!sender.trim()) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
  };

  const handleSelectedImageClick = e => {
    e.target.src = defaultImage;
    setProfileImage(defaultImage);
  };

  const handleProfileImageClick = e => {
    setProfileImage(e.target.src);
    setSelectedImage(e.target.src);
    const profileImages = e.target.parentElement.parentElement.children;
    // eslint-disable-next-line no-restricted-syntax
    for (const image of profileImages) {
      image.children[0].className = `${styles.profileImage}`;
    }
    e.target.className = `${styles.profileImage} ${styles.blur}`;
  };

  const newMessageInfo = {
    sender,
    relationship: relation,
    content: text,
    font,
    profileImageURL: profileImage,
  };

  const handleCreateMessage = async () => {
    try {
      const response = await fetch(`${messagesURL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessageInfo),
      });

      const result = await response.json();
      console.log(result);
      navigate(`/post/${id}`);
    } catch (error) {
      console.log(`${messagesURL}에 대한 post error : ${error}`);
    }
  };

  const handleRelationChange = e => {
    setRelation(e.target.textContent);
  };

  const handleFontChange = e => {
    setFont(e.target.textContent);
  };

  const onEditorStateChange = editorState => {
    const stateToText = editorState.getCurrentContent().getPlainText('\u0001');
    setText(stateToText);
  };

  // {imageUrls: ['https://learn-codeit...]}
  return (
    <>
      <Header buttonOn={false} />
      <div className={styles.content}>
        <form className={styles.form}>
          <label className={styles.label} htmlFor="sender">
            From.
          </label>
          <input
            id="sender"
            placeholder="이름을 입력해 주세요."
            value={sender}
            onChange={handleSenderChange}
            className={`${styles.input} ${invalid ? styles.invalidInput : 'df'}`}
            onBlur={handleInputBlur}
          />
          {invalid && (
            <p className={styles.errorMessage}>값을 입력해 주세요.</p>
          )}
        </form>
        <h1>프로필 이미지</h1>
        <div className={styles.profileImageContainer}>
          {selectedImage && (
            <button
              type="button"
              onClick={handleSelectedImageClick}
              className={styles.selectedImageButton}
            >
              <img
                src={selectedImage}
                alt="selectedImage"
                className={styles.selectedImage}
              />
            </button>
          )}
          <div>
            <p className={styles.chooseProfileImage}>
              프로필 이미지를 선택해주세요!
            </p>
            <div className={styles.profileImages}>
              {imageUrlList &&
                imageUrlList.map(imageUrl => (
                  <button
                    type="button"
                    key={imageUrl}
                    onClick={handleProfileImageClick}
                    className={styles.profileImageButton}
                  >
                    <img
                      src={imageUrl}
                      alt="profileImage"
                      className={styles.profileImage}
                    />
                  </button>
                ))}
            </div>
          </div>
        </div>
        <form className={styles.form}>
          <label className={styles.label} htmlFor="relation">
            상대와의 관계
          </label>
          <Dropdown
            id="relation"
            onChange={handleRelationChange}
            options={['지인', '동료', '친구', '가족']}
          />
        </form>
        <h1>내용을 입력해주세요</h1>
        <Editor
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          toolbar={{
            // inDropdown: 해당 항목과 관련된 항목을 드롭다운으로 나타낼것인지
            options: [
              'inline',
              'blockType',
              'fontSize',
              'list',
              'textAlign',
              'colorPicker',
              'link',
              'embedded',
              'emoji',
              'remove',
              'history',
            ],
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            history: { inDropdown: false },
          }}
          wrapperStyle={{
            border: '1px solid var(--grayscale200)',
            borderRadius: '1rem',
            width: 'min(100%,45rem)',
            height: '16.25rem',
            margin: '0.75rem 0 3.125rem',
          }}
          toolbarStyle={{
            backgroundColor: 'var(--grayscale200)',
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
          }}
          editorStyle={{
            border: 'none',
            padding: '0 1.25rem',
            height: '10.5rem',
          }}
          localization={{
            locale: 'ko',
          }}
          onEditorStateChange={onEditorStateChange}
        />
        <form className={styles.form}>
          <label className={styles.label} htmlFor="font">
            폰트 선택
          </label>
          <Dropdown
            id="font"
            onChange={handleFontChange}
            options={[
              'Noto Sans',
              'Pretendard',
              '나눔명조',
              '나눔손글씨 손편지체',
            ]}
          />
        </form>

        <button
          type="button"
          onClick={handleCreateMessage}
          className={`${styles.messageCreateButton} ${!sender.trim() || !text.trim() ? styles.disabledButton : ''}`}
          disabled={!sender.trim() || !text.trim()}
        >
          생성하기
        </button>
      </div>
    </>
  );
}
export default MessageCreatePage;
