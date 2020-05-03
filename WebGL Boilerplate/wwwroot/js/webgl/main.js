
/**
 * Entry point into graphics rendering
 */

function main() {

    console.debug("Starting RenderingEngine");

    var renderEngine = new RenderingEngine();
    renderEngine.init();

    var sceneGraph = [];

    // make scene graph
    var cube = new Cube(); // eventaully specify the coord
    sceneGraph.push(cube);

    renderEngine.start(sceneGraph);  
};
