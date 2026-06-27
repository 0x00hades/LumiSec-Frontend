import { useCallback, useEffect, useRef } from "react";

const MODAL_SELECTOR = ".asset-inventory-modal.show";

/**
 * Backdrop click + ESC dismiss for Asset Inventory custom modals.
 * ESC only closes the topmost open modal when multiple are stacked.
 */
export default function useModalDismiss(onClose) {
  const modalRef = useRef(null);

  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      const modals = document.querySelectorAll(MODAL_SELECTOR);
      const topModal = modals[modals.length - 1];
      if (topModal && modalRef.current === topModal) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return { modalRef, handleBackdropClick };
}
