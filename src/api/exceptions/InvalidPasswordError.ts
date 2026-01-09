export class InvalidPasswordError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, InvalidPasswordError.prototype);
        this.name = 'InvalidPasswordError';
    }
}