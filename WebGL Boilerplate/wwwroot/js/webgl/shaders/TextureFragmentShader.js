let fsTextureSource = `
//precision mediump float;

//varying highp vec2 vTextureCoord; // uv coordinate
//varying highp vec3 vLighting;

//uniform sampler2D uSampler;

void main() {
	//highp vec4 albedo = texture2D(uSampler, vTextureCoord);

	//gl_FragColor = vec4(albedo.rgb * vLighting, albedo.a);
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
