import { completeNavigationProgress, NavigationProgress as NavProgress, resetNavigationProgress, startNavigationProgress } from "@mantine/nprogress";
import { useEffect } from "react";
import { useNavigation } from "react-router";

export function NavigationProgress() {
  const { state } = useNavigation();

  useEffect(() => {
    if (state === 'loading') {
      startNavigationProgress();
    } else {
      completeNavigationProgress();
      resetNavigationProgress();
    }
  }, [state]);

  return <NavProgress stepInterval={0} />
}