import { mapState, mapActions } from 'vuex';

// ----------------------------------------------------------------------------
// Component API
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------

export default {
  name: 'AnimationControls',
  computed: {
    ...mapState('animations', {
      playing: (state) => state.playing,
      currentFrame: (state) => state.currentFrame,
      frames: (state) => state.frames,
    }),
    isOnFirstFrame() {
      return this.frames.length > 0 && this.currentFrame === this.frames[0];
    },
    isOnLastFrame() {
      return (
        this.frames.length > 0 &&
        this.currentFrame === this.frames[this.frames.length - 1]
      );
    },
  },
  methods: {
    setCurrentFrame(value) {
      this.setFrameIndex(this.frames.indexOf(value));
    },
    ...mapActions('animations', [
      'play',
      'pause',
      'nextFrame',
      'previousFrame',
      'firstFrame',
      'lastFrame',
      'setFrameIndex',
    ]),
  },
};
