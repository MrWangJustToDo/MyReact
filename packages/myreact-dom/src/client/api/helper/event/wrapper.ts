type MyReactEvent = Event & {
  _isMyReactEvent: boolean;
  _isDefaultPrevented: boolean;
  _isPropagationStopped: boolean;
  nativeEvent: Event;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
};

export const wrapper = (e: Event | MyReactEvent) => {
  if (!e) return;
  if ((e as MyReactEvent)._isMyReactEvent) {
    return e as MyReactEvent;
  }
  const typedE = e as MyReactEvent;
  typedE.nativeEvent = e;
  const originalPreventDefault = typedE.preventDefault;
  const originalStopPropagation = typedE.stopPropagation;
  typedE.preventDefault = function () {
    typedE._isDefaultPrevented = true;
    originalPreventDefault.call(this);
  };
  typedE.isDefaultPrevented = function () {
    return typedE._isDefaultPrevented;
  };
  typedE.stopPropagation = function () {
    typedE._isPropagationStopped = true;
    originalStopPropagation.call(this);
  };
  typedE.isPropagationStopped = function () {
    return typedE._isPropagationStopped;
  };
  typedE._isMyReactEvent = true;
};
