// import { NextRequest } from "next/server";
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth(app);

// export async function POST(request: NextRequest) {
//   const { email, password, className, board } = await request.json();

//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     // You can store className and board in Firestore or Realtime DB here if needed

//     return new Response(JSON.stringify({ success: true, uid: userCredential.user.uid }), {
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error: any) {
//     return new Response(JSON.stringify({ success: false, error: error.message }), {
//       status: 400,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }