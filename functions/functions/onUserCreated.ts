import * as functions from "firebase-functions";
import nanoid = require("nanoid");
import fetch from "node-fetch";
import sanitizeUserProfileImage from "../utilities/sanitizeUserProfileImage";
import app from "../firebaseAdminApp";

const DISPLAY_NAME_FALLBACK = "noname";

export default functions.auth.user().onCreate(async (user) => {
  const userDoc = app.firestore().collection("users").doc(user.uid);
  const profileImageFile = app
    .storage()
    .bucket()
    .file(`user_profile_images/${user.uid}.png`);
  const fallbackProfileImageFile = app
    .storage()
    .bucket()
    .file("fallbacks/user_profile_image.png");

  await app.firestore().runTransaction(async (transaction) => {
    if ((await transaction.get(userDoc)).exists) {
      throw new Error(
        `tried to create a new user but user (uid=${user.uid}) is already exists.`
      );
    }

    if ((await profileImageFile.exists())[0]) {
      throw new Error(
        `tried to create a new user but user profile image (uid=${user.uid}) is already exists.`
      );
    }

    const downloadToken = nanoid(32);
    let buffer;

    if (user.photoURL) {
      const response = await fetch(user.photoURL);

      buffer = await sanitizeUserProfileImage(await response.buffer());
    } else {
      buffer = (await fallbackProfileImageFile.download())[0];
    }

    await profileImageFile.save(buffer, {
      contentType: "image/png",
      metadata: {
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });

    await transaction.create(userDoc, {
      name: user.displayName ?? DISPLAY_NAME_FALLBACK,
      profileImageURL:
        "https://firebasestorage.googleapis.com/v0/b/" +
        app.storage().bucket().id +
        "/o/" +
        profileImageFile.id +
        "?alt=media&token=" +
        downloadToken,
    });
  });
});
