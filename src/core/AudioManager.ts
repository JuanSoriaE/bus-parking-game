import { AudioSettings } from "../types/main";

export default class AudioManager {
  audios: Map<string, HTMLAudioElement>;

  constructor() {
    this.audios = new Map<string, HTMLAudioElement>;
  }

  setAudios(audios: Array<AudioSettings>) {
    for (const audio of audios) {
      const audioElement: HTMLAudioElement = document.getElementById(audio.srcId) as HTMLAudioElement;
      audioElement.volume = audio.volume;
      this.audios.set(audio.name, audioElement);
    }
  };
  
  playSoundEffect(name: string) {
    const audio: HTMLAudioElement | undefined = this.audios.get(name);
    if (!audio) return;

    audio.play();
  }

  playSoundEffectInfinite(name: string) {
    const audio: HTMLAudioElement | undefined = this.audios.get(name);
    if (!audio) return;

    audio.loop = true;
    audio.play();
  }

  stopSoundEffect(name: string) {
    const audio: HTMLAudioElement | undefined = this.audios.get(name);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  stopAllSoundEffects() {
    for (const [key] of this.audios)
      this.stopSoundEffect(key);
  }
}