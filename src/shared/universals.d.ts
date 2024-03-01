/**
 * @description Declare event types for listening with listenTS() and dispatching with dispatchTS()
 */
export type EventTS = {
  myCustomEvent: {
    oneValue: string;
    anotherValue: number;
  };
};
