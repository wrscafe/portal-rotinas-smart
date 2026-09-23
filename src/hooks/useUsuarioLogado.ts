// src/hooks/useUsuarioLogado.ts
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useUsuarioLogado() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user ?? null);
      setCarregando(false);
    });
  }, []);

  return { usuario, carregando };
}

