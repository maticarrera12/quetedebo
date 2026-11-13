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
    // The mesa this entry belongs to, so it is updated instead of duplicated. Older entries have none.
    mesaId?: string;
}
