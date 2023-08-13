/**
 * @internal
 */
export const getNativeEventName = (eventName: string, tagName: string, props: Record<string, unknown>) => {
  let isCapture = false;

  let nativeName = eventName;

  if (eventName.endsWith("Capture")) {
    isCapture = true;

    nativeName = eventName.split("Capture")[0];
  }
  if (nativeName === "DoubleClick") {
    nativeName = "dblclick";
  } else if (nativeName === "Change") {
    if (tagName === "input") {
      if (props.type === "radio" || props.type === "checkbox") {
        nativeName = "click";
      } else {
        nativeName = "input";
      }
    } else {
      nativeName = "change";
    }
  } else {
    nativeName = nativeName.toLowerCase();
  }

  return { nativeName, isCapture };
};
