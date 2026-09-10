"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Atualiza status e resposta de uma solicitação
export async function atualizarSolicitacao(id: string, formData: FormData) {
  const supabase = await createClient();

  const status = formData.get("status") as string;
  const resposta = formData.get("resposta") as string;

  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("solicitacoes")
    .update({
      status,
      resposta: resposta || null,
      respondido_por: userData.user?.id ?? null,
      respondido_em: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar solicitação:", error);
    throw new Error("Não foi possível atualizar a solicitação.");
  }

  revalidatePath("/solicitacoes");
  revalidatePath(`/solicitacoes/${id}`);
  redirect("/solicitacoes");
}

// Exclui definitivamente uma solicitação
export async function excluirSolicitacao(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("solicitacoes").delete().eq("id", id);

  if (error) {
    console.error("Erro ao excluir solicitação:", error);
    throw new Error("Não foi possível excluir a solicitação.");
  }

  revalidatePath("/solicitacoes");
  redirect("/solicitacoes");
}
