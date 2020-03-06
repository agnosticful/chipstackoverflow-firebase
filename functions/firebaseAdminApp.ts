import { initializeApp } from "firebase-admin";

/**
 * Firebase's default admin app.
 * It needs to be singleton because initializeApp() cannot be called twice.
 */
export default initializeApp();
