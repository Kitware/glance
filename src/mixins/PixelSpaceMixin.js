import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkPixelSpaceCallbackMapper from '@kitware/vtk.js/Rendering/Core/PixelSpaceCallbackMapper';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';

function defer() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject,
  };
}

const mixinKey = '$$PixelSpaceMixinData';

export default {
  props: {
    viewProxyId: {
      type: String,
      required: true,
    },
  },
  computed: {
    view() {
      return this.$proxyManager.getProxyById(this.viewProxyId);
    },
  },
  created() {
    this[mixinKey] = {};
    this[mixinKey].deferred = [];

    this[mixinKey].actor = vtkActor.newInstance();
    this[mixinKey].mapper = vtkPixelSpaceCallbackMapper.newInstance();
    this[mixinKey].pointsPd = vtkPolyData.newInstance();

    this[mixinKey].mapper.setInputData(this[mixinKey].pointsPd);
    this[mixinKey].mapper.setCallback(
      (coords, camera, aspect, depth, winSize) => {
        const flippedCoords = coords.map((coord) => [
          coord[0],
          winSize[1] - coord[1],
          coord[2],
          coord[3],
        ]);

        const { deferred } = this[mixinKey];
        deferred.map(({ resolve }) => resolve(flippedCoords));
        this[mixinKey].deferred.length = 0;
      }
    );

    this[mixinKey].actor.setMapper(this[mixinKey].mapper);
  },
  mounted() {
    this.view.getRenderer().addActor(this[mixinKey].actor);
  },
  beforeDestroy() {
    this.view.getRenderer().removeActor(this[mixinKey].actor);
    this[mixinKey].mapper.delete();
    this[mixinKey].actor.delete();
  },
  methods: {
    mapToPixelSpace(coords3d) {
      const points = this[mixinKey].pointsPd.getPoints().getData();
      const newPoints = [...points, ...coords3d.flat()];
      this[mixinKey].pointsPd.getPoints().setData(newPoints, 3);
      this[mixinKey].pointsPd.modified();

      const startIndex = points.length / 3;
      const endIndex = newPoints.length / 3;
      const deferred = defer();
      this[mixinKey].deferred.push(deferred);

      return deferred.promise.then((coords2d) => {
        return coords2d.slice(startIndex, endIndex);
      });
    },
  },
};
