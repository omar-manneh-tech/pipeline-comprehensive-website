import { use } from "react";
import { StaffEditor } from "@/components/Admin/StaffEditor";

export default function StaffEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <StaffEditor staffId={id} />;
}

