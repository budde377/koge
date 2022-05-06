
export interface EnhancedAsyncGenerator<T> extends AsyncGenerator<T> {
    map<TNew>(mapper: (v: T) => TNew): EnhancedAsyncGenerator<TNew>
    flatMap<TNew>(mapper: (v: T) => TNew[]): EnhancedAsyncGenerator<TNew>
    filter(p: (v: T) => boolean): EnhancedAsyncGenerator<T>
}

export function enhancedAsyncGenerator<T = unknown>(generator: AsyncGenerator<T>): EnhancedAsyncGenerator<T> {
    return {
        ...generator,
        map<TNew>(mapper: (v: T) => TNew) {
            return enhancedAsyncGenerator<TNew>(async function*(): AsyncGenerator<TNew> {
                for await (const v of generator) {
                    yield mapper(v);
                }
            }())
        },
        flatMap<TNew>(mapper: (v: T) => TNew[]) {
            return enhancedAsyncGenerator<TNew>(async function*(): AsyncGenerator<TNew> {
                for await (const v of generator) {
                    const mapped = mapper(v);
                    for (const v2 of mapped) {
                        yield v2
                    }
                }
            }())
        },
        filter(p) {
            return enhancedAsyncGenerator<T>(async function*():AsyncGenerator<T> {
                for await (const v of generator) {
                    if (p(v)) {
                        yield v
                    }
                }
            }())    
        }
    }
}