import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Trilfeedback.
 *
 * Spaarzaam gebruikt en alleen waar het iets toevoegt dat het scherm niet kan:
 * bij het nakijken van een antwoord kijk je naar de toelichting, niet naar het
 * vinkje, en aan het einde van de examentijd kijk je misschien helemaal niet.
 * Trillen bij elke tik zou van informatie ruis maken.
 *
 * Alle aanroepen falen stil. In een gewone browser bestaat de plugin niet, en
 * op een toestel waar de gebruiker trillen heeft uitgezet hoort dat geen fout
 * te zijn.
 */

async function safely(work: () => Promise<unknown>): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await work();
  } catch {
    // Trillen is een extraatje; het mislukken ervan mag niets breken.
  }
}

/** Kort tikje: een antwoord is geregistreerd. */
export async function tap(): Promise<void> {
  await safely(() => Haptics.impact({ style: ImpactStyle.Light }));
}

/** Goed antwoord. */
export async function success(): Promise<void> {
  await safely(() => Haptics.notification({ type: NotificationType.Success }));
}

/** Fout antwoord. */
export async function failure(): Promise<void> {
  await safely(() => Haptics.notification({ type: NotificationType.Error }));
}

/** De examentijd is verstreken. */
export async function alarm(): Promise<void> {
  await safely(() => Haptics.notification({ type: NotificationType.Warning }));
}
