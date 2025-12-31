import type * as runtime from "@prisma/client/runtime/library";
import type * as Prisma from "../internal/prismaNamespace.js";
/**
 * Model user_information
 *
 */
export type user_informationModel = runtime.Types.Result.DefaultSelection<Prisma.$user_informationPayload>;
export type AggregateUser_information = {
    _count: User_informationCountAggregateOutputType | null;
    _min: User_informationMinAggregateOutputType | null;
    _max: User_informationMaxAggregateOutputType | null;
};
export type User_informationMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
};
export type User_informationMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
};
export type User_informationCountAggregateOutputType = {
    id: number;
    email: number;
    firstName: number;
    lastName: number;
    phoneNumber: number;
    _all: number;
};
export type User_informationMinAggregateInputType = {
    id?: true;
    email?: true;
    firstName?: true;
    lastName?: true;
    phoneNumber?: true;
};
export type User_informationMaxAggregateInputType = {
    id?: true;
    email?: true;
    firstName?: true;
    lastName?: true;
    phoneNumber?: true;
};
export type User_informationCountAggregateInputType = {
    id?: true;
    email?: true;
    firstName?: true;
    lastName?: true;
    phoneNumber?: true;
    _all?: true;
};
export type User_informationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which user_information to aggregate.
     */
    where?: Prisma.user_informationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of user_informations to fetch.
     */
    orderBy?: Prisma.user_informationOrderByWithRelationInput | Prisma.user_informationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.user_informationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` user_informations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` user_informations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned user_informations
    **/
    _count?: true | User_informationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: User_informationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: User_informationMaxAggregateInputType;
};
export type GetUser_informationAggregateType<T extends User_informationAggregateArgs> = {
    [P in keyof T & keyof AggregateUser_information]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser_information[P]> : Prisma.GetScalarType<T[P], AggregateUser_information[P]>;
};
export type user_informationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.user_informationWhereInput;
    orderBy?: Prisma.user_informationOrderByWithAggregationInput | Prisma.user_informationOrderByWithAggregationInput[];
    by: Prisma.User_informationScalarFieldEnum[] | Prisma.User_informationScalarFieldEnum;
    having?: Prisma.user_informationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: User_informationCountAggregateInputType | true;
    _min?: User_informationMinAggregateInputType;
    _max?: User_informationMaxAggregateInputType;
};
export type User_informationGroupByOutputType = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    _count: User_informationCountAggregateOutputType | null;
    _min: User_informationMinAggregateOutputType | null;
    _max: User_informationMaxAggregateOutputType | null;
};
type GetUser_informationGroupByPayload<T extends user_informationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<User_informationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof User_informationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], User_informationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], User_informationGroupByOutputType[P]>;
}>>;
export type user_informationWhereInput = {
    AND?: Prisma.user_informationWhereInput | Prisma.user_informationWhereInput[];
    OR?: Prisma.user_informationWhereInput[];
    NOT?: Prisma.user_informationWhereInput | Prisma.user_informationWhereInput[];
    id?: Prisma.StringFilter<"user_information"> | string;
    email?: Prisma.StringFilter<"user_information"> | string;
    firstName?: Prisma.StringFilter<"user_information"> | string;
    lastName?: Prisma.StringFilter<"user_information"> | string;
    phoneNumber?: Prisma.StringNullableFilter<"user_information"> | string | null;
};
export type user_informationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    _relevance?: Prisma.user_informationOrderByRelevanceInput;
};
export type user_informationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    AND?: Prisma.user_informationWhereInput | Prisma.user_informationWhereInput[];
    OR?: Prisma.user_informationWhereInput[];
    NOT?: Prisma.user_informationWhereInput | Prisma.user_informationWhereInput[];
    firstName?: Prisma.StringFilter<"user_information"> | string;
    lastName?: Prisma.StringFilter<"user_information"> | string;
    phoneNumber?: Prisma.StringNullableFilter<"user_information"> | string | null;
}, "id" | "email">;
export type user_informationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.user_informationCountOrderByAggregateInput;
    _max?: Prisma.user_informationMaxOrderByAggregateInput;
    _min?: Prisma.user_informationMinOrderByAggregateInput;
};
export type user_informationScalarWhereWithAggregatesInput = {
    AND?: Prisma.user_informationScalarWhereWithAggregatesInput | Prisma.user_informationScalarWhereWithAggregatesInput[];
    OR?: Prisma.user_informationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.user_informationScalarWhereWithAggregatesInput | Prisma.user_informationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"user_information"> | string;
    email?: Prisma.StringWithAggregatesFilter<"user_information"> | string;
    firstName?: Prisma.StringWithAggregatesFilter<"user_information"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"user_information"> | string;
    phoneNumber?: Prisma.StringNullableWithAggregatesFilter<"user_information"> | string | null;
};
export type user_informationCreateInput = {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
};
export type user_informationUncheckedCreateInput = {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
};
export type user_informationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type user_informationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type user_informationCreateManyInput = {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
};
export type user_informationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type user_informationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phoneNumber?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type user_informationOrderByRelevanceInput = {
    fields: Prisma.user_informationOrderByRelevanceFieldEnum | Prisma.user_informationOrderByRelevanceFieldEnum[];
    sort: Prisma.SortOrder;
    search: string;
};
export type user_informationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
};
export type user_informationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
};
export type user_informationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phoneNumber?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type user_informationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phoneNumber?: boolean;
}, ExtArgs["result"]["user_information"]>;
export type user_informationSelectScalar = {
    id?: boolean;
    email?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phoneNumber?: boolean;
};
export type user_informationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "firstName" | "lastName" | "phoneNumber", ExtArgs["result"]["user_information"]>;
export type $user_informationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "user_information";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
    }, ExtArgs["result"]["user_information"]>;
    composites: {};
};
export type user_informationGetPayload<S extends boolean | null | undefined | user_informationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$user_informationPayload, S>;
export type user_informationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<user_informationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: User_informationCountAggregateInputType | true;
};
export interface user_informationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['user_information'];
        meta: {
            name: 'user_information';
        };
    };
    /**
     * Find zero or one User_information that matches the filter.
     * @param {user_informationFindUniqueArgs} args - Arguments to find a User_information
     * @example
     * // Get one User_information
     * const user_information = await prisma.user_information.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_informationFindUniqueArgs>(args: Prisma.SelectSubset<T, user_informationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one User_information that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {user_informationFindUniqueOrThrowArgs} args - Arguments to find a User_information
     * @example
     * // Get one User_information
     * const user_information = await prisma.user_information.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_informationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, user_informationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User_information that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_informationFindFirstArgs} args - Arguments to find a User_information
     * @example
     * // Get one User_information
     * const user_information = await prisma.user_information.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_informationFindFirstArgs>(args?: Prisma.SelectSubset<T, user_informationFindFirstArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first User_information that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_informationFindFirstOrThrowArgs} args - Arguments to find a User_information
     * @example
     * // Get one User_information
     * const user_information = await prisma.user_information.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_informationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, user_informationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more User_informations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_informationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_informations
     * const user_informations = await prisma.user_information.findMany()
     *
     * // Get first 10 User_informations
     * const user_informations = await prisma.user_information.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const user_informationWithIdOnly = await prisma.user_information.findMany({ select: { id: true } })
     *
     */
    findMany<T extends user_informationFindManyArgs>(args?: Prisma.SelectSubset<T, user_informationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a User_information.
     * @param {user_informationCreateArgs} args - Arguments to create a User_information.
     * @example
     * // Create one User_information
     * const User_information = await prisma.user_information.create({
     *   data: {
     *     // ... data to create a User_information
     *   }
     * })
     *
     */
    create<T extends user_informationCreateArgs>(args: Prisma.SelectSubset<T, user_informationCreateArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many User_informations.
     * @param {user_informationCreateManyArgs} args - Arguments to create many User_informations.
     * @example
     * // Create many User_informations
     * const user_information = await prisma.user_information.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends user_informationCreateManyArgs>(args?: Prisma.SelectSubset<T, user_informationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Delete a User_information.
     * @param {user_informationDeleteArgs} args - Arguments to delete one User_information.
     * @example
     * // Delete one User_information
     * const User_information = await prisma.user_information.delete({
     *   where: {
     *     // ... filter to delete one User_information
     *   }
     * })
     *
     */
    delete<T extends user_informationDeleteArgs>(args: Prisma.SelectSubset<T, user_informationDeleteArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one User_information.
     * @param {user_informationUpdateArgs} args - Arguments to update one User_information.
     * @example
     * // Update one User_information
     * const user_information = await prisma.user_information.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends user_informationUpdateArgs>(args: Prisma.SelectSubset<T, user_informationUpdateArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more User_informations.
     * @param {user_informationDeleteManyArgs} args - Arguments to filter User_informations to delete.
     * @example
     * // Delete a few User_informations
     * const { count } = await prisma.user_information.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends user_informationDeleteManyArgs>(args?: Prisma.SelectSubset<T, user_informationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more User_informations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_informationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_informations
     * const user_information = await prisma.user_information.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends user_informationUpdateManyArgs>(args: Prisma.SelectSubset<T, user_informationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create or update one User_information.
     * @param {user_informationUpsertArgs} args - Arguments to update or create a User_information.
     * @example
     * // Update or create a User_information
     * const user_information = await prisma.user_information.upsert({
     *   create: {
     *     // ... data to create a User_information
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_information we want to update
     *   }
     * })
     */
    upsert<T extends user_informationUpsertArgs>(args: Prisma.SelectSubset<T, user_informationUpsertArgs<ExtArgs>>): Prisma.Prisma__user_informationClient<runtime.Types.Result.GetResult<Prisma.$user_informationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of User_informations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_informationCountArgs} args - Arguments to filter User_informations to count.
     * @example
     * // Count the number of User_informations
     * const count = await prisma.user_information.count({
     *   where: {
     *     // ... the filter for the User_informations we want to count
     *   }
     * })
    **/
    count<T extends user_informationCountArgs>(args?: Prisma.Subset<T, user_informationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], User_informationCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a User_information.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_informationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_informationAggregateArgs>(args: Prisma.Subset<T, User_informationAggregateArgs>): Prisma.PrismaPromise<GetUser_informationAggregateType<T>>;
    /**
     * Group by User_information.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_informationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends user_informationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: user_informationGroupByArgs['orderBy'];
    } : {
        orderBy?: user_informationGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, user_informationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_informationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the user_information model
     */
    readonly fields: user_informationFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for user_information.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__user_informationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the user_information model
 */
export interface user_informationFieldRefs {
    readonly id: Prisma.FieldRef<"user_information", 'String'>;
    readonly email: Prisma.FieldRef<"user_information", 'String'>;
    readonly firstName: Prisma.FieldRef<"user_information", 'String'>;
    readonly lastName: Prisma.FieldRef<"user_information", 'String'>;
    readonly phoneNumber: Prisma.FieldRef<"user_information", 'String'>;
}
/**
 * user_information findUnique
 */
export type user_informationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * Filter, which user_information to fetch.
     */
    where: Prisma.user_informationWhereUniqueInput;
};
/**
 * user_information findUniqueOrThrow
 */
export type user_informationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * Filter, which user_information to fetch.
     */
    where: Prisma.user_informationWhereUniqueInput;
};
/**
 * user_information findFirst
 */
export type user_informationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * Filter, which user_information to fetch.
     */
    where?: Prisma.user_informationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of user_informations to fetch.
     */
    orderBy?: Prisma.user_informationOrderByWithRelationInput | Prisma.user_informationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for user_informations.
     */
    cursor?: Prisma.user_informationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` user_informations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` user_informations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of user_informations.
     */
    distinct?: Prisma.User_informationScalarFieldEnum | Prisma.User_informationScalarFieldEnum[];
};
/**
 * user_information findFirstOrThrow
 */
export type user_informationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * Filter, which user_information to fetch.
     */
    where?: Prisma.user_informationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of user_informations to fetch.
     */
    orderBy?: Prisma.user_informationOrderByWithRelationInput | Prisma.user_informationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for user_informations.
     */
    cursor?: Prisma.user_informationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` user_informations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` user_informations.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of user_informations.
     */
    distinct?: Prisma.User_informationScalarFieldEnum | Prisma.User_informationScalarFieldEnum[];
};
/**
 * user_information findMany
 */
export type user_informationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * Filter, which user_informations to fetch.
     */
    where?: Prisma.user_informationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of user_informations to fetch.
     */
    orderBy?: Prisma.user_informationOrderByWithRelationInput | Prisma.user_informationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing user_informations.
     */
    cursor?: Prisma.user_informationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` user_informations from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` user_informations.
     */
    skip?: number;
    distinct?: Prisma.User_informationScalarFieldEnum | Prisma.User_informationScalarFieldEnum[];
};
/**
 * user_information create
 */
export type user_informationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * The data needed to create a user_information.
     */
    data: Prisma.XOR<Prisma.user_informationCreateInput, Prisma.user_informationUncheckedCreateInput>;
};
/**
 * user_information createMany
 */
