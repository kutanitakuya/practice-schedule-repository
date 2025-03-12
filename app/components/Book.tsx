"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useState } from "react";
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { Session } from "next-auth";

type BookProps = {
    book: BookType;
    user: User;
    isPurchased: boolean
};

const Book = ({ book, user, isPurchased }: BookProps) => {
    const [showModal, setShowModal] = useState(false);
    // const {data: session} = useSession();
    // const user: Session["user"] | null = session?.user || null;
    const router = useRouter();

    const startCheckout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: book.title,
                    price: book.price,
                    userId: user?.id,
                    bookId: book.id,
                }),
            });
            // console.log(response);
            const responseDate = await response.json();

            if (responseDate && responseDate.checkout_url) {
                router.push(responseDate.checkout_url);
              } else {
                console.error("Invalid response data or missing checkout_url");
              }
            
        }
        catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    }

    const handlePurchaseClick = () => {
        if(isPurchased) {
            alert("すでに購入済みです。");
        } else {
            setShowModal(true);
        }
    };

    const handlePurchaseConfirm = () => {
        if(!user) {
            setShowModal(false);
            // ログインページへリダイレクト
            router.push("/api/auth/signin");
        } else {
            // Stripeで決済する。
            startCheckout();
        }
    }
    return (
        <>
            {/* アニメーションスタイル */}
            <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

            <div className="flex flex-col items-center m-4">
                <a onClick={handlePurchaseClick} className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none">
                    <Image
                        priority
                        src={book.thumbnail?.url || "/practice.png"}
                        alt={book.title}
                        width={450}
                        height={350}
                        className="rounded-t-md"
                    />
                    <div className="px-4 py-4 bg-slate-100 rounded-b-md">
                        <h2 className="text-lg font-semibold">{book.title}</h2>
                        <p className="mt-2 text-md text-slate-700">¥ {book.price}</p>
                    </div>
                </a>

                {showModal && (
                    // <div className="absolute top-0 left-0 right-0 bottom-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal">
                    <div className="absolute top-0 left-0 right-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal"
                        style={{ height: `${window.innerHeight}px` }}>
                        <div className="bg-white p-8 rounded-lg">
                            <h3 className="text-xl mb-4">購入しますか？</h3>
                            <button onClick={handlePurchaseConfirm} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                                購入する
                            </button>
                            <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                キャンセル
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default Book;