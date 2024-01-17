export interface StyledButtonProps {
    title: string;
    onClick: () => void;
}

export interface TextInputProps {
    placeholder: string,
    value: string;
    onChangeText: (text: string) => void;
}

export type UserContextType = {
    user: FirebaseUser | null;
    loading: boolean;
    error: string;
    signInUser: (login: any) => Promise<void>;
    registerUser: (user: any) => Promise<void>;
    logoutUser: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
 /*    signInWithFacebook: () => Promise<any | null>; */
  };

export type FirebaseUser = {
   uid: string;
   email: string | null;
 };