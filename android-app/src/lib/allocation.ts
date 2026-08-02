/**
 * Pure verdelings- en hussellogica voor examengeneratie.
 *
 * Bewust gescheiden van `generate.ts`: dat bestand praat met de database en
 * importeert daarom `server-only`, wat het onbruikbaar maakt in tests. Deze
 * functies zijn puur en dus direct te testen — precies de functies waar een
 * fout het minst opvalt en het meest schaadt.
 */

/**
 * Mulberry32: kleine, snelle PRNG voor het husselen van vragen en opties.
 * Uitdrukkelijk niet cryptografisch; daar is `node:crypto` voor.
 */
export function createRandom(seed?: number): () => number {
  if (seed === undefined) return Math.random;
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates. Geeft een nieuwe array terug; de invoer blijft ongemoeid. */
export function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const a = result[i]!;
    const b = result[j]!;
    result[i] = b;
    result[j] = a;
  }
  return result;
}

/**
 * Verdeelt `total` vragen over examengebieden naar rato van hun weging.
 *
 * Grootste-restmethode (Hare-quota): eerst krijgt elk gebied zijn hele deel,
 * daarna gaan de resterende plaatsen naar de gebieden met de grootste
 * afgeronde rest. Zo telt het resultaat altijd exact op tot `total` — bij
 * gewoon afronden zou een examen van 40 vragen er zomaar 39 of 41 worden.
 */
export function allocateByWeight(
  weights: Array<{ code: string; weight: number }>,
  total: number,
): Map<string, number> {
  const sum = weights.reduce((acc, w) => acc + w.weight, 0);
  if (sum <= 0) return new Map(weights.map((w) => [w.code, 0]));

  const exact = weights.map((w) => ({
    code: w.code,
    value: (w.weight / sum) * total,
  }));

  const allocation = new Map<string, number>();
  let assigned = 0;
  for (const item of exact) {
    const floor = Math.floor(item.value);
    allocation.set(item.code, floor);
    assigned += floor;
  }

  const remainders = exact
    .map((item) => ({ code: item.code, rest: item.value - Math.floor(item.value) }))
    .sort((a, b) => b.rest - a.rest);

  let index = 0;
  while (assigned < total && remainders.length > 0) {
    const target = remainders[index % remainders.length]!;
    allocation.set(target.code, (allocation.get(target.code) ?? 0) + 1);
    assigned++;
    index++;
  }

  return allocation;
}
