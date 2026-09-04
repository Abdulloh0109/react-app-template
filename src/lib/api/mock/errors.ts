/**
 * Deliberately dependency-free so mock handlers can import it without creating
 * a cycle back through the adapter (adapter -> handlers -> adapter).
 */

/**
 * Throw this from a mock handler to produce a real HTTP failure — the adapter
 * turns it into an `AxiosError` with the given status, so interceptors and UI
 * error states can be exercised without a backend.
 */
export class MockHttpError extends Error {
  constructor(
    public status: number,
    public detail = 'Request failed'
  ) {
    super(detail)
    this.name = 'MockHttpError'
  }
}
