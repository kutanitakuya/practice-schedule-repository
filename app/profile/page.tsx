import { getServerSession } from "next-auth";
import nextAuthOptions from "../lib/next-auth/options";
import Image from "next/image";
import { BookType, Purchase, User } from "../types/types";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {
    const session = await getServerSession(nextAuthOptions);
    const user = session?.user as User;

    let purchasesDetailBooks: BookType[]= [];

    // ユーザが存在する場合、購入履歴を取得
    if (user) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
      );
    
      const purchasesData = (await response.json()).purchases;

      purchasesDetailBooks = await Promise.all(
        purchasesData.map(async(purchase: Purchase) => {
            return await getDetailBook(purchase.bookId);
      }));
    }
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-t-md"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">購入内容</span>
      <div className="flex items-center gap-6">
        {purchasesDetailBooks.map((purchaseDetailBook: BookType) => (
          <PurchaseDetailBook 
            key={purchaseDetailBook.id} 
            purchaseDetailBook={purchaseDetailBook} 
          />
        ))}
      </div>
    </div>
  );
}