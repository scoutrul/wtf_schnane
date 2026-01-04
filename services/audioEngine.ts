
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private currentOscillator: OscillatorNode | null = null;
  private currentGain: GainNode | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private stopCurrentSound() {
    if (this.currentOscillator) {
      try {
        this.currentOscillator.stop();
      } catch (e) {
        // Игнорируем ошибки, если осциллятор уже остановлен
      }
      this.currentOscillator = null;
    }
    if (this.currentGain) {
      try {
        this.currentGain.disconnect();
      } catch (e) {
        // Игнорируем ошибки
      }
      this.currentGain = null;
    }
  }

  playClick(freq: number = 880, duration: number = 0.05, vol: number = 0.03) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Deep, pleasant "thump" with pitch from word
  // duration определяется из rhythm: '1×1/4' = 0.5s, '2×1/8' = 0.5s, '2×1/16' = 0.25s
  playWord(pitch: number, rhythm?: string) {
    if (!this.ctx) return;
    
    // Останавливаем предыдущий звук, если он играет
    this.stopCurrentSound();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Сохраняем ссылки для возможности остановки
    this.currentOscillator = osc;
    this.currentGain = gain;

    osc.type = 'sine';
    
    // Парсим rhythm для определения длительности
    // Формат: '2×1/8' означает 2 восьмых ноты
    // BPM = 96, значит одна четвертная = 60/96 = 0.625s
    let duration = 0.5; // По умолчанию короткий звук (увеличено)
    if (rhythm) {
      const match = rhythm.match(/(\d+)×1\/(\d+)/);
      if (match) {
        const count = parseInt(match[1]); // количество нот
        const noteValue = parseInt(match[2]); // знаменатель (4, 8, 16)
        // Длительность одной ноты: (60/BPM) * (4/noteValue)
        const beatDuration = 60 / 96; // 0.625s для четвертной при BPM=96
        const noteDuration = beatDuration * (4 / noteValue);
        duration = count * noteDuration * 2.5; // Умножаем на 2.5 для более заметной разницы
      }
    }

    // Используем pitch из констант: начинаем с него и падаем вниз для эффекта "thump"
    const startFreq = pitch;
    const endFreq = pitch * 0.3; // Падаем до 30% от исходной частоты
    const freqRampTime = Math.min(0.15, duration * 0.2); // Время падения частоты (20% от длительности, но не больше 0.15s)
    
    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + freqRampTime);
    // После падения частоты держим её на низком уровне
    osc.frequency.setValueAtTime(endFreq, this.ctx.currentTime + freqRampTime);

    // Звук держится на полной громкости большую часть времени, затухает только в конце
    const sustainTime = duration * 0.7; // 70% времени на полной громкости
    const fadeTime = duration * 0.3; // 30% времени на затухание
    
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime + sustainTime); // Держим громкость
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration); // Затухание в конце

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
    
    // Очищаем ссылки после окончания звука
    osc.onended = () => {
      if (this.currentOscillator === osc) {
        this.currentOscillator = null;
      }
      if (this.currentGain === gain) {
        this.currentGain = null;
      }
    };
  }
}

export const audioEngine = new AudioEngine();
