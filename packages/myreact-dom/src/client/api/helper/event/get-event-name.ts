/**
 * @internal
 */
export const getNativeEventName = (eventName: string, tagName: string, props: Record<string, unknown>) => {
  let isCapture = false;

  let nativeName = eventName;

  let lowerCased = nativeName.toLowerCase();

  if (eventName.endsWith("Capture")) {
    isCapture = true;

    nativeName = eventName.split("Capture")[0];

    lowerCased = nativeName.toLowerCase();
  }

  if (lowerCased === "doubleclick") {
    nativeName = "dblclick";
  } else if (lowerCased === "change") {
    if (tagName === "input") {
      if (props.type === "radio" || props.type === "checkbox") {
        nativeName = "click";
      } else {
        nativeName = "input";
      }
    } else if (tagName === "textarea") {
      nativeName = "input";
    } else {
      nativeName = "change";
    }
  } else if (lowerCased === "focus") {
    nativeName = "focusin";
  } else if (lowerCased === "blur") {
    nativeName = "focusout";
  } else {
    nativeName = lowerCased;
  }

  return { nativeName, isCapture };
};
