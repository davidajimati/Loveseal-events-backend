import {describe, expect, it, vi} from "vitest";
import {
    BaseService,
    EntityStatus,
    type PaginationDto,
} from "../../src/common/index.js";

type Example = {
    id: string;
    name: string;
    status?: EntityStatus;
};

const createDelegate = () => ({
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    updateMany: vi.fn(),
});

class TestService extends BaseService<Example> {
    constructor(delegate = createDelegate()) {
        super({} as never, delegate, {
            primaryKey: "id",
            statusField: "status",
            searchableFields: ["name"],
            defaultOrderBy: {name: "asc"},
        });
    }

    public exposeBuildPkWhere(id: string) {
        return this.buildPkWhere(id);
    }

    public exposeBuildSearchFilter(search?: string) {
        return this.buildSearchFilter(search);
    }

    public exposeFindFirst(where: Record<string, unknown>) {
        return this.findFirst(where);
    }

    public exposeFindMany(options: Record<string, unknown>) {
        return this.findMany(options);
    }

    public exposeCount(where?: Record<string, unknown>) {
        return this.count(where);
    }

    public exposePaginateWithWhere(pagination: PaginationDto, where: Record<string, unknown>) {
        return this.paginateWithWhere(pagination, where);
    }
}

describe("BaseService", () => {
    it("builds primary key filters", () => {
        const service = new TestService();
        expect(service.exposeBuildPkWhere("abc")).toEqual({id: "abc"});
    });

    it("creates entities via the delegate", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.create.mockResolvedValue({id: "1", name: "Test"});

        await expect(service.create({name: "Test"})).resolves.toEqual({id: "1", name: "Test"});
        expect(delegate.create).toHaveBeenCalledWith({data: {name: "Test"}});
    });

    it("updates entities when they exist", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.findUnique.mockResolvedValue({id: "1", name: "Old"});
        delegate.update.mockResolvedValue({id: "1", name: "New"});

        const result = await service.modify("1", {name: "New"});
        expect(result).toEqual({id: "1", name: "New"});
        expect(delegate.update).toHaveBeenCalledWith({where: {id: "1"}, data: {name: "New"}});
    });

    it("throws when modifying missing entities", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.findUnique.mockResolvedValue(null);

        await expect(service.modify("missing", {name: "Test"})).rejects.toThrow(
            "Entity with id=missing not found",
        );
    });

    it("finds entities by primary key", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.findUnique.mockResolvedValue({id: "1", name: "Test"});

        await expect(service.findByPk("1")).resolves.toEqual({id: "1", name: "Test"});
        expect(delegate.findUnique).toHaveBeenCalledWith({where: {id: "1"}});
    });

    it("checks existence with count", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.count.mockResolvedValue(2);

        await expect(service.exists({name: "Test"})).resolves.toBe(true);
        expect(delegate.count).toHaveBeenCalledWith({where: {name: "Test"}});
    });

    it("activates and deactivates entities", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);

        await service.activate(["1"]);
        expect(delegate.updateMany).toHaveBeenCalledWith({
            where: {id: {in: ["1"]}},
            data: {status: EntityStatus.ACTIVE},
        });

        await service.deactivate(["2"]);
        expect(delegate.updateMany).toHaveBeenCalledWith({
            where: {id: {in: ["2"]}},
            data: {status: EntityStatus.INACTIVE},
        });
    });

    it("removes entities when they exist", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.findUnique.mockResolvedValue({id: "1", name: "Test"});

        await service.remove("1");
        expect(delegate.delete).toHaveBeenCalledWith({where: {id: "1"}});
    });

    it("builds search filters from searchable fields", () => {
        const service = new TestService();
        expect(service.exposeBuildSearchFilter("hello")).toEqual({
            OR: [{name: {contains: "hello"}}],
        });
    });

    it("paginates data with defaults", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.findMany.mockResolvedValue([{id: "1", name: "Test"}]);
        delegate.count.mockResolvedValue(1);

        const result = await service.paginate({});

        expect(result.data).toEqual([{id: "1", name: "Test"}]);
        expect(result.meta.totalItems).toBe(1);
        expect(delegate.findMany).toHaveBeenCalled();
    });

    it("paginates data with where clause", async () => {
        const delegate = createDelegate();
        const service = new TestService(delegate);
        delegate.findMany.mockResolvedValue([{id: "1", name: "Test"}]);
        delegate.count.mockResolvedValue(1);

        const result = await service.exposePaginateWithWhere({page: 1, limit: 5}, {status: "ACTIVE"});

        expect(result.data).toEqual([{id: "1", name: "Test"}]);
        expect(delegate.findMany).toHaveBeenCalledWith(
            expect.objectContaining({where: {status: "ACTIVE"}, take: 5}),
        );
    });
});
