export function hideBootstrapModal(modalId) {
  const element = document.getElementById(modalId);
  if (!element) return;

  if (window.bootstrap?.Modal) {
    const instance =
      window.bootstrap.Modal.getInstance(element) ??
      window.bootstrap.Modal.getOrCreateInstance(element);
    instance.hide();
    return;
  }

  const dismissBtn = element.querySelector('[data-bs-dismiss="modal"]');
  if (dismissBtn) {
    dismissBtn.click();
  }
}

export function showBootstrapModal(modalId) {
  const element = document.getElementById(modalId);
  if (!element || !window.bootstrap?.Modal) return;
  window.bootstrap.Modal.getOrCreateInstance(element).show();
}
