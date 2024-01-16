export interface StyledButtonProps {
    title: string;
    onPress: () => void;
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
    signInWithFacebook: () => Promise<any | null | void >;
  };

export type FirebaseUser = {
   uid: string;
   email: string | null;
 };

/*  export type User = {
    email: string,
    password: string,
    name?: string,
    lastName?: string
 }

 */