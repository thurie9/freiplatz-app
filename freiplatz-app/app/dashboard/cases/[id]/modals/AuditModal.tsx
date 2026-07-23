"use client";

import Modal from "@/components/ui/Modal";

interface AuditModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuditModal({
  open,
  onClose,
}: AuditModalProps) {
  return (
    <Modal
      open={open}
      title="📋 Audit Log"
      onClose={onClose}
    >
      <p>Audit Modal coming soon.</p>
    </Modal>
  );
}