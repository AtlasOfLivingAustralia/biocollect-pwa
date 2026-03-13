import { useEffect, useRef } from "react";

export function useWhyDidYouUpdate<T extends Record<string, unknown>>(name: string, props: T) {
  const prevRef = useRef<T | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    const changed: Array<{ key: keyof T; from: unknown; to: unknown }> = [];

    if (prev) {
      for (const key of Object.keys(props) as (keyof T)[]) {
        if (!Object.is(prev[key], props[key])) {
          changed.push({ key, from: prev[key], to: props[key] });
        }
      }
      if (changed.length) {
        console.groupCollapsed(`[why-did-you-update] ${name} (${changed.length} change${changed.length > 1 ? 's' : ''})`);
        changed.forEach(c => { console.log(String(c.key), c.from, '→', c.to) });
        console.trace();
        console.groupEnd();
      }
    } else {
      console.log(`[why-did-you-update] ${name} mounted`, props);
    }

    prevRef.current = props;
  });
}