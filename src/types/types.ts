export interface Friend {
    name: string;
    expense: number;
}

export interface TransactionResult{
    friends: Friend[];
    totalExpense: number;
    transactions: string[];
    date: string
}