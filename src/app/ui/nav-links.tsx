import Link from "next/link";
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from "@clerk/nextjs";
export default function NavLinks() {
    return (
        <div className="flex content-center absolute z-10 translate-y-[7px] xl:translate-x-[1530px] macairm2:translate-x-[1070px]">
            <ul className="flex justify-end gap-4 font-medium text-white">
                <li>
                    <ClerkProvider>
                        <SignedOut>
                            <SignInButton>
                                <button className="rounded-full border border-solid border-transparent dark:hover:text-teal-800">Log In/Register</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </ClerkProvider>
                </li>
                <li>
                    <Link className="rounded-full border border-solid border-transparent dark:hover:text-teal-800"
                    href="/cart">View Cart</Link>
                </li>
                <li>
                    <Link className="rounded-full border border-solid border-transparent dark:hover:text-teal-800"
                    href="/products">Purchase History</Link>
                </li>
            </ul>
        </div>
    );
}