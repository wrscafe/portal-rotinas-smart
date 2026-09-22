"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteChecklist(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("checklist_viaturas")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Não foi possível excluir o checklist: " + error.message);
  }

  revalidatePath("/checklist");
  redirect("/checklist");
}
