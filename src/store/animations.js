export default ({ animationManager }) => {
  return {
    namespaced: true,
    state: {
      playing: false,
      currentFrame: '0.0',
      frames: [],
    },
    mutations: {
      setCurrentFrame(state, value) {
        state.currentFrame = value;
      },
      setPlaying(state, value) {
        state.playing = value;
      },
      setFrames(state, value) {
        state.frames = value;
      },
    },
    actions: {
      initializeAnimations({ commit }) {
        animationManager.onCurrentFrameChanged(() => {
          commit('setCurrentFrame', animationManager.getCurrentFrame());
        });
        animationManager.onFramesChanged(() => {
          commit('setFrames', animationManager.getFrames());
        });
        commit('setCurrentFrame', animationManager.getCurrentFrame());
        commit('setFrames', animationManager.getFrames());
      },
      play({ commit }) {
        commit('setPlaying', true);
        animationManager.play();
        animationManager.onDonePlaying(() => {
          commit('setPlaying', false);
          animationManager.onDonePlaying(() => {});
        });
      },
      pause({ commit }) {
        commit('setPlaying', false);
        animationManager.pause();
      },
      nextFrame() {
        animationManager.nextFrame();
      },
      previousFrame() {
        animationManager.previousFrame();
      },
      firstFrame() {
        animationManager.firstFrame();
      },
      lastFrame() {
        animationManager.lastFrame();
      },
      setFrameIndex(payload, index) {
        animationManager.setFrameIndex(index);
      },
    },
  };
};
