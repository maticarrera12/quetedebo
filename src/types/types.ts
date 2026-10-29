export interface Friend {
    name: string;
    expense: number;
    concept?: string;
    color?: number;
}

export interface TransactionResult{
    friends: Friend[];
    totalExpense: number;
    transactions: string[];
    date: string;
    eventName?: string;
}
