import {describe, expect, it} from "vitest";
import {
    badRequest,
    forbiddenRequest,
    genericResponse,
    internalServerError,
    notFound,
    successResponse,
    unauthorizedRequest,
} from "../../src/api/ApiResponseContract.js";

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

describe("ApiResponseContract helpers", () => {
    it("returns a success response", () => {
        const res = createMockResponse();
        successResponse(res, {ok: true});

        expect(res.statusCode).toBe(200);
        expect(res.payload).toEqual({code: "00", message: "Success", data: {ok: true}});
    });

    it("returns a bad request response", () => {
        const res = createMockResponse();
        badRequest(res, "invalid payload");

        expect(res.statusCode).toBe(400);
        expect(res.payload).toEqual({code: "99", message: "Bad Request", data: "invalid payload"});
    });

    it("returns an unauthorized response", () => {
        const res = createMockResponse();
        unauthorizedRequest(res, "missing token");

        expect(res.statusCode).toBe(401);
        expect(res.payload).toEqual({
            code: "41",
            message: "Unauthorized Access",
            data: "missing token",
        });
    });

    it("returns a forbidden response", () => {
        const res = createMockResponse();
        forbiddenRequest(res, "no access");

        expect(res.statusCode).toBe(403);
        expect(res.payload).toEqual({code: 43, message: "Action Forbidden", data: "no access"});
    });

    it("returns a not-found response", () => {
        const res = createMockResponse();
        notFound(res, "missing");

        expect(res.statusCode).toBe(404);
        expect(res.payload).toEqual({code: "44", message: "Not found", data: "missing"});
    });

    it("returns an internal server response", () => {
        const res = createMockResponse();
        internalServerError(res, "boom");

        expect(res.statusCode).toBe(500);
        expect(res.payload).toEqual({code: "100", message: "internal server error", data: "boom"});
    });

    it("returns a generic response", () => {
        const res = createMockResponse();
        genericResponse(res, 201, "01", "Created", {id: 1});

        expect(res.statusCode).toBe(201);
        expect(res.payload).toEqual({code: "01", message: "Created", data: {id: 1}});
    });
});
