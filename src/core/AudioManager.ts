export default class AudioManager {
  audios: Map<string, HTMLAudioElement>;

  constructor(audios: Array<Array<string>>) {
    this.audios = new Map<string, HTMLAudioElement>

    this.initAudios(audios);
  }

  initAudios(audios: Array<Array<string>>) {
    for (const audio of audios) {
      const audioElement: HTMLAudioElement = new Audio(`./src/assets/audios/${audio[1]}`);
      this.audios.set(audio[0], audioElement);
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
    for (const [key] of this.audios) {
      this.stopSoundEffect(key);
    }
  }
}