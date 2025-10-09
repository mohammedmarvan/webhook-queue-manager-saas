export interface tableSearchParam {
    search: string,
    limit: number,
    page: number
}

export interface projectCreateParam {
    name: string,
    userId: bigint,
    description?: string
}

export type projectUpdateParam = Partial<Omit<projectCreateParam, "userId">>