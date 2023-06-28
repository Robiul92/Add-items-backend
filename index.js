const express = require("express");
const cors = require("cors");
// const Item = require("./main");
const Multer = require("multer");
const MulterGoogleStorage = require("multer-google-storage");
const sharp = require("sharp");

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  addDoc,
  getDocs,
  collection,
} = require("firebase/firestore");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} = require("firebase/storage");
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

const firebaseConfig = {
  apiKey: "AIzaSyBDbwqwWIf40EI68ihn6RWFPGElsmp2gZU",
  authDomain: "add-items-4e215.firebaseapp.com",
  projectId: "add-items-4e215",
  storageBucket: "add-items-4e215.appspot.com",
  messagingSenderId: "166181094889",
  appId: "1:166181094889:web:0823fa30110f887d6fb778",
  measurementId: "G-GWFQPM9F7N",
};

// Multer middleware configuration
const multer = Multer({
  storage: Multer.memoryStorage(),
});

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
storage = getStorage(firebaseApp);

app.get("/", (req, res) => {
  res.send({ msg: "Server is running" });
});

app.get("/example", function (req, res) {
  res.send(["Hello, world!", "Oops, cannot send again!"]);
});

app.get("/items", async (req, res) => {
  try {
    const itemsSnapshot = await getDocs(collection(db, "items"));
    const items = [];
    itemsSnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error retrieving items: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/additem", async (req, res) => {
  const data = req.body;
  try {
    const { name, description, price, quantity, img } = data;
    const metadata = {
      createdAt: new Date(),
      createdBy: "John Doe",
      updatedAt: new Date(),
      updatedBy: "Jane Doe",
    };
    const docRef = await addDoc(collection(db, "items"), {
      ...data,
      ...metadata,
    });
    res.status(200).json({ id: docRef.id });
  } catch (error) {
    console.error("Error adding document: ", error);
    res.status(500).json({ error: error.message });
  }

  console.log(data);
  // res.send({ msg: "user added" })
});

app.get("/images", async (req, res) => {
  try {
    const imagesRef = ref(storage, "images");
    const imagesList = await listAll(imagesRef);
    const imageNames = imagesList.items.map((item) => item.name);
    res.status(200).json({ imageNames });
  } catch (error) {
    console.error("Error retrieving image names: ", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/images/:imageName", async (req, res) => {
  try {
    const imageName = req.params.imageName;

    // Construct the storage reference to the image
    const storageRef = ref(storage, "images/" + imageName);

    // Get the download URL for the image
    const imageURL = await getDownloadURL(storageRef);

    // Redirect the user to the image URL
    res.redirect(imageURL);
  } catch (error) {
    console.error("Error retrieving image: ", error);
    res.status(500).json({ error: error.message });
  }
});

// app.post("/uploadimage", multer.single("image"), async (req, res) => {
//   try {
//     const { originalname, buffer } = req.file;

//       // Resize the image using sharp
//     const resizedImageBuffer = await sharp(buffer)
//       .resize({ width: 300, height: 300 }) // Set the desired width and height
//       .toBuffer();

//     // Upload the image to Firebase Storage
//     const storageRef = ref(storage, "images/" + originalname);
//     await uploadBytes(storageRef, resizedImageBuffer);
//     const imageURL = await getDownloadURL(storageRef);

//      // Log success message
//     console.log("Image upload successful!");

//     res.status(200).json({ imageURL });
//   } catch (error) {
//     console.error("Error uploading image: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
