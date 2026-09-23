// src/utils/aditivo.ts

/**
 * Calcula a quantidade de aditivo Bardahl Max S10 (em mL)
 * necessária para uma quantidade de diesel abastecida.
 *
 * Regra: 1 frasco de 500 mL para cada 200 litros de diesel.
 */
const ML_ADITIVO_POR_LITRO = 500 / 200; // 2.5 mL por litro

export function calcularAditivoMl(litrosDiesel: number): number {
  if (litrosDiesel <= 0) return 0;

  const valor = litrosDiesel * ML_ADITIVO_POR_LITRO;

  // Arredonda para 2 casas decimais (evita dízimas tipo 437.500000001)
  return Math.round(valor * 100) / 100;
}
