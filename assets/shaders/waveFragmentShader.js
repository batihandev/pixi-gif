const waveFragmentShader = `
    uniform float size;
    uniform float frequency1;
    uniform float frequency2;
    uniform float offset1;
    uniform float offset2;
    uniform float waveHeight1;
    uniform float waveHeight2;


    void main() { 
        vec3 curPos;
        curPos = vec3(position.x, 1, position.z);
        curPos[1] = cos(position.x * frequency1 + offset1) * sin(position.z * frequency1 + offset1) * waveHeight1 + cos(position.x * frequency2 + offset2) * sin(position.z * frequency2 + offset2) * waveHeight2;


        gl_PointSize = size;//min(size * curPos[1] * 0.2, 4.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( curPos, 1.0 ); 
    }

`;

export default waveFragmentShader;
