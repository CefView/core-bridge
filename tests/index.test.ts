import { describe, expect } from "@jest/globals";

import { createBridge } from "../dist/index";

describe("createBridge", () => {
  let originalWindow: any;
  let mockBridge: any;

  beforeEach(() => {
    originalWindow = global.window;
    mockBridge = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      invoke: jest.fn(),
    };
    (global as any).window = {
      cefViewQuery: jest.fn().mockReturnValue(42),
      cefViewCancelQuery: jest.fn(),
      myBridge: mockBridge,
    };
  });

  afterEach(() => {
    global.window = originalWindow;
    jest.clearAllMocks();
  });

  it("should construct with valid bridge", () => {
    expect(() => createBridge("myBridge")).not.toBeUndefined;
  });

  it("should throw if window is missing", () => {
    (global as any).window = undefined;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });

  it("should throw if bridge is missing", () => {
    delete (global as any).window.myBridge;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });

  it("should throw if bridge is not object", () => {
    (global as any).window.myBridge = 123;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });

  it("should throw if addEventListener is missing", () => {
    delete mockBridge.addEventListener;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });

  it("should throw if removeEventListener is missing", () => {
    mockBridge.addEventListener = jest.fn();
    delete mockBridge.removeEventListener;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });

  it("should throw if invoke is missing", () => {
    mockBridge.removeEventListener = jest.fn();
    delete mockBridge.invoke;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });

  it("should throw if CefViewQuery is missing", () => {
    mockBridge.invoke = jest.fn();
    delete (global as any).window.cefViewQuery;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });

  it("should throw if CefViewCancelQuery is missing", () => {
    (global as any).window.cefViewQuery = jest.fn();
    delete (global as any).window.cefViewCancelQuery;
    expect(() => createBridge("myBridge")).toBeUndefined;
  });
});
