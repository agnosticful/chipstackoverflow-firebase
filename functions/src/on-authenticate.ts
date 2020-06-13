import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import got from "got";
import { nanoid } from "nanoid";
import sharp = require("sharp");
import * as stream from "stream";
import * as util from "util";

const pipeline = util.promisify(stream.pipeline);

export default functions.auth.user().onCreate(async (user) => {
  const profileImageFile = admin
    .app()
    .storage()
    .bucket("chipstackoverflow-user-profile-images")
    .file(`${user.uid}.png`);
  const downloadToken = nanoid(32);

  if (user.photoURL) {
    await pipeline(
      got.stream(user.photoURL),
      sharp().resize(256, 256, { fit: "cover" }).png(),
      profileImageFile.createWriteStream({
        contentType: "image/png",
        metadata: {
          metadata: { firebaseStorageDownloadTokens: downloadToken },
        },
      })
    );
  } else {
    const fallbackProfileImageFile = admin
      .app()
      .storage()
      .bucket("chipstackoverflow-user-profile-images")
      .file("__default.png");

    await pipeline(
      fallbackProfileImageFile.createReadStream(),
      profileImageFile.createWriteStream({
        contentType: "image/png",
        metadata: {
          metadata: { firebaseStorageDownloadTokens: downloadToken },
        },
      })
    );
  }

  await admin
    .app()
    .firestore()
    .collection("userProfiles")
    .doc(user.uid)
    .create({
      name: user.displayName ?? "No Name",
      profileImageURL:
        "https://firebasestorage.googleapis.com/v0/b/" +
        admin.app().storage().bucket("chipstackoverflow-user-profile-images")
          .id +
        "/o/" +
        profileImageFile.id +
        "?alt=media&token=" +
        downloadToken,
    });
});
