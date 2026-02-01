import {describe, expect, it} from "vitest";
import {z} from "zod";
import {exceptionsHandler, handleZodError} from "../../src/api/exceptions/exceptionsHandler.js";
import {HttpError} from "../../src/api/exceptions/HttpError.js";
import {InvalidPasswordError} from "../../src/api/exceptions/InvalidPasswordError.js";

const createMockResponse = () => {
    const res: {
        statusCode?: number;
        payload?: unknown;
        status: (code: number) => typeof res;
        json: (body: unknown) => typeof res;
    } = {
        status(code: number) {
            res.statusCode = code;
            return res;
        },
        json(body: unknown) {
            res.payload = body;
            return res;
        },
    };

    return res;
};

describe("exception helpers", () => {
    it("captures HttpError responses", () => {
        const res = createMockResponse();
        exceptionsHandler(new HttpError("Not Found", 404), {} as never, res as never, () => undefined);

        expect(res.statusCode).toBe(404);
        expect(res.payload).toEqual({message: "Not Found"});
    });

    it("captures InvalidPasswordError responses", () => {
        const res = createMockResponse();
        exceptionsHandler(
            new InvalidPasswordError("Invalid password", 401),
            {} as never,
            res as never,
            () => undefined,
        );

        expect(res.statusCode).toBe(401);
        expect(res.payload).toEqual({message: "Invalid password"});
    });

    it("falls back to a 500 error for unknown errors", () => {
        const res = createMockResponse();
        exceptionsHandler(new Error("Boom"), {} as never, res as never, () => undefined);

        expect(res.statusCode).toBe(500);
        expect(res.payload).toEqual({message: "Internal Server Error"});
    });

    it("maps zod errors to bad request payloads", async () => {
        const res = createMockResponse();
        const schema = z.object({role: z.enum(["ADMIN", "USER"])});
        const result = schema.safeParse({role: "INVALID"});
        if (!result.success) {
            await handleZodError(res as never, result.error);
        }

        expect(res.statusCode).toBe(400);
        expect(res.payload).toEqual({
            code: "99",
            message: "Bad Request",
            data: ["role: Invalid option: expected one of ADMIN, USER"],
        });
    });
});
