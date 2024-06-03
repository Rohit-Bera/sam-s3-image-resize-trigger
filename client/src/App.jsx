import { useState } from "react";
import "./App.css";
import Resizer from "react-image-file-resizer";

const App = () => {
  const [image, setImage] = useState("");
  const awsEndPoint =
    "https://vlo26xzuo4.execute-api.us-east-1.amazonaws.com/Prod/putOneImg";

  const onFileChange = (e) => {

    const file = e.target.files[0];

    createImage(file);
  };

  const resizeImg = async(file) => new Promise((resolve) => {
    Resizer.imageFileResizer(file, 250, 250,"JPEG",100, 0,
      (uri) => {
        resolve(uri)
      },"base64"
    );
  })

  const createImage = (file) => {

    // asynchronously read the contents of files (or raw data buffers) stored on the user's computer
    let reader = new FileReader();

    reader.onload = (evt) => {

      if (!evt.target.result.includes("data:image/jpeg")) {
        return alert("Upload only jpg image");
      }
      setImage(evt.target.result);
    };
    reader.readAsDataURL(file);
  };

  const convertbintoblob = (image) => {
    const binary = atob(image.split(",")[1]);

      let arrBinary = [];

      for (var i = 0; i < binary.length; i++) {
        arrBinary.push(binary.charCodeAt(i));
      }

      let blobData = new Blob([new Uint8Array(arrBinary)], {
        type: "image/jpeg",
      });

      return blobData;
  }

  const uploadImage = async () => {
    try {
      // get SIgnedUrl from aws
      const response = await fetch(awsEndPoint, { method: "get" });

      const data = await response.json();

      const uploadUrl = data.result.url;

      const fullImg = convertbintoblob(image);

      const resizedImg = await resizeImg(fullImg);

      const thumbnail = convertbintoblob(resizedImg);

      // put the data to aws s3
      const result = await fetch(uploadUrl, { method: "PUT", body: thumbnail });

    } catch (err) {
      console.log("eeror :", err);
    }
  };

  return (
    <>
      <h5>
        Sample Project to upload resize image to thumbnail into aws s3 <br />{" "}
        with lambda function
      </h5>
      <h5>Click to select image</h5>
      <input type="file" accept="image/jpeg" onChange={onFileChange} />
      <button type="submit" onClick={uploadImage}>
        submit
      </button>
    </>
  );
};

export default App;
