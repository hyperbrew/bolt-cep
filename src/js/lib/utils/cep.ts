import { csi } from "./bolt";

/**
 * Register all possible keyboard shortcuts on Mac and Windows for you CEP Panel
 * Warning: Note that certain keys will not work per OS regardless of registration
 */

export const keyRegisterOverride = () => {
  //@ts-ignore
  const platform = navigator.platform.substring(0, 3);
  let maxKey = 0;
  if (platform === "Mac") maxKey = 126; // Mac Max Key Code
  else if (platform === "Win") maxKey = 222; // HTML Max Key Code
  let allKeys: {
    keyCode: number;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
  }[] = [];
  for (let k = 0; k <= maxKey; k++) {
    for (let j = 0; j <= 15; j++) {
      const guide = (j >>> 0).toString(2).padStart(4, "0");
      allKeys.push({
        keyCode: k,
        ctrlKey: guide[0] === "1",
        altKey: guide[1] === "1",
        shiftKey: guide[2] === "1",
        metaKey: guide[3] === "1",
      });
    }
  }
  const keyRes = csi.registerKeyEventsInterest(JSON.stringify(allKeys));
  console.log("Key Events Registered Completed: " + keyRes);
};
