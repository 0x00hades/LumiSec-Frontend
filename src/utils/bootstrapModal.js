import { Modal } from "bootstrap";

export function hideBootstrapModal(modalId) {
  const element = document.getElementById(modalId);
  if (!element) return;

  const instance = Modal.getInstance(element) ?? Modal.getOrCreateInstance(element);
  instance.hide();
}

export function showBootstrapModal(modalId) {
  const element = document.getElementById(modalId);
  if (!element) return;

  Modal.getOrCreateInstance(element).show();
}
