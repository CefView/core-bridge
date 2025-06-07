/**
 * Type for the query object passed to CefViewQuery.
 */
type CefViewQueryObject = {
    /**
     * The request string to be sent to the backend.
     */
    request: string;

    /**
     * Callback function to handle successful responses.
     * @param response 
     * @returns 
     */
    onSuccess: (response: any) => void;

    /**
     * Callback function to handle errors.
     * @param error 
     * @param message 
     * @returns 
     */
    onFailure: (error: any, message: string) => void;
};

/**
 * Extends the Window interface to include CefView specific methods.
 */
interface Window {
    [key: string]: any;

    /**
     * The bridge object for CefView.
     * @param req - Request object containing the query details.
     * @returns The query id.
     */
    CefViewQuery: (query: CefViewQueryObject) => number;

    /**
     * Cancels a previously sent query.
     * @param queryId 
     */
    CefViewCancelQuery: (queryId: any) => void;
}