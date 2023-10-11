const waveVertexShader = `

    uniform sampler2D texture; 
    uniform vec3 color; 
    uniform float opacity; 
    void main() { 
        
        gl_FragColor = vec4(color, opacity) * texture2D( texture, gl_PointCoord ); 
        // gl_FragColor = vec4(1,1,1,1); 
    }

`;

export default waveVertexShader;
