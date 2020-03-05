import sharp = require("sharp");

export default async function sanitizeUserProfileImage(
  buffer: Buffer
): Promise<Buffer> {
  return await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .png()
    .toBuffer();
}
