export interface BookType {
    title: String;
    synopsis?: String;
    author: String;
    year: number;
}

export interface ErrorData {
    message: String;
    status: number;
}