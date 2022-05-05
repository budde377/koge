
export type Output = {
    data: string,
    path: string
}

export function out(path: string, data: string): Output {
    return {path, data}
}
