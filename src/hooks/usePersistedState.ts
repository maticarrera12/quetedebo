import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { readStored, writeStored } from "../utils/storage";

// useState that survives a reload or the system closing the app in the background.
export const usePersistedState = <T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => readStored(key, initial, isValid));

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
};
