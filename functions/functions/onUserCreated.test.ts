import * as createFirebaseFunctionsTest from "firebase-functions-test";
import { WrappedFunction } from "firebase-functions-test/lib/main";

describe("onUserCreated", () => {
  const app = {
    firestore: jest.fn(),
    storage: jest.fn()
  };
  const runTransaction = jest.fn();
  const transaction = {
    get: jest.fn(),
    create: jest.fn()
  };
  const collection = jest.fn();
  const doc = jest.fn();
  const bucket = jest.fn();
  const file = jest.fn();
  const fileId = "FILE_ID";
  const exists = jest.fn();
  const save = jest.fn();
  const download = jest.fn();
  const nanoid = jest.fn();
  const nodeFetch = jest.fn();
  const response = {
    buffer: jest.fn()
  };
  const originalImage = Symbol("ORIGINAL_IMAGE");
  const sanitizeUserProfileImage = jest.fn();
  const sanitizedImage = Symbol("SANITIZED_IMAGE");

  let onUserCreatedFunc: WrappedFunction;

  beforeAll(async () => {
    jest.mock("nanoid", () => nanoid);
    jest.mock("node-fetch", () => ({ default: nodeFetch }));
    jest.mock("../firebaseAdminApp", () => ({ default: app }));
    jest.mock("../utilities/sanitizeUserProfileImage", () => ({
      default: sanitizeUserProfileImage
    }));

    const { default: onUserCreated } = await import("./onUserCreated");
    const test = createFirebaseFunctionsTest();
    onUserCreatedFunc = test.wrap(onUserCreated);
  });

  beforeEach(() => {
    app.firestore.mockReturnValue({ runTransaction, collection });
    app.storage.mockReturnValue({ bucket });
    runTransaction.mockImplementation(cb => cb(transaction));
    transaction.get.mockResolvedValue({ exists: false });
    transaction.create.mockResolvedValue(undefined);
    collection.mockReturnValue({ doc });
    bucket.mockReturnValue({ file });
    file.mockReturnValue({ id: fileId, exists, save, download });
    exists.mockResolvedValue([false]);
    nodeFetch.mockReturnValue(response);
    response.buffer.mockReturnValue(originalImage);
    sanitizeUserProfileImage.mockReturnValue(sanitizedImage);
  });

  afterEach(() => {
    app.firestore.mockReset();
    app.storage.mockReset();
    runTransaction.mockReset();
    transaction.get.mockReset();
    transaction.create.mockReset();
    collection.mockReset();
    doc.mockReset();
    bucket.mockReset();
    file.mockReset();
    exists.mockReset();
    save.mockReset();
    download.mockReset();
    nanoid.mockReset();
    nodeFetch.mockReset();
    response.buffer.mockReset();
    sanitizeUserProfileImage.mockReset();
  });

  it("fetches the profile image if it's provided, and then upload it to the storage", async () => {
    const photoURL = Symbol("PHOTO_URL");
    const downloadToken = "DOWNLOAD_TOKEN";
    nanoid.mockReturnValue(downloadToken);

    await onUserCreatedFunc({
      uid: "loremipsum",
      displayName: "Kohei Asai",
      photoURL
    });

    expect(nodeFetch).toHaveBeenCalledWith(photoURL);
    expect(sanitizeUserProfileImage).toHaveBeenCalledWith(originalImage);
    expect(save).toHaveBeenCalledWith(
      sanitizedImage,
      expect.objectContaining({
        metadata: {
          metadata: { firebaseStorageDownloadTokens: downloadToken }
        }
      })
    );
  });

  it("downloads the fallback profile image and uploads a copy of it if a profile image is not provided", async () => {
    const fallbackImage = Symbol("FALLBACK_IMAGE");
    download.mockResolvedValue([fallbackImage]);

    await onUserCreatedFunc({
      uid: "loremipsum",
      displayName: "Kohei Asai"
    });

    expect(download).toHaveBeenCalled();
    expect(save).toHaveBeenCalledWith(fallbackImage, expect.anything());
  });

  it("creates an user document with an URL of profile image", async () => {
    const ref = Symbol("REF");
    const downloadToken = "DOWNLOAD_TOKEN";
    const name = Symbol("NAME");
    doc.mockReturnValue(ref);
    nanoid.mockReturnValue(downloadToken);

    await onUserCreatedFunc({
      uid: "loremipsum",
      displayName: name,
      photoURL: "https://example.kohei.dev/example.png"
    });

    expect(transaction.create).toHaveBeenCalledWith(ref, {
      name,
      profileImageURL: expect.stringContaining(downloadToken)
    });
  });

  it("fails and does nothing if user doc exists in the Firestore", async () => {
    transaction.get.mockResolvedValue({ exists: false });

    expect(
      onUserCreatedFunc({
        uid: "loremipsum",
        displayName: "Kohei Asai",
        photoURL: "https://example.kohei.dev/example.png"
      })
    ).rejects.toThrow();
  });

  it("fails and does nothing if user profile image exists in the storage", async () => {
    exists.mockReturnValue([true]);

    expect(
      onUserCreatedFunc({
        uid: "loremipsum",
        displayName: "Kohei Asai",
        photoURL: "https://example.kohei.dev/example.png"
      })
    ).rejects.toThrow();
  });
});
