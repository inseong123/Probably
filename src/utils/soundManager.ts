class SoundManager {
  private audioContext: AudioContext | null = null
  private masterVolume = 0.3

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // 성공 사운드: 밝은 "짹짹" 소리
  playSuccess() {
    const ctx = this.initAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1)

    osc.start(now)
    osc.stop(now + 0.2)
  }

  // 실패 사운드: 낮은 "부웅" 소리
  playFail() {
    const ctx = this.initAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3)

    osc.start(now)
    osc.stop(now + 0.3)
  }

  // 레벨업 사운드: 상승하는 "치르르릉" 소리
  playLevelUp() {
    const ctx = this.initAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(this.masterVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.4)

    osc.start(now)
    osc.stop(now + 0.4)
  }

  // 금화 소리: 높은 "딩" 소리
  playGoldSound() {
    const ctx = this.initAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(this.masterVolume * 0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    osc.frequency.setValueAtTime(1200, now)
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.1)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  // 버튼 클릭 소리
  playClick() {
    const ctx = this.initAudioContext()
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    gain.gain.setValueAtTime(this.masterVolume * 0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

    osc.frequency.setValueAtTime(400, now)

    osc.start(now)
    osc.stop(now + 0.08)
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }
}

export const soundManager = new SoundManager()
