const pluck = <T, K extends keyof T>(property: K) => (element: T): T[K] => element[property]

export {pluck}