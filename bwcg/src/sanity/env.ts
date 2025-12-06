export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-23'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET||'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID||'e2yi0er0'

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
