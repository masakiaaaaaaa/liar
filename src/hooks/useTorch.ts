import { useState, useCallback } from 'react';
import { Torch } from '../platform';

export const useTorch = () => {
    const [on, setOn] = useState(false);
    const [available, setAvailable] = useState(false);
    const [fallbackMode, setFallbackMode] = useState(false);

    const init = useCallback(async () => {
        const isNativeAvailable = await Torch.isAvailable();
        setAvailable(isNativeAvailable);
        if (!isNativeAvailable) {
            // If native torch isn't available, we might assume fallback (Screen Torch) is needed
            // But for now, we just mark it as unavailable effectively, or handle fallback logic in UI
            setFallbackMode(true);
        }
    }, []);

    const toggle = useCallback(async (desiredState: boolean) => {
        try {
            if (desiredState) {
                await Torch.on();
                setOn(true);
            } else {
                await Torch.off();
                setOn(false);
            }
        } catch (e) {
            console.warn("Torch control failed", e);
            // If native torch fails, maybe switch to fallback?
            setFallbackMode(true);
            setOn(desiredState); // Still set state to trigger UI fallback
        }
    }, []);

    return {
        init,
        on,
        toggle,
        available,
        fallbackMode
    };
};
