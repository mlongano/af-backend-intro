

export const throwError = (error: unknown, message: string): void => {
    if (error instanceof Error) {
        console.error('Error:', error.message);
        throw new Error(`${message}: ${error.message}`); 1
    }
    console.error(message);
    throw new Error(message);
}