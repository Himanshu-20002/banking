"use server"
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { Products, CountryCode, ProcessorTokenCreateRequestProcessorEnum, ProcessorTokenCreateRequest } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { createDwollaCustomer } from "./dwolla.actions";
import { addFundingSource } from "./dwolla.actions";

//server actions are mostly post actions
const { APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,

} = process.env;

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    const { email, firstName, lastName } = userData
    let newUserAccount;
    try {
        //Mutation / database /make fetch call
        //create user account
        const { account, database } = await createAdminClient();

        newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
        if (!newUserAccount) throw new Error("User not created");
        //create a dwolla customer for the user
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: "personal",
        })
        console.log('Dwolla Customer Data:', userData); // Log the data being sent
        if (!dwollaCustomerUrl) throw new Error("Dwolla Customer not created");
        //extracting custome id from the dwolla customer url
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl,
            }
        )


        const session = await account.createEmailPasswordSession(userData.email, userData.password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        return parseStringify(newUser);
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
        cookies().set("appwrite-session", response.secret, {
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
        const user = await account.get();
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
        return true; // Indicate success
    } catch (error) {
        console.error('Logout Error:', error);
        return false; // Indicate failure
    }
}
export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: user.name,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        }
        const response = await plaidClient.linkTokenCreate(tokenParams);
        console.log(response.data)
        return parseStringify({ linkToken: response.data.link_token })
    }
    catch (error) {
        console.error('Create Link Token Error:', error);
    }
}

export const createBankAccount = async ({

    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    sharableId,
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();
        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                sharableId,
            }
        )
        //onece we get the bank account back we can simply return to frontend
        return parseStringify(bankAccount)

    }
    catch (error) {
        console.error('Create Bank Account Error:', error);
    }
}

export const exchangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
    try {
        //Exchange public toke for access token  and item id
        const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken })
        const accessToken = response.data.access_token
        const itemId = response.data.item_id
        //get account details  from plaid using access token
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        })
        const accounts = accountsResponse.data.accounts[0]

        console.log(accounts)
        // create a processor  token for Dwolla using the access token and account id
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accounts.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        }
        const processorTokenResponse = await plaidClient.processorTokenCreate(request)
        const processorToken = processorTokenResponse.data.processor_token
        //now we need to create a funding source URL for the account using the dwalla Customer ID ,processor token and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accounts.name,
        })
        //if the funding source URL is not created , throw an error 
        if (!fundingSourceUrl) throw Error;
        // create a bank account using the user ID ,iten ID , account Id , access token  funding source url, and sharable ID
        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accounts.account_id,
            accessToken,
            fundingSourceUrl,
            sharableId: encryptId(accountData.account_id),
        })

        // Revalidate the path to reflect the changes
        revalidatePath('/');
        // Return the success message 
        return parseStringify({ publicTokenExchange: "complete" })



    }
    catch (error) {
        console.error('Exchange Public Token Error:', error);
    }

}
