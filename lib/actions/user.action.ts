"use server"
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

//server actions are mostly post actions

export const signUp = async (userData: SignUpParams) => {
    try {
        //Mutation / database /make fetch call
        //create user account
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(ID.unique(), userData.email, userData.password, `${userData.firstName} ${userData.lastName}`);
        const session = await account.createEmailPasswordSession(userData.email, userData.password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify(newUserAccount);
    }
    catch (error) {
        console.error('Error', error)
    }
}

export const signIn = async ({ email, password }: signInProps) => {
    try {
        // Mutation / database / make fetch call
        const { account } = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password);
        cookies().set("appwrite-session",response.secret,{
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        })
       
        return parseStringify(response);
    } catch (error) {
        console.error('Sign-in Error:', error);

    }
}
// ... your initilization functions

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        //in nextjs we can not send objects  from server to client so we need to parse it to string
       const user  = await account.get();
       console.log(user)
       return parseStringify(user);
    } catch (error) {
      console.error('Get Logged-in User Error:', error);
    }
}

export const logoutAccount = async () => {
     try {
        const { account } = await createSessionClient();
        cookies().delete("appwrite-session");
        await account.deleteSession("current");
        
     } catch (error) {
        console.error('Logout Error:', error);
     }
}
