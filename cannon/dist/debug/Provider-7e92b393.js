import React, { useState, useRef, useMemo, useEffect } from 'react';
import { _ as _extends, c as context } from './index-9ebb847f.js';
import 'three';
import { useThree, useFrame } from 'react-three-fiber';

function decodeBase64(base64, enableUnicode) {
    var binaryString = atob(base64);
    if (enableUnicode) {
        var binaryView = new Uint8Array(binaryString.length);
        for (var i = 0, n = binaryString.length; i < n; ++i) {
            binaryView[i] = binaryString.charCodeAt(i);
        }
        return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
    }
    return binaryString;
}

function createURL(base64, sourcemapArg, enableUnicodeArg) {
    var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
    var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
    var source = decodeBase64(base64, enableUnicode);
    var start = source.indexOf('\n', 10) + 1;
    var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
    var blob = new Blob([body], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
    var url;
    return function WorkerFactory(options) {
        url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
        return new Worker(url, options);
    };
}

/* eslint-enable */

function Provider({
  children,
  step = 1 / 60,
  gravity = [0, -10, 0],
  tolerance = 0.001,
  iterations = 5,
  allowSleep = false,
  broadphase = 'Naive',
  axisIndex = 0,
  defaultContactMaterial = {
    contactEquationStiffness: 1e6
  },
  size = 1000
}) {
  const {
    gl,
    invalidate
  } = useThree();
  const [worker] = useState(() => new WorkerFactory());
  const [refs] = useState({});
  const [buffers] = useState(() => ({
    positions: new Float32Array(size * 3),
    quaternions: new Float32Array(size * 4)
  }));
  const [events] = useState({});
  const [subscriptions] = useState({});
  const bodies = useRef({});
  const loop = useMemo(() => () => {
    if (buffers.positions.byteLength !== 0 && buffers.quaternions.byteLength !== 0) {
      worker.postMessage(_extends({
        op: 'step'
      }, buffers), [buffers.positions.buffer, buffers.quaternions.buffer]);
    }
  }, []);
  const prevPresenting = useRef(false);
  useFrame(() => {
    if (gl.xr.isPresenting && !prevPresenting.current) {
      gl.xr.getSession().requestAnimationFrame(loop);
    }

    if (!gl.xr.isPresenting && prevPresenting.current) {
      requestAnimationFrame(loop);
    }

    prevPresenting.current = gl.xr.isPresenting;
  });
  useEffect(() => {
    worker.postMessage({
      op: 'init',
      props: {
        gravity,
        tolerance,
        step,
        iterations,
        broadphase,
        allowSleep,
        axisIndex,
        defaultContactMaterial
      }
    });

    worker.onmessage = e => {
      switch (e.data.op) {
        case 'frame':
          buffers.positions = e.data.positions;
          buffers.quaternions = e.data.quaternions;
          e.data.observations.forEach(([id, value]) => subscriptions[id](value));

          if (gl.xr.isPresenting) {
            gl.xr.getSession().requestAnimationFrame(loop);
          } else {
            requestAnimationFrame(loop);
          }

          if (e.data.active) invalidate();
          break;

        case 'sync':
          bodies.current = e.data.bodies.reduce((acc, id) => _extends({}, acc, {
            [id]: e.data.bodies.indexOf(id)
          }), {});
          break;

        case 'event':
          switch (e.data.type) {
            case 'collide':
              events[e.data.target](_extends({}, e.data, {
                target: refs[e.data.target],
                body: refs[e.data.body]
              }));
              break;

            case 'rayhit':
              events[e.data.ray.uuid](_extends({}, e.data, {
                body: e.data.body ? refs[e.data.body] : null
              }));
              break;
          }

          break;
      }
    };

    loop();
    return () => worker.terminate();
  }, []);
  const api = useMemo(() => ({
    worker,
    bodies,
    refs,
    buffers,
    events,
    subscriptions
  }), [worker, bodies, refs, buffers, events, subscriptions]);
  return /*#__PURE__*/React.createElement(context.Provider, {
    value: api
  }, children);
}

export default Provider;