export type user_informationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_informations.
     */
    data: Prisma.user_informationCreateManyInput | Prisma.user_informationCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * user_information update
 */
export type user_informationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * The data needed to update a user_information.
     */
    data: Prisma.XOR<Prisma.user_informationUpdateInput, Prisma.user_informationUncheckedUpdateInput>;
    /**
     * Choose, which user_information to update.
     */
    where: Prisma.user_informationWhereUniqueInput;
};
/**
 * user_information updateMany
 */
export type user_informationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update user_informations.
     */
    data: Prisma.XOR<Prisma.user_informationUpdateManyMutationInput, Prisma.user_informationUncheckedUpdateManyInput>;
    /**
     * Filter which user_informations to update
     */
    where?: Prisma.user_informationWhereInput;
    /**
     * Limit how many user_informations to update.
     */
    limit?: number;
};
/**
 * user_information upsert
 */
export type user_informationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * The filter to search for the user_information to update in case it exists.
     */
    where: Prisma.user_informationWhereUniqueInput;
    /**
     * In case the user_information found by the `where` argument doesn't exist, create a new user_information with this data.
     */
    create: Prisma.XOR<Prisma.user_informationCreateInput, Prisma.user_informationUncheckedCreateInput>;
    /**
     * In case the user_information was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.user_informationUpdateInput, Prisma.user_informationUncheckedUpdateInput>;
};
/**
 * user_information delete
 */
export type user_informationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
    /**
     * Filter which user_information to delete.
     */
    where: Prisma.user_informationWhereUniqueInput;
};
/**
 * user_information deleteMany
 */
export type user_informationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which user_informations to delete
     */
    where?: Prisma.user_informationWhereInput;
    /**
     * Limit how many user_informations to delete.
     */
    limit?: number;
};
/**
 * user_information without action
 */
export type user_informationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_information
     */
    select?: Prisma.user_informationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the user_information
     */
    omit?: Prisma.user_informationOmit<ExtArgs> | null;
};
export {};
//# sourceMappingURL=user_information.d.ts.map