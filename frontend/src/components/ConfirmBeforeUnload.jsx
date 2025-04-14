import { useEffect } from "react";

const ConfirmBeforeUnload = () => {
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to refresh? Your progress will be lost!";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return null;
};

export default ConfirmBeforeUnload;
