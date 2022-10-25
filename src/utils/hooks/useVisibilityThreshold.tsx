import { useEffect, useState } from 'react';

export type Threshold =
    | { isAbove?: boolean; isBelow?: never; intersectionRatio?: number }
    | { isAbove?: never; isBelow?: boolean; intersectionRatio?: number };

/**
 * This hooks checks the intersection between the viewport and
 * the target element. The target element needs to be a descendant of the viewport element.
 * The result is a object with either isAbove or isBelow booleans.
 * @param viewport Viewport element to check against
 * @param target The element to have visibility observed based on threshold
 * @param options
 * @returns
 */
export const useVisibilityThreshold = (
    viewport: HTMLElement,
    target: HTMLElement,
    options = { threshold: 0.5 }
) => {
    const [threshold, updateThreshold] = useState<Threshold>({});
    const optThreshold = options?.threshold ?? 0.0;
    useEffect(() => {
        if (viewport && target && optThreshold) {
            const opts: IntersectionObserverInit = {
                root: viewport,
                threshold: [0.0, optThreshold],
            };

            const cb: IntersectionObserverCallback = (entries) => {
                entries.forEach(({ intersectionRatio }) => {
                    if (intersectionRatio > optThreshold) {
                        updateThreshold({ isAbove: true, intersectionRatio });
                    } else {
                        updateThreshold({ isBelow: true, intersectionRatio });
                    }
                });
            };

            const observer = new IntersectionObserver(cb, opts);
            observer.observe(target);

            // clean-up
            return () => observer.disconnect();
        }
    }, [viewport, target, optThreshold]);

    return threshold;
};
