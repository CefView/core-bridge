/* eslint-enable */
/**
 * Bridge class for communicating with the CefView backend.
 */
export default class CefViewBridge {
  /**
   * The name of the bridge object on the window.
   */
  private bridgeName: string;

  /**
   * Constructs a new CefViewBridge.
   * @param bridgeName - The name of the bridge object on the window.
   */
  constructor(bridgeName: string) {
    if (!window) {
      throw new Error(
        "CefViewBridge: window is not defined, CefViewBridge can be used in only browser environment."
      );
    }

    if (!window[bridgeName]) {
      throw new Error(`CefViewBridge: window.'${bridgeName}' was not found.`);
    }
    if (typeof window[bridgeName] !== "object") {
      throw new Error(
        `CefViewBridge: window.'${bridgeName}' is not an object.`
      );
    }
    if (typeof window[bridgeName].addEventListener !== "function") {
      throw new Error(
        `CefViewBridge: method window.'${bridgeName}'.addEventListener was missing.`
      );
    }
    if (typeof window[bridgeName].removeEventListener !== "function") {
      throw new Error(
        `CefViewBridge: method window.'${bridgeName}'.removeEventListener was missing.`
      );
    }
    if (typeof window[bridgeName].invoke !== "function") {
      throw new Error(
        `CefViewBridge: method window.'${bridgeName}'.invoke was missing.`
      );
    }
    if (typeof window.CefViewQuery !== "function") {
      throw new Error(`CefViewBridge: method window.CefViewQuery was missing.`);
    }
    if (typeof window.CefViewCancelQuery !== "function") {
      throw new Error(
        `CefViewBridge: method window.CefViewCancelQuery was missing.`
      );
    }

    this.bridgeName = bridgeName;
  }

  /**
   * Adds an event listener to the bridge.
   * @param e - Event name.
   * @param handler - Event handler function.
   */
  addEventListener(e: string, handler: (...args: any[]) => void): void {
    window[this.bridgeName].addEventListener(e, handler);
  }

  /**
   * Removes an event listener from the bridge.
   * @param e - Event name.
   * @param handler - Event handler function.
   */
  removeEventListener(e: string, handler: (...args: any[]) => void): void {
    window[this.bridgeName].removeEventListener(e, handler);
  }

  /**
   * Invokes a method on the bridge.
   * @param method - Method name.
   * @param args - Arguments to pass to the method.
   */
  invoke(method: string, ...args: any[]): void {
    window[this.bridgeName].invoke(method, ...args);
  }

  /**
   * Sends a query to the CefView backend.
   * @param request - Request object.
   * @param onSuccess - Success callback, (res) => {}.
   * @param onFailure - Failure callback, (error, message) => {}.
   * @returns Query id.
   */
  query(
    request: object,
    onSuccess: (response: string) => void,
    onFailure: (error: number, message: string) => void
  ): number {
    return window.CefViewQuery({
      request: JSON.stringify(request),
      onSuccess,
      onFailure,
    });
  }

  /**
   * Cancels a previously sent query.
   * @param queryId - Query id to cancel.
   */
  cancelQuery(queryId: number): void {
    window.CefViewCancelQuery(queryId);
  }
}
