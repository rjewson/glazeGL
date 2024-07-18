import { Mesh } from "./glazeGL/core/Mesh";
import { Program } from "./glazeGL/core/Program";
import { Renderer } from "./glazeGL/core/Renderer";
import { Texture } from "./glazeGL/core/Texture";
import { Camera } from "./glazeGL/displaylist/Camera";
import { Sprite } from "./glazeGL/displaylist/Sprite";
import { SpriteTexture } from "./glazeGL/displaylist/SpriteTexture";
import { Stage } from "./glazeGL/displaylist/Stage";
import { Quad } from "./glazeGL/geom/Quad";
import { Rectangle } from "./glazeGL/geom/Rectangle";
import { SpriteRenderer } from "./glazeGL/renderers/sprite/SpriteRenderer";
import image from "./assets/texture.jpg";

// const vertex = `
//                 attribute vec2 uv;
//                 attribute vec2 position;
//                 varying vec2 vUv;
//                 void main() {
//                     vUv = uv;
//                     gl_Position = vec4(position, 0.0, 1.0);
//                 }
//             `;

//             const fragment = `
//                 precision highp float;
//                 uniform sampler2D uSampler;
//                 varying vec2 vUv;
//                 void main() {
//                     vec3 tex = texture2D(uSampler, vUv).rgb;
//                     //gl_FragColor.rgba = vec4(1.0,0.0,0.0,1.0);
//                     gl_FragColor.rgba = vec4(tex,1.0);
//                 }
//             `;

//             const renderer = new Renderer({ width: 400, height: 400 });

//             document.body.appendChild(renderer.canvas);

//             const texture = new Texture(renderer);

//             const img = new Image();
            
//             img.src = image;//"texture.jpg";

//             const uniforms = {
//                 uSampler: { value: texture },
//             };

//             const program = new Program(renderer, { vertex, fragment, uniforms });

//             const geometry = new Quad(renderer);

//             const renderable = new Mesh(renderer, { geometry, program, mode: WebGLRenderingContext.TRIANGLE_STRIP });

//             img.onload = () => {
//                 texture.image = img;
//                 texture.update();
//                 renderer.render({ renderable });
//             };


// const renderer = new Renderer({ width: 400, height: 400 });
// // renderer.setBlendFunc(WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE_MINUS_SRC_ALPHA);
// document.body.appendChild(renderer.canvas);

// const texture = new Texture(renderer, {
//     image: new Uint8Array([191, 25, 54, 255, 96, 18, 54, 255, 96, 18, 54, 255, 37, 13, 53, 255]),
//     width: 2,
//     height: 2,
//     magFilter: 0x2600, //gl.NEAREST,
// });
// const camera = new Camera();
// camera.resize(400, 400);
// const stage = new Stage();
// const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, 2, 2));

// const sprite = new Sprite();
// sprite.texture = spriteTexture;
// sprite.position.x = 200;
// sprite.position.y = 200;
// sprite.scale.x = 50;
// sprite.scale.y = 50;
// stage.addChild(sprite);

// const sprite2 = new Sprite();
// sprite2.texture = spriteTexture;
// sprite2.position.x = 2;
// sprite2.position.y = 2;
// sprite2.scale.x = 1;
// sprite2.scale.y = 1;
// sprite.addChild(sprite2);

// const displayList = new SpriteRenderer(renderer);
// displayList.addStage(stage);
// displayList.resize(400, 400);

// camera.focus(0, 0);

// const draw = () => {
//     // console.log(sprite);
//     // debugger;
//     renderer.render({ renderable: displayList });
//     sprite.rotation += 0.01;
//     sprite2.rotation += 0.01;
//     window.requestAnimationFrame(draw);
// }

// window.requestAnimationFrame(draw);

const renderer = new Renderer({ width: 1000, height: 1000 });

            document.body.appendChild(renderer.canvas);

            const texture = new Texture(renderer, {
                image: new Uint8Array([191, 25, 54, 255, 96, 18, 54, 255, 96, 18, 54, 255, 37, 13, 53, 255]),
                width: 2,
                height: 2,
                magFilter: 0x2600, //gl.NEAREST,
            });
            const camera = new Camera();
            camera.resize(1000, 1000);
            const stage = new Stage();
            const spriteTexture = new SpriteTexture(texture, new Rectangle(0, 0, 2, 2));

            const count = 100;

            const sprites = [];
            for (var x = 0; x < count; x++) {
                for (var y = 0; y < count; y++) {
                    const sprite = new Sprite();
                    sprite.texture = spriteTexture;
                    sprite.position.x = 5 + (x * 10);
                    sprite.position.y = 5 + (y * 10);
                    sprite.scale.x = 4;
                    sprite.scale.y = 4;
                    stage.addChild(sprite);
                    sprites.push(sprite);
                }
            }

            const displayList = new SpriteRenderer(renderer);
            displayList.addStage(stage);
            displayList.resize(1000, 1000);

            camera.focus(0, 0);
            let time = 0;
            const draw = () => {
                renderer.render({ renderable: displayList });
                for (const sprite of sprites) {
                    sprite.rotation += 0.1;
                    // sprite.scale.x = sprite.scale.y = 5 + 20*Math.sin(time);
                }
                time+=0.001;
                window.requestAnimationFrame(draw);
            };

            window.requestAnimationFrame(draw);