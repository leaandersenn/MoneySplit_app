
 import * as React from "react";
 import { router, useRootNavigationState, useSegments } from "expo-router";
 import { onAuthStateChanged, signOut } from "firebase/auth";
 import { FIREBASE_AUTH } from "../../../firebaseConfig";
 
 const userInitialState = {
   uid: "",
   createdAt: "",
   displayName: "",
   lastLoginAt: "",
   photoURL: "",
   providerId: "",
   email: "",
 };
 
 const contextInitialState: ContextInterface = {
   user: userInitialState,
   signIn: () => {},
   signOut: () => {},
 };
 
 interface User {
   uid: string;
   displayName: string;
   photoURL: string;
   providerId: string;
   createdAt: string;
   lastLoginAt: string;
   email: string;
 }
 
 interface ContextInterface {
   user: User | null;
   signIn: React.Dispatch<React.SetStateAction<User>>;
   signOut: () => void;
 }
 
 // create context
 const AuthContext = React.createContext<ContextInterface>(contextInitialState);
 
 // This hook can be used to access the user info.
 export function useAuth(): ContextInterface {
   const context = React.useContext<ContextInterface>(AuthContext);
 
   if (context === undefined) {
     throw new Error("useAuth must be used within a Provider");
   }
 
   return context;
 }
 
 
 export function AuthProvider({ children }: React.PropsWithChildren) {
   const [user, setUser] = React.useState<User>(userInitialState);
 
   React.useEffect(() => {
     const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
       if (user) {
         console.log(JSON.stringify(user, null, 2));
         const dataWeCareAbout: User = {
           uid: user.uid,
           displayName: user.providerData[0].displayName ?? "",
           photoURL: user.providerData[0].photoURL ?? "",
           providerId: user.providerData[0].providerId,
           email: user.providerData[0].email ?? "",
           createdAt: user.metadata.creationTime!,
           lastLoginAt: user.metadata.lastSignInTime!,
         };
         setUser(dataWeCareAbout);
       } else {
         console.log("user is not authenticated");
       }
     });
     return () => unsubscribeAuth();
   }, []);
 
   return (
     <AuthContext.Provider
       value={{
         user,
         signIn: setUser,
         signOut: () => {
           setUser(userInitialState);
           signOut(FIREBASE_AUTH);
         },
       }}
     >
       {children}
     </AuthContext.Provider>
   );
 }