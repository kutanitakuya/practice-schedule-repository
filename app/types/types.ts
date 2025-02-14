type BookType = {
    id: string;
    title: string;
    content: string;
    price: number;
    thumbnail: {url: string};
    createdAt: string;
    updatedAt: string;
};

type User = {
    id: String;
    name?: string | null;
    email?: string | null;
    image?: string | null;

}

type Purchase = {
    id: string;
    useId: string;
    bookId: string;
    createAt: string;
    user: User;
}

export type { BookType, User, Purchase };