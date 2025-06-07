# core-bridge
The bridge object wrapper for CefView.

## Example

```javascript
// create CefViewBridge instance
let myBridge = new CefViewBridge("MyBridge");

///////////////////////////////////////////////////////////////
// listen for native events
function onChangeColorEvent(color) {
  console.log("request change background color to: ", color);
  // change the background color
  document.getElementById("main").style.backgroundColor = color;
}

// add event listener for colorChange event
myBridge.addEventListener("colorChange", onChangeColorEvent);
// remove event listener for colorChange event
myBridge.removeEventListener("colorChange", onChangeColorEvent);

///////////////////////////////////////////////////////////////
// invoke native methods
let arg = {
  d1: true,
  d2: 5678,
  d3: "test object",
  d4: [1, "2", false],
  d5: {
    d1: true,
    d2: 5678,
    d3: "nested object",
    d4: [1, "2", true],
  },
};
// invoke native method with parameters
// The native method prototype is:
// void TestMethod(int arg1, bool arg2, std::string arg3, JsonObject d4);
myBridge.invoke("TestMethod", 1, false, "arg3", arg);

///////////////////////////////////////////////////////////////
// exchange data with native using CefViewQuery
var request = {
  a: 1234,
  b: false,
  c: "test string",
  d: {
    d1: true,
    d2: 5678,
    d3: "nested object",
    d4: [1, "2", true],
  },
};
let queryId = myBridge.cefViewQuery(
  request,
  (response) => {
    alert(response);
  },
  (error_code, error_message) => {
    alert(`query failed, code: ${error_code}, msg: ${error_message}`);
  }
);

// you can cancel the query before it is processed by native
myBridge.cefViewQueryCancel(queryId);

```

## Reference

### CefViewBridge

Bridge class for communicating with the CefView backend.

#### Constructor

```typescript
constructor(bridgeName: string)
```
- **bridgeName**: The name of the bridge object on the window.

#### Methods

```typescript
addEventListener(e: string, handler: (...args: any[]) => void): void
```

  - Adds an event listener to the bridge.
  - **e**: Event name.
  - **handler**: Event handler function.

```typescript
removeEventListener(e: string, handler: (...args: any[]) => void): void
```
  - Removes an event listener from the bridge.
  - **e**: Event name.
  - **handler**: Event handler function.

```typescript
invoke(method: string, ...args: any[]): void
```
  - Invokes a method on the bridge.
  - **method**: Method name.
  - **args**: Arguments to pass to the method.

```typescript
query(request: object, onSuccess: (response: string) => void, onFailure: (error: number, message: string) => void): number
```
  - Sends a query to the CefView backend.
  - **request**: Request object.
  - **onSuccess**: Success callback, `(res) => {}`.
  - **onFailure**: Failure callback, `(error, message) => {}`.
  - **Returns**: Query id.

```typescript
cancelQuery(queryId: number): void
```
  - Cancels a previously sent query.
  - **queryId**: Query id to cancel.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for bug fixes, improvements, or new features.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and submit a pull request

## License

This project is licensed under the MIT License. See [LICENSE](../LICENSE) for details.
