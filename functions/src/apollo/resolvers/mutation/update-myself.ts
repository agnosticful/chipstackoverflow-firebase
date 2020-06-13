// import {
//   AuthenticationError,
//   ForbiddenError,
//   UserInputError,
// } from "apollo-server-core";
// import * as fs from "fs";
// import { FileUpload } from "graphql-upload";
// import * as path from "path";
// import sharp from "sharp";
// import { getConnection } from "typeorm";
// import * as uuid from "uuid";
// import User from "../../../old_entities/User";
// import { Context } from "../../context";

// export default async (
//   _: any,
//   { name, profileImage }: { name?: string; profileImage?: FileUpload },
//   { user }: Context
// ) => {
//   if (!user) {
//     throw new AuthenticationError("Authentication is required.");
//   }

//   if (name) {
//     validateName(name);
//   }

//   let filename: string | undefined;

//   if (profileImage) {
//     filename = await new Promise((resolve, reject) => {
//       const filename = `${uuid.v4()}.png`;
//       const readStream = profileImage.createReadStream();
//       const fileWriteStream = fs.createWriteStream(
//         path.resolve(
//           __dirname,
//           process.env.USER_UPLOADED_FILES_DIR!,
//           "profile_images",
//           filename
//         )
//       );

//       fileWriteStream.on("finish", () => resolve(filename));
//       fileWriteStream.on("error", (error) => reject(error));

//       readStream
//         .pipe(sharp().resize(256, 256).png())
//         .pipe(fileWriteStream)
//         .end();
//     });
//   }

//   return getConnection().transaction(async (manager) => {
//     const userForCheck = await manager.getRepository(User).findOne(user.id, {
//       lock: { mode: "pessimistic_read" },
//     });

//     if (!userForCheck) {
//       throw new ForbiddenError("Your user data needs to exist.");
//     }
//   });
// };

// function validateName(name: string): void {
//   if (name.trim() !== name) {
//     throw new UserInputError(
//       `name is invalid. name must not include whitespace characters at the head or tail.`
//     );
//   }

//   if (name.length < 8 || name.length > 65535) {
//     throw new UserInputError(
//       `name is invalid. name must be 8 to 65535 character length.`
//     );
//   }
// }
