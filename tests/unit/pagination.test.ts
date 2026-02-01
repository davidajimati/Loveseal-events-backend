import {describe, expect, it} from "vitest";
import {
    buildPaginationMeta,
    DEFAULT_LIMIT,
    DEFAULT_PAGE,
    DEFAULT_SORT_ORDER,
} from "../../src/common/pagination.dto.js";

describe("pagination helpers", () => {
    it("builds pagination metadata with next/previous flags", () => {
        const meta = buildPaginationMeta(2, 10, 35);

        expect(meta).toEqual({
            currentPage: 2,
            itemsPerPage: 10,
            totalItems: 35,
            totalPages: 4,
            hasNextPage: true,
            hasPreviousPage: true,
        });
    });

    it("exposes default pagination constants", () => {
        expect(DEFAULT_PAGE).toBe(1);
        expect(DEFAULT_LIMIT).toBe(10);
        expect(DEFAULT_SORT_ORDER).toBe("desc");
    });
});
