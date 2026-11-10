import { $, holen, schwellenZeichnen, SPRACHE } from './gemeinsam.js';

const ziel = $('#schwellen');
try {
  const { stand, konfig } = await holen('/api/zusagen');
  schwellenZeichnen(ziel, stand, konfig);
} catch {
  ziel.textContent = SPRACHE === 'en' ? 'Progress could not be loaded.' : 'Der Zwischenstand konnte nicht geladen werden.';
}
