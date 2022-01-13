import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Camera from "../components/svg/Camera";
import Delete from "../components/svg/Delete";
import { auth, db, storage } from "../firebase";

const Profile = () => {
  const [image, setImage] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    //   Get user
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });

    // Upload Image
    if (image) {
      const uploadImage = async () => {
        try {
          setLoading(true);
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const imageref = ref(
            storage,
            `avatar/${new Date().getTime()} - ${image.name}`
          );
          const snap = await uploadBytes(imageref, image);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });

          setImage("");
          setLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      uploadImage();
    }
  }, [image, user.avatarPath]);

  // Delete iamge
  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete image ?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <section>
      {loading && (
        <div className="overlyBG">
          <h3>Uploading Image...</h3>
        </div>
      )}

      <div className="profile_container">
        <div className="img_container">
          <img
            src={
              user.avatar
                ? user.avatar
                : "https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png"
            }
            alt="avatar"
          />
          {!loading && (
            <div className="overly">
              <div>
                <label htmlFor="photo">
                  <Camera />
                </label>
                {user.avatar && (
                  <span onClick={() => deleteImage()}>
                    <Delete />
                  </span>
                )}
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </div>
          )}
        </div>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>
            Joined on:{" "}
            {user.createdAt && user.createdAt.toDate().toDateString()}
          </small>
        </div>
      </div>
    </section>
  );
};

export default Profile;
