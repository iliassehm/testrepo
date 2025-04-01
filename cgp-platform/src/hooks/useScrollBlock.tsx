import { createContext, useContext, useEffect, useState } from "react";

export type ScrollBlockContextType = {
    block(id: string): () => void
    release(id: string): void
}

export const ScrollBlockContext = createContext<ScrollBlockContextType>({
    block() {
        return () => { /**  */ }
    },
    release() { /** */ }
});

/**
 * Provider component that manages scroll blocking functionality for the application.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode | React.ReactNode[]} props.children - Child elements to render within the provider
 * 
 * @returns {JSX.Element} ScrollBlockContext.Provider component with block/release functionality
 * 
 * @example
 * <ScrollBlockProvider>
 *   <App />
 * </ScrollBlockProvider>
 * 
 * @remarks
 * This provider maintains a Set of lock IDs to manage scroll blocking states.
 * When any locks exist, the body overflow is set to 'hidden'.
 * The provider exposes two methods through context:
 * - block(id: string): Adds a scroll lock and returns a release function
 * - release(id: string): Removes a specific scroll lock
 */
export function ScrollBlockProvider(props: { children: React.ReactNode | React.ReactNode }) {
    const [locks, setLocks] = useState(new Set<string>())
    useEffect(() => {
        if (locks.size) document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    })
    function release(id: string) {
        setLocks(s => {
            s.delete(id)
            return new Set(s)
        })
    }
    function block(id: string) {
        setLocks(s => {
            s.add(id)
            return new Set(s)
        })
        return release.bind(null, id)
    }
    return <ScrollBlockContext.Provider {...props} value={{ block, release }} />
}

/**
 * Custom hook to manage scroll blocking functionality within a React component.
 * @param {string} id - Unique identifier for the scroll block instance. Defaults to a random UUID.
 * @returns {Object} An object containing block and release methods bound to the provided ID.
 * @property {Function} block - Method to block scrolling for the specified ID.
 * @property {Function} release - Method to release scroll blocking for the specified ID.
 */
export function useScrollBlock(id: string = crypto.randomUUID()) {
    const { block, release } = useContext(ScrollBlockContext)
    return {
        block: block.bind(null, id),
        release: release.bind(null, id)
    }
}